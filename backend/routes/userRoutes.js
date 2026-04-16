// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  authUser, 
  registerUser, 
  getUserProfile, 
  updateUserProfile,
  getUsers,          // Lấy danh sách user (Admin)
  deleteUser,        // Xóa user (Admin)
  getUserById,       // Lấy chi tiết 1 user (Admin sửa)
  updateUser,        // Cập nhật/Phân quyền (Admin)
  getUserStats       // Thống kê (Admin)
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

// 1. Route Gốc: /api/users
// - POST: Đăng ký tài khoản mới (Ai cũng dùng được)
// - GET: Lấy danh sách tất cả người dùng (Chỉ Admin)
router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers); 

// 2. Route Đăng nhập
router.post('/login', authUser);

// 3. Route Hồ sơ cá nhân (Profile)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// 4. Route Thống kê (Phải đặt TRƯỚC route /:id để tránh bị hiểu nhầm là id)
router.route('/stats').get(protect, admin, getUserStats);

// 5. Route thao tác trên từng User cụ thể (Chỉ Admin)
// /api/users/:id
router.route('/:id')
    .delete(protect, admin, deleteUser) // Xóa
    .get(protect, admin, getUserById)   // Xem chi tiết để sửa
    .put(protect, admin, updateUser);   // Cập nhật (Phân quyền Admin)

module.exports = router;