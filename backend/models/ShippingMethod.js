// backend/models/ShippingMethod.js
const mongoose = require('mongoose');

const shippingMethodSchema = mongoose.Schema({
  name: { type: String, required: true }, // VD: Giao hàng nhanh, Tiết kiệm
  price: { type: Number, required: true }, // Giá tiền
  estimatedTime: { type: String, required: true }, // VD: 2-3 ngày
  isDefault: { type: Boolean, default: false }, // Chọn làm mặc định
}, { timestamps: true });

const ShippingMethod = mongoose.model('ShippingMethod', shippingMethodSchema);
module.exports = ShippingMethod;