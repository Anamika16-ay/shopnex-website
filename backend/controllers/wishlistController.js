const Wishlist = require('../models/Wishlist');

// @route GET /api/wishlist
async function getWishlist(req, res) {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'products',
    populate: { path: 'category', select: 'name slug' },
  });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

  res.json({ products: wishlist.products });
}

// @route POST /api/wishlist/toggle
async function toggleWishlist(req, res) {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ message: 'Product ID is required.' });

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });

  const exists = wishlist.products.some((p) => p.toString() === productId);
  if (exists) {
    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
  } else {
    wishlist.products.push(productId);
  }
  await wishlist.save();

  res.json({
    status: 'success',
    action: exists ? 'removed' : 'added',
    wishlistCount: wishlist.products.length,
  });
}

module.exports = { getWishlist, toggleWishlist };
