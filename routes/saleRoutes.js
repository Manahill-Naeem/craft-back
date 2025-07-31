    // backend/routes/saleRoutes.js
    const express = require('express');
    const router = express.Router();
    const Sale = require('../models/Sale'); // Sale model import karo

    // GET active sale
    router.get('/active', async (req, res) => {
      try {
        const now = new Date();
        const activeSale = await Sale.findOne({
          isActive: true,
          startDate: { $lte: now }, // Sale has started or is ongoing
          endDate: { $gte: now },   // Sale has not ended yet or is ongoing
        });

        if (!activeSale) {
          return res.status(204).send(); // 204 No Content if no active sale
        }

        res.status(200).json(activeSale);
      } catch (error) {
        console.error('Error fetching active sale:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    });

    // POST a new sale (for admin use)
    router.post('/', async (req, res) => {
      try {
        const newSale = new Sale(req.body);
        await newSale.save();
        res.status(201).json(newSale);
      } catch (error) {
        console.error('Error creating sale:', error);
        res.status(400).json({ message: 'Error creating sale', error: error.message });
      }
    });

    module.exports = router;
    