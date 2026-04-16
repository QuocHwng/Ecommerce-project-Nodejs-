// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  createPaymentUrl, // <--- Import
  getDashboardStats,
  getOrderStats,
  getOrderStatusStats,
  cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);

// Route Thanh toán VNPAY
router.route('/create_payment_url').post(createPaymentUrl);

// Thống kê
router.route('/stats').get(protect, admin, getDashboardStats);
router.route('/chart-stats').get(protect, admin, getOrderStats);
router.route('/status-stats').get(protect, admin, getOrderStatusStats);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;