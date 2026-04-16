// backend/models/ExportNote.js
const mongoose = require('mongoose');

const exportNoteSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Người tạo phiếu (Admin hoặc System)
    },
    type: {
        type: String,
        required: true,
        enum: ['SALE', 'MANUAL'], // SALE: Xuất bán, MANUAL: Xuất tay
        default: 'MANUAL'
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order' // Nếu là SALE thì gắn ID đơn hàng vào
    },
    exportItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            name: { type: String, required: true },
            qty: { type: Number, required: true },
            price: { type: Number, required: true } // Giá bán hoặc giá vốn lúc xuất
        }
    ],
    reason: { type: String, required: true }, // Lý do xuất
}, {
    timestamps: true
});

const ExportNote = mongoose.model('ExportNote', exportNoteSchema);
module.exports = ExportNote;