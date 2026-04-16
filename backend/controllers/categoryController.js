// backend/controllers/categoryController.js

const Category = require('../models/Category'); 

// 1. Tạo danh mục
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Kiểm tra trùng tên
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: "Danh mục đã tồn tại" });
    }

    const category = await new Category({ name }).save();
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// 2. Cập nhật danh mục
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!category) return res.status(404).json({ error: "Không tìm thấy danh mục" });

    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// 3. Xóa danh mục
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
        await Category.deleteOne({ _id: category._id });
        res.json({ message: "Đã xóa thành công" });
    } else {
        res.status(404).json({ error: "Không tìm thấy danh mục" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// 4. Lấy danh sách (Cho cả khách hàng và admin)
const listCategory = async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

// 5. Lấy chi tiết 1 danh mục
const readCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if(category) {
        res.json(category);
    } else {
        res.status(404).json({ error: "Không tìm thấy" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
};

module.exports = { 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  listCategory, 
  readCategory 
};