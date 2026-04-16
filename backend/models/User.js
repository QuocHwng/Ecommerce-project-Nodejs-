const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Email không được trùng
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    avatar: { 
      type: String, 
      required: true, 
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" 
    },
    isAdmin: { type: Boolean, required: true, default: false }, // Mặc định là khách hàng (false)
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);