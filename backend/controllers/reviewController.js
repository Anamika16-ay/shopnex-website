const Review = require('../models/Review');
const Product = require('../models/Product');

// @route POST /api/reviews
async function submitReview(req, res) {
  const { productId, rating, title, comment } = req.body;

  if (!productId || !rating || rating < 1 || rating > 5 || !comment) {
    return res.status(400).json({ message: 'Please provide a valid rating and comment.' });
  }

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  await Review.create({ product: productId, user: req.user._id, rating, title, comment });

  const stats = await Review.aggregate([
    { $match: { product: product._id, status: 'approved' } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    product.ratingAvg = Math.round(stats[0].avgRating * 100) / 100;
    product.ratingCount = stats[0].count;
    await product.save();
  }

  res.status(201).json({ message: 'Thank you! Your review has been submitted.' });
}

module.exports = { submitReview };
