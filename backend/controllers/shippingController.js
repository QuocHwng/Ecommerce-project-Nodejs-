const ShippingMethod = require('../models/ShippingMethod');

// @desc    Lấy danh sách phương thức vận chuyển
// @route   GET /api/shipping
const getShippingMethods = async (req, res) => {
  const methods = await ShippingMethod.find({});
  res.json(methods);
};

// @desc    Tạo phương thức mới
// @route   POST /api/shipping
const createShippingMethod = async (req, res) => {
  const { name, price, estimatedTime } = req.body;
  const method = new ShippingMethod({ name, price, estimatedTime });
  const createdMethod = await method.save();
  res.status(201).json(createdMethod);
};

// @desc    Xóa phương thức
// @route   DELETE /api/shipping/:id
const deleteShippingMethod = async (req, res) => {
    const method = await ShippingMethod.findById(req.params.id);
    if (method) {
        await method.deleteOne();
        res.json({ message: 'Đã xóa phương thức' });
    } else {
        res.status(404);
        throw new Error('Không tìm thấy');
    }
};

module.exports = { getShippingMethods, createShippingMethod, deleteShippingMethod };