const { Order, Product, User } = require('../models');
const { sequelize } = require('../config/database');
const { Op, Sequelize } = require('sequelize');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    const now = new Date();
    let since, until, dateTrunc, slots;

    if (period === 'weekly') {
      // Monday of current week → Sunday
      dateTrunc = 'day';
      const day = now.getDay(); // 0=Sun
      const mondayOffset = day === 0 ? -6 : 1 - day;
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);
      until = new Date(since); until.setDate(since.getDate() + 7);
      slots = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(since); d.setDate(since.getDate() + i);
        slots.push(d);
      }
    } else if (period === 'yearly') {
      // Jan 1 of current year → Dec 31
      dateTrunc = 'month';
      since = new Date(now.getFullYear(), 0, 1);
      until = new Date(now.getFullYear() + 1, 0, 1);
      slots = Array.from({ length: 12 }, (_, i) => new Date(now.getFullYear(), i, 1));
    } else {
      // monthly: 1st of current month → today
      dateTrunc = 'day';
      since = new Date(now.getFullYear(), now.getMonth(), 1);
      until = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      slots = [];
      for (let d = new Date(since); d < until; d.setDate(d.getDate() + 1)) {
        slots.push(new Date(d));
      }
    }

    const salesData = await Order.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', dateTrunc, Sequelize.col('createdAt')), 'period'],
        [Sequelize.fn('sum', Sequelize.col('totalAmount')), 'totalSales'],
        [Sequelize.fn('count', Sequelize.col('id')), 'orderCount']
      ],
      where: {
        status: { [Op.not]: 'cancelled' },
        createdAt: { [Op.gte]: since, [Op.lt]: until }
      },
      group: ['period'],
      order: [['period', 'ASC']],
      raw: true
    });

    // Build lookup keyed by YYYY-MM-DD (day) or YYYY-MM (month)
    const keyLen = dateTrunc === 'month' ? 7 : 10;
    const dataMap = {};
    salesData.forEach(row => {
      const key = new Date(row.period).toISOString().slice(0, keyLen);
      dataMap[key] = row;
    });

    // Merge with all slots, zero-filling missing ones
    const filled = slots.map(d => {
      const key = d.toISOString().slice(0, keyLen);
      return dataMap[key] || { period: d.toISOString(), totalSales: 0, orderCount: 0 };
    });

    res.json({ success: true, data: filled });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching sales analytics' });
  }
};

// @desc    Get product analytics
// @route   GET /api/analytics/products
// @access  Private/Admin
const getProductAnalytics = async (req, res) => {
  try {
    const { limit = 10, period = 'month' } = req.query;
    const { currentStart } = getDateRange(period);

    // Items are stored as JSONB — use jsonb_array_elements to unnest and aggregate
    const productData = await sequelize.query(
      `SELECT
         item->>'name'                              AS "productName",
         SUM((item->>'quantity')::int)              AS "totalQuantity",
         SUM((item->>'quantity')::int * (item->>'price')::numeric) AS "totalRevenue"
       FROM "Orders",
            jsonb_array_elements(items) AS item
       WHERE status != 'cancelled'
         AND "createdAt" >= :since
       GROUP BY item->>'name'
       ORDER BY "totalQuantity" DESC
       LIMIT :limit`,
      { replacements: { since: currentStart, limit: parseInt(limit) }, type: sequelize.QueryTypes.SELECT }
    );

    res.json({ success: true, data: productData });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching product analytics' });
  }
};

const getProductTrends = async (req, res) => {
  try {
    const { period = 'month', limit = 5 } = req.query;
    const { currentStart, currentEnd, previousStart, previousEnd } = getDateRange(period);

    const currentTotals = await fetchProductTotals(currentStart, currentEnd);
    const previousTotals = await fetchProductTotals(previousStart, previousEnd);

    const productNames = new Set([
      ...Object.keys(currentTotals),
      ...Object.keys(previousTotals)
    ]);

    const products = Array.from(productNames).map((name) => {
      const currentQty = currentTotals[name]?.totalQuantity || 0;
      const prevQty = previousTotals[name]?.totalQuantity || 0;
      const diff = currentQty - prevQty;
      const percent = prevQty === 0 ? (currentQty > 0 ? 100 : 0) : ((diff / prevQty) * 100);

      return {
        productName: name,
        totalQuantity: currentQty,
        previousQuantity: prevQty,
        change: diff,
        percentChange: Number(percent.toFixed(1)),
      };
    });

    const movers = [...products]
      .sort((a, b) => b.change - a.change)
      .slice(0, limit)
      .filter(item => item.totalQuantity > 0);

    const decliners = [...products]
      .sort((a, b) => a.change - b.change)
      .slice(0, limit)
      .filter(item => item.previousQuantity > 0);

    res.json({
      success: true,
      data: {
        movers,
        decliners,
      }
    });
  } catch (error) {
    console.error('Product trend analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching product trends' });
  }
};

function getDateRange(period) {
  const now = new Date();
  const currentEnd = new Date();
  let rangeDays;

  switch (period) {
    case 'week':
      rangeDays = 7;
      break;
    case 'year':
      rangeDays = 365;
      break;
    case 'month':
    default:
      rangeDays = 30;
  }

  const currentStart = new Date(now - rangeDays * 24 * 60 * 60 * 1000);
  const previousStart = new Date(currentStart - rangeDays * 24 * 60 * 60 * 1000);
  const previousEnd = new Date(currentStart);

  return { currentStart, currentEnd, previousStart, previousEnd };
}

async function fetchProductTotals(startDate, endDate) {
  const rows = await sequelize.query(
    `SELECT
        item->>'name' AS "productName",
        SUM((item->>'quantity')::int) AS "totalQuantity"
      FROM "Orders",
           jsonb_array_elements(items) AS item
      WHERE status != 'cancelled'
        AND "createdAt" >= :start
        AND "createdAt" < :end
      GROUP BY item->>'name'`,
    {
      replacements: { start: startDate, end: endDate },
      type: sequelize.QueryTypes.SELECT
    }
  );

  return rows.reduce((acc, row) => {
    acc[row.productName] = row;
    return acc;
  }, {});
}

// @desc    Get dashboard statistics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Get total orders
    const totalOrders = await Order.count();
    
    // Get total revenue
    const revenueResult = await Order.findOne({
      attributes: [[Sequelize.fn('sum', Sequelize.col('totalAmount')), 'totalRevenue']],
      where: { status: { [Op.not]: 'cancelled' } },
      raw: true
    });
    
    // Get total customers
    const totalCustomers = await User.count({ where: { role: 'customer' } });
    
    // Get total products
    const totalProducts = await Product.count({ where: { isAvailable: true } });
    
    // Get pending orders
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    
    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.count({
      where: {
        createdAt: { [Op.gte]: today }
      }
    });
    
    // Get this month's revenue
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthRevenue = await Order.findOne({
      attributes: [[Sequelize.fn('sum', Sequelize.col('totalAmount')), 'monthRevenue']],
      where: {
        status: { [Op.not]: 'cancelled' },
        createdAt: { [Op.gte]: firstDayOfMonth }
      },
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: parseFloat(revenueResult?.totalRevenue || 0),
        totalCustomers,
        totalProducts,
        pendingOrders,
        todayOrders,
        monthRevenue: parseFloat(monthRevenue?.monthRevenue || 0)
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard statistics' });
  }
};

module.exports = {
  getSalesAnalytics,
  getProductAnalytics,
  getProductTrends,
  getDashboardStats
};
