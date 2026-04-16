const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem có token gửi lên không (Bearer token...)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ chuỗi "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token để lấy ID user
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB và gắn vào biến req.user (trừ mật khẩu)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Cho phép đi tiếp
    } catch (error) {
      res.status(401).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại!' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Bạn chưa được cấp quyền, không có token!' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};
module.exports = { protect, admin };