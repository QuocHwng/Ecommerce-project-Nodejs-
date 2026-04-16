// backend/controllers/dashboardController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Lấy số liệu thống kê tổng quan
// @route   GET /api/dashboard/summary
// @access  Private/Admin
const getDashboardSummary = async (req, res) => {
    try {
        // 1. Đếm tổng số lượng
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();

        // 2. Tính tổng doanh thu (Chỉ tính các đơn ĐÃ THANH TOÁN)
        const totalRevenueData = await Order.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].total : 0;

        // 3. Lấy dữ liệu biểu đồ (Doanh thu theo ngày trong 7 ngày gần nhất)
        // Lưu ý: Logic này đơn giản hóa, thực tế cần xử lý múi giờ kỹ hơn
        const dailyOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7)) 
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    orders: { $sum: 1 },
                    sales: { $sum: '$totalPrice' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue,
            dailyOrders
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardSummary };