const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { generateOrderNumber } = require('../utils/orderNumber');
const { computeTotals, clearCart } = require('./cartController');

// @route POST /api/orders  (place order - from cart or buy-now)
async function placeOrder(req, res) {
  const {
    buyNowProductId, shippingName, shippingPhone, shippingAddress,
    shippingCity, shippingState, shippingPostalCode, paymentMethod,
  } = req.body;

  if (!shippingName || !shippingPhone || !shippingAddress || !shippingCity || !shippingState || !shippingPostalCode) {
    return res.status(400).json({ message: 'Please fill in all shipping address fields.' });
  }

  let items = [];

  if (buyNowProductId) {
    const product = await Product.findById(buyNowProductId);
    if (!product || product.status !== 'active') {
      return res.status(400).json({ message: 'Product not available.' });
    }
    items = [{ product, quantity: 1 }];
  } else {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }
    items = cart.items.filter((i) => i.product);
  }

  // Validate stock
  for (const item of items) {
    if (item.product.stockQuantity < item.quantity) {
      return res.status(400).json({ message: `${item.product.name} is out of stock.` });
    }
  }

  const totals = computeTotals(items);

  const orderItems = items.map((item) => {
    const price = item.product.price - (item.product.price * item.product.discountPercent) / 100;
    return {
      product: item.product._id,
      productName: item.product.name,
      productImage: item.product.thumbnail,
      unitPrice: Math.round(price * 100) / 100,
      quantity: item.quantity,
      lineTotal: Math.round(price * item.quantity * 100) / 100,
    };
  });

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    items: orderItems,
    subtotal: totals.subtotal,
    shippingFee: totals.shipping,
    taxAmount: totals.tax,
    totalAmount: totals.total,
    shippingName, shippingPhone, shippingAddress, shippingCity, shippingState, shippingPostalCode,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
    orderStatus: 'pending',
  });

  // Decrement stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stockQuantity: -item.quantity } });
  }

  // Clear cart only for full-cart checkout
  if (!buyNowProductId) {
    await clearCart(req.user._id);
  }

  res.status(201).json({ order, message: 'Order placed successfully.' });
}

// @route GET /api/orders  (customer order history)
async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
}

// @route GET /api/orders/:orderNumber
async function getOrderByNumber(req, res) {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber, user: req.user._id });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json({ order });
}

// ---------- Admin order management ----------

// @route GET /api/admin/orders
async function adminListOrders(req, res) {
  const { status = '' } = req.query;
  const filter = status ? { orderStatus: status } : {};
  const orders = await Order.find(filter).populate('user', 'fullName email').sort({ createdAt: -1 });
  res.json({ orders });
}

// @route GET /api/admin/orders/:id
async function adminGetOrder(req, res) {
  const order = await Order.findById(req.params.id).populate('user', 'fullName email phone');
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json({ order });
}

// @route PUT /api/admin/orders/:id/status
async function adminUpdateOrderStatus(req, res) {
  const { orderStatus } = req.body;
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];
  if (!validStatuses.includes(orderStatus)) {
    return res.status(400).json({ message: 'Invalid order status.' });
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  res.json({ order, message: 'Order status updated.' });
}

module.exports = {
  placeOrder, getMyOrders, getOrderByNumber,
  adminListOrders, adminGetOrder, adminUpdateOrderStatus,
};
