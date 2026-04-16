// backend/data/products.js
const products = [
  {
    name: 'iPhone 15 Pro Max',
    image: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-1.jpg',
    description: 'Chip A17 Pro siêu mạnh, khung viền Titan.',
    category: 'Phone',
    price: 34000000,
    countInStock: 10,
  },
  {
    name: 'MacBook Pro M3',
    image: 'https://cdn.tgdd.vn/Products/Images/44/318134/macbook-pro-14-m3-space-gray-1.jpg',
    description: 'Hiệu năng đỉnh cao cho dân lập trình.',
    category: 'Laptop',
    price: 39900000,
    countInStock: 5,
  },
  {
    name: 'Logitech G502',
    image: 'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502-hero/g502-hero-gallery-1.png',
    description: 'Chuột gaming quốc dân.',
    category: 'Electronics',
    price: 1200000,
    countInStock: 20,
  }
];

module.exports = products;