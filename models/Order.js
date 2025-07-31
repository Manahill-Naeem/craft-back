// backend/models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product', // Reference to the Product model
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String }, // Optional: store image URL for the item at time of order
  },
  {
    _id: false, // Do not create an _id for subdocuments unless explicitly needed
  }
);

const orderSchema = mongoose.Schema(
  {
    items: [orderItemSchema],
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash on Delivery', 'Online Payment'], // You can expand this
      default: 'Cash on Delivery',
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    // Optional: reference to user if you implement user authentication
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: false,
    // },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
