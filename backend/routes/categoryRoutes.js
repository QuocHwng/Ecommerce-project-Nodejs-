// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

// Import Controller
const { 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  listCategory, 
  readCategory 
} = require('../controllers/categoryController');

// Import Middleware bảo vệ
const { protect, admin } = require('../middleware/authMiddleware');

// Khai báo đường dẫn
router.route('/')
    .post(protect, admin, createCategory) 
    .get(listCategory);                   

router.route('/:id')
    .put(protect, admin, updateCategory)   
    .delete(protect, admin, deleteCategory) 
    .get(readCategory);                     

module.exports = router;