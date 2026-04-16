const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const products = require('./data/products'); // Đảm bảo bạn đã có file backend/data/products.js

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const importData = async () => {
  try {
    await Product.deleteMany(); 
    await Product.insertMany(products); 
    console.log('✅ Đã đổ hàng vào kho thành công!');
    process.exit();
  } catch (error) {
    console.error(`❌ Lỗi: ${error}`);
    process.exit(1);
  }
};

importData();