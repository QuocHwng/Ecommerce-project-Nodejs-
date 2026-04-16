const express = require('express');
const router = express.Router();
const { getShippingMethods, createShippingMethod, deleteShippingMethod } = require('../controllers/shippingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getShippingMethods) // User cũng cần xem để chọn
    .post(protect, admin, createShippingMethod);

router.route('/:id').delete(protect, admin, deleteShippingMethod);

module.exports = router;