const mongoose = require("mongoose");

const useSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "user", trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user"],
    default: "user",
  },
  cart: {
    type: Array,
    default: [],
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

module.exports = mongoose.model("users", useSchema);
