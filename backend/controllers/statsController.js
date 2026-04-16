// backend/controllers/statsController.js
const Product = require('../models/Product');
const Order = require('../models/Order');
const ImportNote = require('../models/ImportNote');
const ExportNote = require('../models/ExportNote');

// @desc    Lấy dữ liệu thống kê biểu đồ
// @route   GET /api/stats
// @access  Private/Admin
const getStatsData = async (req, res) => {
    try {
        // 1. Thống kê số lượng sản phẩm theo Danh mục
        const categoryStats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        // 2. Thống kê trạng thái đơn hàng (Để xem tỉ lệ thành công/hủy)
        const orderStatusStats = await Order.aggregate([
            {
                $group: {
                    _id: {
                        $cond: { if: '$isPaid', then: 'Đã thanh toán', else: 'Chưa thanh toán' }
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. So sánh số lượng phiếu Nhập và Xuất
        const importCount = await ImportNote.countDocuments();
        const exportCount = await ExportNote.countDocuments();

        res.json({
            categoryStats,
            orderStatusStats,
            ioStats: [
                { name: 'Phiếu Nhập', value: importCount },
                { name: 'Phiếu Xuất', value: exportCount }
            ]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStatsData };