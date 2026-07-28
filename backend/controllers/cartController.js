const Cart = require('../models/Cart');

function computeTotals(items) {
  let subtotal = 0;
  for (const item of items) {
    const price = item.product.price - (item.product.price * item.product.discountPercent) / 100;
    subtotal += price * item.quantity;
  }
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 79;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + shipping + tax;
  return { subtotal: round2(subtotal), shipping, tax, total: round2(total) };
}
function round2(n) { return Math.round(n * 100) / 100; }

// @route GET /api/cart
async function getCart(req, res) {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const validItems = cart.items.filter((i) => i.product); // filter out deleted products
  const totals = computeTotals(validItems);

  res.json({ items: validItems, totals });
}

// @route POST /api/cart
async function addToCart(req, res) {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID is required.' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const existing = cart.items.find((i) => i.product.toString() === productId);
  if (existing) {
    existing.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity: Number(quantity) });
  }
  await cart.save();

  const populated = await cart.populate('items.product');
  res.json({ status: 'success', cartCount: populated.items.reduce((sum, i) => sum + i.quantity, 0) });
}

// @route PUT /api/cart/:itemId
async function updateCartItem(req, res) {
  const { quantity, action } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found.' });

  if (action === 'remove') {
    cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  } else {
    const item = cart.items.find((i) => i._id.toString() === req.params.itemId);
    if (item) item.quantity = Math.max(1, Number(quantity));
  }
  await cart.save();

  const populated = await cart.populate('items.product');
  const validItems = populated.items.filter((i) => i.product);
  const totals = computeTotals(validItems);

  res.json({ status: 'success', cartCount: validItems.reduce((sum, i) => sum + i.quantity, 0), totals });
}

// @route DELETE /api/cart  (clear entire cart, used after checkout)
async function clearCart(userId) {
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });
}

module.exports = { getCart, addToCart, updateCartItem, clearCart, computeTotals };
