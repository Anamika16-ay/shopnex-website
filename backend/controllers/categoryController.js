const slugify = require('slugify');
const Category = require('../models/Category');
const Product = require('../models/Product');

// @route GET /api/categories
async function listCategories(req, res) {
  const categories = await Category.find({ status: 'active' }).sort({ name: 1 });

  const withCounts = await Promise.all(
    categories.map(async (cat) => {
      const productCount = await Product.countDocuments({ category: cat._id, status: 'active' });
      return { ...cat.toObject(), productCount };
    })
  );

  res.json({ categories: withCounts });
}

// @route POST /api/admin/categories
async function createCategory(req, res) {
  const { name, description, icon } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required.' });

  const category = await Category.create({
    name, description, icon,
    slug: slugify(name, { lower: true }),
  });
  res.status(201).json({ category });
}

module.exports = { listCategories, createCategory };
