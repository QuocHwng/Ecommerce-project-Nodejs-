// backend/controllers/importController.js
const ImportNote = require('../models/ImportNote');
const Product = require('../models/Product');

// @desc    Tạo phiếu nhập kho mới
// @route   POST /api/imports
// @access  Private/Admin
const createImportNote = async (req, res) => {
    const { importItems, note } = req.body;

    if (importItems && importItems.length === 0) {
        res.status(400);
        throw new Error('Không có sản phẩm nào để nhập');
    } else {
        // 1. Tính tổng tiền nhập
        const totalPrice = importItems.reduce((acc, item) => acc + item.qty * item.price, 0);

        // 2. Tạo phiếu nhập
        const importNote = new ImportNote({
            user: req.user._id,
            importItems,
            totalPrice,
            note
        });
        const createdImportNote = await importNote.save();

        // 3. QUAN TRỌNG: CẬP NHẬT SỐ LƯỢNG TỒN KHO CHO TỪNG SẢN PHẨM
        for (const item of importItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock = product.countInStock + Number(item.qty);
                await product.save();
            }
        }

        res.status(201).json(createdImportNote);
    }
};

// @desc    Lấy danh sách phiếu nhập
// @route   GET /api/imports
// @access  Private/Admin
const getImportNotes = async (req, res) => {
    const notes = await ImportNote.find({}).populate('user', 'name').sort({ createdAt: -1 });
    res.json(notes);
};

const getImportNoteById = async (req, res) => {
    const note = await ImportNote.findById(req.params.id)
        .populate('user', 'name email')
        .populate('importItems.product', 'image'); // Lấy thêm ảnh sản phẩm để hiển thị cho đẹp

    if (note) {
        res.json(note);
    } else {
        res.status(404);
        throw new Error('Không tìm thấy phiếu nhập');
    }
};

module.exports = { createImportNote, getImportNotes, getImportNoteById };