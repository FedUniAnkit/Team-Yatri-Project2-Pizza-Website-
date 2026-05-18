const { Order, Product, User } = require('../models');
const { sequelize } = require('../config/database');
const { Op, Sequelize } = require('sequelize');

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let groupBy, dateFormat, dateTrunc;
    
    switch (period) {
      case 'weekly':
        dateFormat = '%Y-%U';
        dateTrunc = 'week';
        break;
      case 'yearly':
        dateFormat = '%Y';
        dateTrunc = 'year';
        break;
      case 'monthly':
      default:
        dateFormat = '%Y-%m';
        dateTrunc = 'month';
    }

    const salesData = await Order.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', dateTrunc, Sequelize.col('createdAt')), 'period'],
        [Sequelize.fn('sum', Sequelize.col('totalAmount')), 'totalSales'],
        [Sequelize.fn('count', Sequelize.col('id')), 'orderCount']
      ],
      where: {
        status: { [Op.not]: 'cancelled' },
        createdAt: {
          [Op.gte]: new Date(new Date() - 365 * 24 * 60 * 60 * 1000) // Last 365 days
        }
      },
      group: ['period'],
      order: [['period', 'ASC']],
      raw: true
    });

    res.json({ success: true, data: salesData });
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
