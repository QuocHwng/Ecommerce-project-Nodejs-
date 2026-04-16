// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hàm tạo Token (Vé vào cửa)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ==========================================
// PHẦN 1: DÀNH CHO KHÁCH HÀNG (PUBLIC & PRIVATE)
// ==========================================

// @desc    Đăng ký tài khoản
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone, address, gender } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email này đã được sử dụng!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      gender
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Thông tin không hợp lệ' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Đăng nhập & Lấy Token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Sai email hoặc mật khẩu!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Lấy thông tin hồ sơ cá nhân (để hiển thị lên trang Profile)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      avatar: user.avatar,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Cập nhật thông tin cá nhân
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.address = req.body.address || user.address;
    user.gender = req.body.gender || user.gender;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.password) {
      if (!req.body.oldPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu cũ để xác thực!' });
      }
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu cũ không chính xác!' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar: updatedUser.avatar,
      gender: updatedUser.gender,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }
};

// ==========================================
// PHẦN 2: DÀNH CHO ADMIN (QUẢN LÝ) - CÁI BẠN ĐANG THIẾU
// ==========================================

// @desc    Lấy danh sách tất cả người dùng
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

// @desc    Xóa người dùng
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'Đã xóa người dùng thành công' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
};

// @desc    Lấy chi tiết 1 người dùng (Admin xem để sửa)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
};

// @desc    Cập nhật người dùng (Admin dùng để cấp quyền Admin cho người khác)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    // Admin có thể sửa quyền Admin của người khác
    user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

// @desc    Thống kê người dùng mới (Dashboard)
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  const stats = await User.aggregate([
    { $match: { createdAt: { $gte: lastYear } } },
    {
      $project: {
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" },
      },
    },
    {
      $group: {
        _id: { month: "$month", year: "$year" },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const formattedStats = stats.map(item => ({
    name: `T${item._id.month}/${item._id.year}`,
    "Người dùng mới": item.totalUsers
  }));

  res.json(formattedStats);
};

// XUẤT KHẨU TẤT CẢ
module.exports = {
  authUser,
  registerUser,
  getUserProfile,    // Mới thêm
  updateUserProfile,
  getUsers,          // Mới thêm (Admin)
  deleteUser,        // Mới thêm (Admin)
  getUserById,       // Mới thêm (Admin)
  updateUser,        // Mới thêm (Admin)
  getUserStats
};