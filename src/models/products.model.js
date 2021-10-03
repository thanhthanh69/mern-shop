const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: Object,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("products", productSchema);
