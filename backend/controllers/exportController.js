// backend/controllers/exportController.js
const ExportNote = require('../models/ExportNote');
const Product = require('../models/Product');

// @desc    Tạo phiếu xuất kho THỦ CÔNG (Manual)
// @route   POST /api/exports
// @access  Private/Admin
const createExportNote = async (req, res) => {
    const { exportItems, reason } = req.body;

    if (exportItems && exportItems.length === 0) {
        res.status(400);
        throw new Error('Không có sản phẩm nào để xuất');
    }

    // 1. Kiểm tra tồn kho trước khi xuất
    for (const item of exportItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Sản phẩm ${item.name} không tồn tại`);
        }
        if (product.countInStock < item.qty) {
            res.status(400);
            throw new Error(`Sản phẩm ${item.name} không đủ hàng để xuất (Tồn: ${product.countInStock})`);
        }
    }

    // 2. Trừ tồn kho và Lưu phiếu xuất
    for (const item of exportItems) {
        const product = await Product.findById(item.product);
        product.countInStock = product.countInStock - Number(item.qty);
        await product.save();
    }

    const exportNote = new ExportNote({
        user: req.user._id,
        type: 'MANUAL',
        exportItems,
        reason
    });

    const createdExportNote = await exportNote.save();
    res.status(201).json(createdExportNote);
};

// @desc    Lấy danh sách phiếu xuất
// @route   GET /api/exports
// @access  Private/Admin
const getExportNotes = async (req, res) => {
    const notes = await ExportNote.find({})
        .populate('user', 'name')
        .sort({ createdAt: -1 });
    res.json(notes);
};

const getExportNoteById = async (req, res) => {
    const note = await ExportNote.findById(req.params.id)
        .populate('user', 'name email')
        .populate('exportItems.product', 'image');

    if (note) {
        res.json(note);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy phiếu xuất');
    }
};

module.exports = { createExportNote, getExportNotes, getExportNoteById };