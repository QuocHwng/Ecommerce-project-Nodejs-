const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const uploadRoutes = require('./uploads/uploadRoutes'); // Import file vừa tạo
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const importRoutes = require('./routes/importRoutes');
const exportRoutes = require('./routes/exportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const statsRoutes = require('./routes/statsRoutes');
const shippingRoutes = require('./routes/shippingRoutes');

// 1. Cấu hình dotenv để đọc file .env
dotenv.config();

const app = express();

// 2. Middleware
app.use(express.json());
app.use(cors());

// 3. Hàm kết nối MongoDB (Phần bạn đang thiếu)
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB đã kết nối: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Lỗi kết nối: ${error.message}`);
        process.exit(1);
    }
};

// Gọi hàm kết nối
connectDB();

// 4. API Test trang chủ
app.get('/', (req, res) => {
    res.send('Server Web Bán Hàng đang chạy và ĐÃ kết nối Database! 🚀');
});

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes); // Kích hoạt đường dẫn upload
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/imports', importRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/shipping', shippingRoutes);

const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));
// 5. Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});