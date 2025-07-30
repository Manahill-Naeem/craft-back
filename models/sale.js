    // backend/models/Sale.js
    const mongoose = require('mongoose');

    const saleSchema = mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
          unique: true,
        },
        startDate: {
          type: Date,
          required: true,
        },
        endDate: {
          type: Date,
          required: true,
        },
        bannerText: {
          type: String,
          required: true,
        },
        bannerImageUrl: {
          type: String,
          required: false, // Optional, if you want text-only banners
        },
        tagText: {
          type: String,
          required: true,
        },
        bannerBgColor: {
          type: String,
          default: 'bg-primary-600',
        },
        bannerTextColor: {
          type: String,
          default: 'text-white',
        },
        tagBgColor: {
          type: String,
          default: 'bg-primary-500',
        },
        tagTextColor: {
          type: String,
          default: 'text-white',
        },
        isActive: {
          type: Boolean,
          required: true,
          default: true,
        },
        discountPercentage: { // Discount percentage for the sale
          type: Number,
          required: false,
          min: 0,
          max: 100,
        },
      },
      {
        timestamps: true,
      }
    );

    const Sale = mongoose.model('Sale', saleSchema);

    module.exports = Sale;
    git init