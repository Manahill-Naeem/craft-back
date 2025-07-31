// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Adjust path as needed
const Category = require('../models/Category'); // Needed for category slug lookup

// GET all products with filtering, searching, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const { category, search, sortBy, page = 1, limit = 12, minPrice, maxPrice } = req.query;

    let query = { isActive: true }; // Only fetch active products

    // Filter by category slug
    if (category) {
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        // If category slug doesn't exist, return empty products array
        return res.status(200).json({
          products: [],
          currentPage: parseInt(page),
          totalPages: 0,
          totalProducts: 0
        });
      }
    }

    // Search by name or description
    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      query.$or = [
        { name: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    let sortOptions = {};
    if (sortBy === 'price-asc') {
      sortOptions.price = 1;
    } else if (sortBy === 'price-desc') {
      sortOptions.price = -1;
    } else if (sortBy === 'name-asc') {
      sortOptions.name = 1;
    } else if (sortBy === 'name-desc') {
      sortOptions.name = -1;
    } else {
      sortOptions.createdAt = -1; // Default sort: newest first
    }

    // Count total documents matching query for pagination info
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limitNum);

    // Fetch products
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .populate('category', 'name slug') // Populate category to get name and slug
      .exec();

    res.status(200).json({
      products,
      currentPage: pageNum,
      totalPages,
      totalProducts
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET a single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug').exec();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(`Error fetching product with slug ${req.params.slug}:`, error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST a new product (for initial data population)
router.post('/', async (req, res) => {
  try {
    const { categoryName, ...productData } = req.body;
    let categoryId = null;

    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (category) {
        categoryId = category._id;
      } else {
        return res.status(400).json({ message: 'Category not found for the provided name.' });
      }
    }

    const newProduct = new Product({ ...productData, category: categoryId });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

module.exports = router;
