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
    const since = getDateRange(period);

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
      { replacements: { since, limit: parseInt(limit) }, type: sequelize.QueryTypes.SELECT }
    );

    res.json({ success: true, data: productData });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching product analytics' });
  }
};

// Helper function to get date range based on period
function getDateRange(period) {
  const now = new Date();
  switch (period) {
    case 'week':
      return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case 'year':
      return new Date(now.getFullYear(), 0, 1);
    case 'month':
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
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
  getDashboardStats
};
