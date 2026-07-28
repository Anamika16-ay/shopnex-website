const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  brand: { type: String, default: '' },
  sku: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  specifications: { type: String, default: '' }, // newline-separated, same as PHP version
  price: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 0 },
  thumbnail: { type: String, default: '' },
  images: [{ type: String }], // additional gallery image URLs
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

productSchema.virtual('discountedPrice').get(function () {
  return Math.round((this.price - (this.price * this.discountPercent) / 100) * 100) / 100;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
