const path = require('path');
const express = require('express');
const multer = require('multer');

const router = express.Router();

// 1. Cấu hình nơi lưu trữ
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Lưu vào thư mục 'uploads' ở root
  },
  filename(req, file, cb) {
    // Đặt tên file: tên-gốc + ngày-tháng + đuôi-file (để tránh trùng tên)
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// 2. Kiểm tra loại file (chỉ cho phép ảnh)
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/; // Các đuôi cho phép
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Lỗi: Chỉ được upload file ảnh!');
  }
}

// 3. Khởi tạo Multer
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 4. Tạo đường dẫn Upload
// Khi Frontend gọi vào đây, nó sẽ upload 1 file có tên là 'image'
router.post('/', upload.single('image'), (req, res) => {
  // Trả về đường dẫn file đã lưu để Frontend dùng
  res.send(`/${req.file.path.replace(/\\/g, "/")}`); 
});

module.exports = router;