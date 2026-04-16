// backend/controllers/productController.js
const Product = require('../models/Product');

// 1. Lấy tất cả (Có lọc & tìm kiếm)
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    
    const categoryCondition = req.query.category 
      ? { category: req.query.category } 
      : {};

    const products = await Product.find({ ...keyword, ...categoryCondition });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Lấy 1 sản phẩm
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
};

// 3. Xóa sản phẩm
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Đã xóa sản phẩm' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
};

// 4. TẠO SẢN PHẨM MỚI (CHUẨN: Nhận dữ liệu từ Form)
const createProduct = async (req, res) => {
  const { name, price, image, brand, category, description } = req.body;

  const product = new Product({
    name,
    price,
    user: req.user._id,
    image,
    brand,
    category,
    countInStock: 0, // <--- LUÔN LÀ 0 (Theo đúng quy trình Kho)
    numReviews: 0,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// 5. Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
};

// 6. Đánh giá review
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Bạn đã đánh giá sản phẩm này rồi!');
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Đánh giá thành công' });
  } else {
    res.status(404);
    throw new Error('Không tìm thấy sản phẩm');
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};