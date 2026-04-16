// backend/models/Category.js
const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Tên danh mục không được trùng
      trim: true,
    },
    // Sau này muốn mở rộng thêm ảnh danh mục hay mô tả thì thêm vào đây
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;