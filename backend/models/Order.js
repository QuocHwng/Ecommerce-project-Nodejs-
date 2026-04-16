// const mongoose = require('mongoose');

// const orderSchema = mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: 'User', // Liên kết với bảng User để biết ai mua
//     },
//     orderItems: [
//       {
//         name: { type: String, required: true },
//         qty: { type: Number, required: true },
//         image: { type: String, required: true },
//         price: { type: Number, required: true },
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           required: true,
//           ref: 'Product',
//         },
//       },
//     ],
//     shippingAddress: {
//       address: { type: String, required: true },
//       city: { type: String, required: true },
//       phone: { type: String, required: true },
//       country: { type: String, required: true },
//     },
//     paymentMethod: {
//       type: String,
//       required: true,
//     },
//     // Kết quả thanh toán (Lưu thông tin từ VNPay trả về)
//     paymentResult: {
//       id: { type: String },
//       status: { type: String },
//       update_time: { type: String },
//       email_address: { type: String },
//     },
//     itemsPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     shippingPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     totalPrice: {
//       type: Number,
//       required: true,
//       default: 0.0,
//     },
//     isPaid: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     paidAt: {
//       type: Date,
//     },
//     isDelivered: {
//       type: Boolean,
//       required: true,
//       default: false,
//     },
//     deliveredAt: {
//       type: Date,
//     },
//     isCancelled: { type: Boolean, required: true, default: false },
//     cancellationReason: { type: String },
//   },
//   {
//     timestamps: true, // Tự động tạo createdAt, updatedAt
//   }
// );

// module.exports = mongoose.model('Order', orderSchema);
// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    // Người đặt hàng
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    // Danh sách sản phẩm trong đơn
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],

    // Địa chỉ giao hàng
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: false },
      country: { type: String, required: true },
    },

    // --- [MỚI] THÔNG TIN VẬN CHUYỂN NÂNG CAO ---
    shippingMethod: { 
        type: String, 
        required: true, 
        default: 'Tiêu chuẩn' // VD: Hỏa tốc, Tiết kiệm...
    },
    shippingPrice: { 
        type: Number, 
        required: true, 
        default: 0.0 
    },
    trackingNumber: { 
        type: String 
        // Không required vì lúc mới đặt chưa có mã này, Admin sẽ cập nhật sau
    }, 
    carrier: { 
        type: String 
        // VD: GHTK, ViettelPost, J&T... (Admin cập nhật sau)
    },
    // ---------------------------------------------

    // Phương thức thanh toán
    paymentMethod: {
      type: String,
      required: true,
    },
    
    // Kết quả thanh toán (lưu từ PayPal/VNPAY trả về)
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },

    // Các loại phí và tổng tiền
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    // Trạng thái Thanh toán
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },

    // Trạng thái Giao hàng
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    shipperName: { type: String },
    shipperPhone: { type: String },
    // ------------------------------
    trackingNumber: { type: String },
    carrier: { type: String },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;