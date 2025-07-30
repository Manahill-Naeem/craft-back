// backend/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot be more than 50 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Category slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly (lowercase, alphanumeric, hyphens only)'],
    },
    description: {
      type: String,
      required: false,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    imageUrl: { // Path to category image, relative to static files root
      type: String,
      required: false,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Pre-save hook to generate slug from name if not provided or name is modified
categorySchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
      .replace(/\s+/g, '-')      // Replace spaces with -
      .replace(/-+/g, '-');       // Replace multiple - with single -
  }
  next();
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

module.exports = Category;
