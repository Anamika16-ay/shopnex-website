const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @route GET /api/admin/dashboard
async function getDashboardStats(req, res) {
  const [totalSalesAgg, totalOrders, totalCustomers, totalProducts, pendingOrders, lowStock, recentOrders] = await Promise.all([
    Order.aggregate([{ $match: { orderStatus: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.countDocuments({}),
    User.countDocuments({}),
    Product.countDocuments({}),
    Order.countDocuments({ orderStatus: 'pending' }),
    Product.countDocuments({ stockQuantity: { $lte: 10 } }),
    Order.find({}).populate('user', 'fullName').sort({ createdAt: -1 }).limit(8),
  ]);

  // Revenue for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const revenueByDay = await Order.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo }, orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$totalAmount' } } },
  ]);

  const chartLabels = [];
  const chartValues = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    chartLabels.push(d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }));
    const match = revenueByDay.find((r) => r._id === key);
    chartValues.push(match ? match.total : 0);
  }

  res.json({
    totalSales: totalSalesAgg[0]?.total || 0,
    totalOrders, totalCustomers, totalProducts, pendingOrders, lowStock,
    recentOrders, chartLabels, chartValues,
  });
}

// @route GET /api/admin/customers
async function listCustomers(req, res) {
  const { search = '' } = req.query;
  const filter = search
    ? { $or: [{ fullName: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
    : {};

  const users = await User.find(filter).sort({ createdAt: -1 });

  const withStats = await Promise.all(
    users.map(async (u) => {
      const orders = await Order.find({ user: u._id });
      const orderCount = orders.length;
      const totalSpent = orders
        .filter((o) => o.orderStatus !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return { ...u.toObject(), orderCount, totalSpent };
    })
  );

  res.json({ customers: withStats });
}

// @route PUT /api/admin/customers/:id/toggle-status
async function toggleCustomerStatus(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'Customer not found.' });

  user.status = user.status === 'active' ? 'blocked' : 'active';
  await user.save();

  res.json({ message: 'Customer status updated.', status: user.status });
}

// @route GET /api/admin/reports?range=30
async function getReports(req, res) {
  const days = [7, 30, 90, 365].includes(Number(req.query.range)) ? Number(req.query.range) : 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [revenueAgg, totalOrders, newCustomers, topProducts, statusBreakdown] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: since }, orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.countDocuments({ createdAt: { $gte: since } }),
    User.countDocuments({ createdAt: { $gte: since } }),
    Order.aggregate([
      { $match: { createdAt: { $gte: since }, orderStatus: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      { $group: {
        _id: '$items.product',
        name: { $first: '$items.productName' },
        thumbnail: { $first: '$items.productImage' },
        unitsSold: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.lineTotal' },
      } },
      { $sort: { unitsSold: -1 } },
      { $limit: 5 },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]),
  ]);

  const totalRevenue = revenueAgg[0]?.total || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  res.json({
    days, totalRevenue, totalOrders, avgOrderValue, newCustomers,
    topProducts, statusBreakdown,
  });
}

module.exports = { getDashboardStats, listCustomers, toggleCustomerStatus, getReports };
