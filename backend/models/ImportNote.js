// backend/models/ImportNote.js
const mongoose = require('mongoose');

const importNoteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Người tạo phiếu (Thủ kho/Admin)
    },
    importItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            name: { type: String, required: true },
            qty: { type: Number, required: true }, // Số lượng nhập
            price: { type: Number, required: true } // Giá vốn (giá nhập vào)
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    note: { type: String } // Ghi chú (VD: Nhập hàng đợt 1 từ nhà cung cấp A)
}, {
    timestamps: true
});

const ImportNote = mongoose.model('ImportNote', importNoteSchema);
module.exports = ImportNote;