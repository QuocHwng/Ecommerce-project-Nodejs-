// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  deleteProduct, 
  createProduct,
  updateProduct,
  createProductReview // <-- Import thêm cái này
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

  
router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct); // <-- Thêm dòng PUT để cập nhật

router.route('/:id/reviews').post(protect, createProductReview);
module.exports = router;