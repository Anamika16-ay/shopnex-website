const slugify = require('slugify');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Wishlist = require('../models/Wishlist');
const { uploadFile, deleteFile } = require('../config/s3');

// @route GET /api/products
async function listProducts(req, res) {
  const {
    search = '', category = '', brand = '', minPrice = 0, maxPrice = 0,
    sort = 'newest', page = 1, limit = 12,
  } = req.query;

  const filter = { status: 'active' };

  if (search) filter.$text = { $search: search };
  if (brand) filter.brand = brand;
  if (Number(minPrice) > 0 || Number(maxPrice) > 0) {
    filter.price = {};
    if (Number(minPrice) > 0) filter.price.$gte = Number(minPrice);
    if (Number(maxPrice) > 0) filter.price.$lte = Number(maxPrice);
  }
  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }

  const sortMap = {
    price_low: { price: 1 },
    price_high: { price: -1 },
    rating: { ratingAvg: -1 },
    popular: { ratingCount: -1 },
    newest: { createdAt: -1 },
  };

  const pageNum = Math.max(1, parseInt(page, 10));
  const perPage = Math.min(50, Math.max(1, parseInt(limit, 10)));

  const [products, total, brands] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortMap[sort] || sortMap.newest)
      .skip((pageNum - 1) * perPage)
      .limit(perPage),
    Product.countDocuments(filter),
    Product.distinct('brand', { status: 'active', brand: { $ne: '' } }),
  ]);

  res.json({
    products,
    totalItems: total,
    totalPages: Math.max(1, Math.ceil(total / perPage)),
    currentPage: pageNum,
    brands,
  });
}

// @route GET /api/products/:slug
async function getProductBySlug(req, res) {
  const product = await Product.findOne({ slug: req.params.slug, status: 'active' }).populate('category', 'name slug');
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  const related = await Product.find({
    category: product.category._id,
    _id: { $ne: product._id },
    status: 'active',
  }).limit(4);

  let isWishlisted = false;
  if (req.user) {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    isWishlisted = wishlist ? wishlist.products.some((p) => p.toString() === product._id.toString()) : false;
  }

  res.json({ product, related, isWishlisted });
}

// @route GET /api/products/home/sections  (featured, bestsellers, latest, flashSale)
async function getHomeSections(req, res) {
  const [featured, bestsellers, latest, flashSale] = await Promise.all([
    Product.find({ status: 'active', isFeatured: true }).populate('category', 'name slug').sort({ createdAt: -1 }).limit(8),
    Product.find({ status: 'active', isBestseller: true }).populate('category', 'name slug').sort({ ratingAvg: -1 }).limit(8),
    Product.find({ status: 'active' }).populate('category', 'name slug').sort({ createdAt: -1 }).limit(8),
    Product.find({ status: 'active', isFlashSale: true }).populate('category', 'name slug').limit(4),
  ]);
  res.json({ featured, bestsellers, latest, flashSale });
}

// ---------- Admin product management ----------

// @route POST /api/admin/products
async function createProduct(req, res) {
  const { categoryId, name, brand, sku, description, specifications, price, discountPercent, stockQuantity, status, isFeatured, isBestseller, isFlashSale } = req.body;

  if (!name || !categoryId || !sku || !price) {
    return res.status(400).json({ message: 'Please fill all required fields.' });
  }

  let thumbnail = '';
  if (req.file) {
    const fileName = `prod-${Date.now()}-${Math.random().toString(16).slice(2, 8)}.${req.file.originalname.split('.').pop()}`;
    thumbnail = await uploadFile(req.file.buffer, fileName, req.file.mimetype);
  }

  const slug = slugify(name, { lower: true }) + '-' + Math.random().toString(16).slice(2, 7);

  const product = await Product.create({
    category: categoryId, name, slug, brand, sku, description, specifications,
    price: Number(price), discountPercent: Number(discountPercent) || 0, stockQuantity: Number(stockQuantity) || 0,
    thumbnail, images: thumbnail ? [thumbnail] : [],
    status: status || 'active',
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isBestseller: isBestseller === 'true' || isBestseller === true,
    isFlashSale: isFlashSale === 'true' || isFlashSale === true,
  });

  res.status(201).json({ product, message: 'Product added successfully.' });
}

// @route PUT /api/admin/products/:id
async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  const { categoryId, name, brand, sku, description, specifications, price, discountPercent, stockQuantity, status, isFeatured, isBestseller, isFlashSale } = req.body;

  if (req.file) {
    const fileName = `prod-${Date.now()}-${Math.random().toString(16).slice(2, 8)}.${req.file.originalname.split('.').pop()}`;
    const newThumb = await uploadFile(req.file.buffer, fileName, req.file.mimetype);
    if (product.thumbnail) await deleteFile(product.thumbnail).catch(() => {});
    product.thumbnail = newThumb;
    product.images = [newThumb];
  }

  product.category = categoryId || product.category;
  product.name = name || product.name;
  product.brand = brand ?? product.brand;
  product.sku = sku || product.sku;
  product.description = description ?? product.description;
  product.specifications = specifications ?? product.specifications;
  product.price = price ? Number(price) : product.price;
  product.discountPercent = discountPercent !== undefined ? Number(discountPercent) : product.discountPercent;
  product.stockQuantity = stockQuantity !== undefined ? Number(stockQuantity) : product.stockQuantity;
  product.status = status || product.status;
  product.isFeatured = isFeatured === 'true' || isFeatured === true;
  product.isBestseller = isBestseller === 'true' || isBestseller === true;
  product.isFlashSale = isFlashSale === 'true' || isFlashSale === true;

  await product.save();
  res.json({ product, message: 'Product updated successfully.' });
}

// @route DELETE /api/admin/products/:id
async function deleteProduct(req, res) {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  if (product.thumbnail) await deleteFile(product.thumbnail).catch(() => {});
  await product.deleteOne();

  res.json({ message: 'Product deleted successfully.' });
}

// @route GET /api/admin/products (list all, incl. inactive/draft, with search)
async function adminListProducts(req, res) {
  const { search = '' } = req.query;
  const filter = search
    ? { $or: [{ name: new RegExp(search, 'i') }, { sku: new RegExp(search, 'i') }] }
    : {};
  const products = await Product.find(filter).populate('category', 'name').sort({ createdAt: -1 });
  res.json({ products });
}

module.exports = {
  listProducts, getProductBySlug, getHomeSections,
  createProduct, updateProduct, deleteProduct, adminListProducts,
};
