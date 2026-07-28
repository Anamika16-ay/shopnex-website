/**
 * Seed Script - populates MongoDB with sample data
 * Run: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const slugify = require('slugify');
const connectDB = require('../config/db');

const Category = require('../models/Category');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Review = require('../models/Review');

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    Admin.deleteMany({}),
    User.deleteMany({}),
    Review.deleteMany({}),
  ]);

  console.log('Seeding categories...');
  const categoriesData = [
    { name: 'Electronics', icon: 'fa-solid fa-mobile-screen' },
    { name: 'Fashion', icon: 'fa-solid fa-shirt' },
    { name: 'Home & Kitchen', icon: 'fa-solid fa-couch' },
    { name: 'Beauty & Personal Care', icon: 'fa-solid fa-spray-can-sparkles' },
    { name: 'Sports & Outdoors', icon: 'fa-solid fa-dumbbell' },
    { name: 'Books', icon: 'fa-solid fa-book' },
  ];
  const categories = await Category.insertMany(
    categoriesData.map((c) => ({ ...c, slug: slugify(c.name, { lower: true }) }))
  );
  const catByName = Object.fromEntries(categories.map((c) => [c.name, c._id]));

  console.log('Seeding products...');
  const productsData = [
    { category: 'Electronics', name: 'UltraView 6.5" Smartphone 128GB', brand: 'UltraView', sku: 'SKU-EL-1001',
      description: 'A flagship smartphone with a stunning 6.5 inch AMOLED display, triple camera system and all-day battery life.',
      specifications: 'Display: 6.5" AMOLED\nRAM: 8GB\nStorage: 128GB\nBattery: 5000mAh\nCamera: 50MP Triple',
      price: 49999, discountPercent: 15, stockQuantity: 45, thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
      ratingAvg: 4.5, ratingCount: 238, isFeatured: true, isBestseller: true, isFlashSale: true },
    { category: 'Electronics', name: 'AirSound Pro Wireless Earbuds', brand: 'AirSound', sku: 'SKU-EL-1002',
      description: 'Premium noise-cancelling wireless earbuds with 30-hour battery life and touch controls.',
      specifications: 'Battery: 30hrs\nBluetooth: 5.3\nANC: Yes\nWater Resistance: IPX5',
      price: 3999, discountPercent: 20, stockQuantity: 120, thumbnail: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
      ratingAvg: 4.3, ratingCount: 512, isFeatured: true, isBestseller: true },
    { category: 'Electronics', name: 'CoreBook 14" Laptop i5 16GB', brand: 'CoreBook', sku: 'SKU-EL-1003',
      description: 'Slim and powerful laptop for work and play with Intel i5 processor and 16GB RAM.',
      specifications: 'CPU: Intel i5 12th Gen\nRAM: 16GB\nStorage: 512GB SSD\nDisplay: 14" FHD',
      price: 64999, discountPercent: 10, stockQuantity: 25, thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
      ratingAvg: 4.6, ratingCount: 164, isFeatured: true },
    { category: 'Fashion', name: 'Classic Fit Cotton Shirt', brand: 'Urbane', sku: 'SKU-FA-2001',
      description: 'Breathable 100% cotton shirt perfect for office and casual wear.',
      specifications: 'Material: 100% Cotton\nFit: Regular\nCare: Machine Wash',
      price: 1299, discountPercent: 30, stockQuantity: 200, thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
      ratingAvg: 4.1, ratingCount: 89, isBestseller: true, isFlashSale: true },
    { category: 'Fashion', name: 'Women Floral Summer Dress', brand: 'Blossom', sku: 'SKU-FA-2002',
      description: 'Lightweight floral dress ideal for summer outings and casual days.',
      specifications: 'Material: Rayon\nFit: A-Line\nCare: Hand Wash',
      price: 1899, discountPercent: 25, stockQuantity: 80, thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',      ratingAvg: 4.4, ratingCount: 142, isFeatured: true },
    { category: 'Home & Kitchen', name: 'NonStick Cookware Set (5 Pcs)', brand: 'HomeChef', sku: 'SKU-HK-3001',
      description: 'Durable non-stick cookware set including pans and pots for everyday cooking.',
      specifications: 'Pieces: 5\nMaterial: Aluminum\nCoating: Non-stick',
      price: 2499, discountPercent: 18, stockQuantity: 60, thumbnail: 'https://images.unsplash.com/photo-1584990347193-6bebebfeaeee?w=600&q=80',
      ratingAvg: 4.2, ratingCount: 97, isBestseller: true },
    { category: 'Home & Kitchen', name: 'LED Smart Desk Lamp', brand: 'Brightly', sku: 'SKU-HK-3002',
      description: 'Adjustable LED desk lamp with touch control and 3 lighting modes.',
      specifications: 'Modes: 3\nPower: USB-C\nDimmable: Yes',
      price: 1199, discountPercent: 12, stockQuantity: 150, thumbnail: 'https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=600&q=80',
      ratingAvg: 4.0, ratingCount: 54 },
    { category: 'Beauty & Personal Care', name: 'Vitamin C Glow Serum 30ml', brand: 'GlowLab', sku: 'SKU-BP-4001',
      description: 'Brightening face serum with Vitamin C and Hyaluronic Acid for radiant skin.',
      specifications: 'Volume: 30ml\nSkin Type: All\nKey Ingredient: Vitamin C',
      price: 899, discountPercent: 10, stockQuantity: 300, thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
      ratingAvg: 4.7, ratingCount: 421, isFeatured: true, isBestseller: true, isFlashSale: true },
    { category: 'Sports & Outdoors', name: 'Pro Yoga Mat with Carry Strap', brand: 'FitZone', sku: 'SKU-SP-5001',
      description: 'Extra thick anti-slip yoga mat suitable for all types of exercise.',
      specifications: 'Thickness: 8mm\nMaterial: TPE\nSize: 183x61cm',
      price: 999, discountPercent: 15, stockQuantity: 90, thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80',
      ratingAvg: 4.3, ratingCount: 76 },
    { category: 'Books', name: 'The Art of Clean Code (Paperback)', brand: 'TechPress', sku: 'SKU-BK-6001',
      description: 'A practical guide to writing maintainable and readable code for developers.',
      specifications: 'Pages: 320\nLanguage: English\nFormat: Paperback',
      price: 599, discountPercent: 5, stockQuantity: 500, thumbnail: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80',
      ratingAvg: 4.8, ratingCount: 312, isFeatured: true },
  ];

  const products = await Product.insertMany(
    productsData.map((p) => ({
      ...p,
      category: catByName[p.category],
      slug: slugify(p.name, { lower: true }) + '-' + Math.random().toString(16).slice(2, 7),
      images: [p.thumbnail],
    }))
  );

  console.log('Seeding admin account...');
  const adminPasswordHash = await Admin.hashPassword(process.env.SEED_ADMIN_PASSWORD || 'Admin@123');
  await Admin.create({
    name: 'Super Admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@shopnex.com',
    passwordHash: adminPasswordHash,
    role: 'super_admin',
  });

  console.log('Seeding demo user...');
  const userPasswordHash = await User.hashPassword(process.env.SEED_USER_PASSWORD || 'User@123');
  const demoUser = await User.create({
    fullName: 'Demo User',
    email: process.env.SEED_USER_EMAIL || 'demo@example.com',
    phone: '9876543210',
    passwordHash: userPasswordHash,
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    country: 'India',
  });

  console.log('Seeding sample reviews...');
  await Review.create([
    { product: products[0]._id, user: demoUser._id, rating: 5, title: 'Excellent phone!', comment: 'Camera and battery life are outstanding for the price.' },
    { product: products[7]._id, user: demoUser._id, rating: 5, title: 'Skin feels amazing', comment: 'Noticed visible glow within two weeks of use.' },
  ]);

  console.log('✅ Seed complete!');
  console.log(`Admin login: ${process.env.SEED_ADMIN_EMAIL || 'admin@shopnex.com'} / ${process.env.SEED_ADMIN_PASSWORD || 'Admin@123'}`);
  console.log(`Demo user login: ${process.env.SEED_USER_EMAIL || 'demo@example.com'} / ${process.env.SEED_USER_PASSWORD || 'User@123'}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
