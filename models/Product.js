// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters'],
    },
    slug: { // Added slug for product details page URLs
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly (lowercase, alphanumeric, hyphens only)'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    imageUrl: { // Path to product image, relative to static files root
      type: String,
      required: false, // Can be optional if you have default images
      trim: true,
    },
    category: { // Reference to Category model
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // 'Category' refers to the name of your Category model
      required: [true, 'Product must belong to a category'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate slug from name if not provided or name is modified
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
      .replace(/\s+/g, '-')      // Replace spaces with -
      .replace(/-+/g, '-');       // Replace multiple - with single -
  }
  next();
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;
