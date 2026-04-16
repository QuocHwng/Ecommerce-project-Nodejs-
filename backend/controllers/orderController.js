

// // backend/controllers/orderController.js
// const Order = require('../models/Order');
// const Product = require('../models/Product');
// const User = require('../models/User');
// const ExportNote = require('../models/ExportNote');
// const moment = require('moment'); //
// const querystring = require('querystring'); // Sử dụng thư viện chuẩn của Node.js
// const crypto = require('crypto');

// // -----------------------------------------------------------------------------
// // 1. TẠO ĐƠN HÀNG MỚI & TRỪ TỒN KHO & TẠO PHIẾU XUẤT
// // -----------------------------------------------------------------------------
// const addOrderItems = async (req, res) => {
//   const {
//     orderItems,
//     shippingAddress,
//     paymentMethod,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     shippingMethod, // Nhận thêm phương thức vận chuyển
//     totalPrice,
//   } = req.body;

//   if (orderItems && orderItems.length === 0) {
//     res.status(400);
//     throw new Error('Không có sản phẩm nào trong giỏ hàng');
//   } else {
//     // A. KIỂM TRA VÀ TRỪ TỒN KHO TRƯỚC (Logic giữ chỗ)
//     for (const item of orderItems) {
//       const product = await Product.findById(item.product);
//       if (!product) {
//         res.status(404);
//         throw new Error(`Sản phẩm ${item.name} không tồn tại`);
//       }
//       if (product.countInStock < item.qty) {
//         res.status(400);
//         throw new Error(`Sản phẩm ${item.name} đã hết hàng hoặc không đủ số lượng (Còn: ${product.countInStock})`);
//       }
//       // Trừ kho ngay lập tức
//       product.countInStock = product.countInStock - item.qty;
//       await product.save();
//     }

//     // B. TẠO ĐƠN HÀNG
//     const order = new Order({
//       orderItems: orderItems.map((x) => ({
//         ...x,
//         product: x.product,
//         _id: undefined, // Xóa _id tạm của item để Mongo tự tạo mới
//       })),
//       user: req.user._id,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       shippingMethod, // Lưu phương thức vận chuyển
//       totalPrice,
//     });

//     const createdOrder = await order.save();

//     // C. TỰ ĐỘNG TẠO PHIẾU XUẤT KHO (Type: SALE)
//     const exportNote = new ExportNote({
//       user: req.user._id,
//       type: 'SALE',
//       orderId: createdOrder._id,
//       exportItems: orderItems.map((x) => ({
//         product: x.product,
//         name: x.name,
//         qty: x.qty,
//         price: x.price,
//       })),
//       reason: `Xuất bán theo đơn hàng #${createdOrder._id}`,
//     });
//     await exportNote.save();

//     res.status(201).json(createdOrder);
//   }
// };

// // -----------------------------------------------------------------------------
// // 2. TẠO URL THANH TOÁN VNPAY
// // -----------------------------------------------------------------------------
// const createPaymentUrl = (req, res) => {
//   process.env.TZ = 'Asia/Ho_Chi_Minh';

//   const { amount, orderId, bankCode, language } = req.body;

//   let ipAddr =
//     req.headers['x-forwarded-for'] ||
//     req.connection.remoteAddress ||
//     req.socket.remoteAddress ||
//     req.connection.socket.remoteAddress;

//   const tmnCode = process.env.VNP_TMN_CODE;
//   const secretKey = process.env.VNP_HASH_SECRET;
//   const vnpUrl = process.env.VNP_URL;
//   const returnUrl = process.env.VNP_RETURN_URL;

//   const date = new Date();
//   const createDate = moment(date).format('YYYYMMDDHHmmss');

//   let vnp_Params = {};
//   vnp_Params['vnp_Version'] = '2.1.0';
//   vnp_Params['vnp_Command'] = 'pay';
//   vnp_Params['vnp_TmnCode'] = tmnCode;
//   vnp_Params['vnp_Locale'] = language || 'vn';
//   vnp_Params['vnp_CurrCode'] = 'VND';
//   vnp_Params['vnp_TxnRef'] = orderId;
//   vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
//   vnp_Params['vnp_OrderType'] = 'other';
//   vnp_Params['vnp_Amount'] = amount * 100;
//   vnp_Params['vnp_ReturnUrl'] = returnUrl;
//   vnp_Params['vnp_IpAddr'] = ipAddr;
//   vnp_Params['vnp_CreateDate'] = createDate;

//   if (bankCode) {
//     vnp_Params['vnp_BankCode'] = bankCode;
//   }

//   vnp_Params = sortObject(vnp_Params);

//   const signData = querystring.stringify(vnp_Params, { encode: false });
//   const hmac = crypto.createHmac('sha512', secretKey);
//   const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
//   vnp_Params['vnp_SecureHash'] = signed;

//   const finalUrl = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });

//   res.status(200).json({ vnpUrl: finalUrl });
// };

// // Helper function cho VNPAY
// function sortObject(obj) {
//   let sorted = {};
//   let str = [];
//   let key;
//   for (key in obj) {
//     if (obj.hasOwnProperty(key)) {
//       str.push(encodeURIComponent(key));
//     }
//   }
//   str.sort();
//   for (key = 0; key < str.length; key++) {
//     sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
//   }
//   return sorted;
// }

// // -----------------------------------------------------------------------------
// // 3. CÁC HÀM GET (Lấy dữ liệu)
// // -----------------------------------------------------------------------------
// const getMyOrders = async (req, res) => {
//   const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
//   res.json(orders);
// };

// const getOrders = async (req, res) => {
//   // Lấy tất cả đơn hàng, populate thông tin user
//   const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
//   res.json(orders);
// };

// const getOrderById = async (req, res) => {
//   const order = await Order.findById(req.params.id).populate('user', 'name email');
//   if (order) {
//     res.json(order);
//   } else {
//     res.status(404);
//     throw new Error('Không tìm thấy đơn hàng');
//   }
// };

// // -----------------------------------------------------------------------------
// // 4. CÁC HÀM UPDATE (Cập nhật trạng thái)
// // -----------------------------------------------------------------------------
// const updateOrderToPaid = async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       update_time: req.body.update_time,
//       email_address: req.body.email_address,
//     };
//     const updatedOrder = await order.save();
    
//     // Lưu ý: Không cần trừ kho ở đây nữa vì đã trừ ở addOrderItems
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error('Không tìm thấy đơn hàng');
//   }
// };

// const updateOrderToDelivered = async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isDelivered = true;
//     order.deliveredAt = Date.now();

//     // Lưu thông tin vận chuyển (Tracking)
//     if (req.body.trackingNumber) {
//       order.trackingNumber = req.body.trackingNumber;
//     }
//     if (req.body.carrier) {
//       order.carrier = req.body.carrier;
//     }

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error('Không tìm thấy đơn hàng');
//   }
// };

// const cancelOrder = async (req, res) => {
//   const order = await Order.findById(req.params.id);
//   if (order) {
//     if (order.isDelivered) {
//       res.status(400);
//       throw new Error('Đơn hàng đã giao, không thể hủy!');
//     }

//     // 1. Đánh dấu hủy
//     order.isCancelled = true;
//     const updatedOrder = await order.save();

//     // 2. HOÀN LẠI TỒN KHO (Quan trọng: Vì lúc tạo đơn đã trừ)
//     for (const item of order.orderItems) {
//         const product = await Product.findById(item.product);
//         if (product) {
//             product.countInStock += item.qty;
//             await product.save();
//         }
//     }

//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error('Không tìm thấy đơn hàng');
//   }
// };

// // -----------------------------------------------------------------------------
// // 5. CÁC HÀM THỐNG KÊ (Stats)
// // -----------------------------------------------------------------------------
// const getDashboardStats = async (req, res) => {
//   const productCount = await Product.countDocuments();
//   const userCount = await User.countDocuments();
//   const orderCount = await Order.countDocuments();
//   const totalRevenueData = await Order.aggregate([
//     { $match: { isPaid: true } },
//     { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
//   ]);
//   const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].totalSales : 0;
  
//   res.json({ productCount, userCount, orderCount, totalRevenue });
// };

// const getOrderStats = async (req, res) => {
//   const date = new Date();
//   const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  
//   const stats = await Order.aggregate([
//     { $match: { createdAt: { $gte: lastMonth }, isPaid: true } },
//     {
//       $project: {
//         month: { $month: '$createdAt' },
//         day: { $dayOfMonth: '$createdAt' },
//         year: { $year: '$createdAt' },
//         totalPrice: 1,
//       },
//     },
//     {
//       $group: {
//         _id: { day: '$day', month: '$month', year: '$year' },
//         totalSales: { $sum: '$totalPrice' },
//         totalOrders: { $sum: 1 },
//       },
//     },
//     { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
//   ]);

//   const formattedStats = stats.map((item) => ({
//     date: `${item._id.day}/${item._id.month}`,
//     sales: item.totalSales,
//     orders: item.totalOrders,
//   }));
  
//   res.json(formattedStats);
// };

// const getOrderStatusStats = async (req, res) => {
//   const delivered = await Order.countDocuments({ isDelivered: true });
//   const cancelled = await Order.countDocuments({ isCancelled: true });
//   const pending = await Order.countDocuments({ isDelivered: false, isCancelled: false }); // Đơn chưa giao & chưa hủy
  
//   res.json([
//     { name: 'Đã giao thành công', value: delivered, color: '#16a34a' },
//     { name: 'Đang xử lý / Vận chuyển', value: pending, color: '#ca8a04' },
//     { name: 'Đã hủy', value: cancelled, color: '#dc2626' },
//   ]);
// };

// module.exports = {
//   addOrderItems,
//   createPaymentUrl,
//   getMyOrders,
//   getOrders,
//   getOrderById,
//   updateOrderToPaid,
//   updateOrderToDelivered,
//   cancelOrder,
//   getDashboardStats,
//   getOrderStats,
//   getOrderStatusStats,
// };

const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const ExportNote = require('../models/ExportNote');
const moment = require('moment'); 
const qs = require('qs'); 
const crypto = require('crypto');
const axios = require('axios');
// -----------------------------------------------------------------------------
// 1. TẠO ĐƠN HÀNG MỚI & TRỪ TỒN KHO & TẠO PHIẾU XUẤT
// -----------------------------------------------------------------------------
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    shippingMethod,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Không có sản phẩm nào trong giỏ hàng');
  } else {
    // A. KIỂM TRA VÀ TRỪ TỒN KHO TRƯỚC
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Sản phẩm ${item.name} không tồn tại`);
      }
      if (product.countInStock < item.qty) {
        res.status(400);
        throw new Error(`Sản phẩm ${item.name} đã hết hàng hoặc không đủ số lượng (Còn: ${product.countInStock})`);
      }
      // Trừ kho ngay lập tức
      product.countInStock -= item.qty;
      await product.save();
    }

    // B. TẠO ĐƠN HÀNG
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x.product,
        _id: undefined, 
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      shippingMethod, 
      totalPrice,
    });

    const createdOrder = await order.save();

    // C. TỰ ĐỘNG TẠO PHIẾU XUẤT KHO (Type: SALE)
    const exportNote = new ExportNote({
      user: req.user._id,
      type: 'SALE',
      orderId: createdOrder._id,
      exportItems: orderItems.map((x) => ({
        product: x.product,
        name: x.name,
        qty: x.qty,
        price: x.price,
      })),
      reason: `Xuất bán theo đơn hàng #${createdOrder._id}`,
    });
    await exportNote.save();

    res.status(201).json(createdOrder);
  }
};

// -----------------------------------------------------------------------------
// 2. TẠO URL THANH TOÁN VNPAY
// -----------------------------------------------------------------------------
const createPaymentUrl = (req, res) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  const { amount, orderId, bankCode, language } = req.body;

  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURN_URL;

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = language || 'vn';
  vnp_Params['vnp_CurrCode'] = 'VND';
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang ' + orderId;
  vnp_Params['vnp_OrderType'] = 'other';
  vnp_Params['vnp_Amount'] = amount * 100; // Nhân 100 theo chuẩn VNPAY
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  // Sắp xếp object
  vnp_Params = sortObject(vnp_Params);

  // Tạo chữ ký bảo mật
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  const finalUrl = vnpUrl + '?' + qs.stringify(vnp_Params, { encode: false });

  res.status(200).json({ vnpUrl: finalUrl });
};

// Helper function cho VNPAY
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

// -----------------------------------------------------------------------------
// 3. CÁC HÀM GET (Lấy dữ liệu)
// -----------------------------------------------------------------------------
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
  res.json(orders);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
};

// -----------------------------------------------------------------------------
// 4. CÁC HÀM UPDATE (Cập nhật trạng thái)
// -----------------------------------------------------------------------------
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
};

// const updateOrderToDelivered = async (req, res) => {
//   const order = await Order.findById(req.params.id);

//   if (order) {
//     order.isDelivered = true;
//     order.deliveredAt = Date.now();

//     if (req.body.trackingNumber) {
//       order.trackingNumber = req.body.trackingNumber;
//     }
//     if (req.body.carrier) {
//       order.carrier = req.body.carrier;
//     }

//     if (req.body.shipperName) order.shipperName = req.body.shipperName;
//     if (req.body.shipperPhone) order.shipperPhone = req.body.shipperPhone;

//     const updatedOrder = await order.save();
//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error('Không tìm thấy đơn hàng');
//   }
// };

// -----------------------------------------------------------------------------
// CẬP NHẬT GIAO HÀNG & GIẢ LẬP API GHN (MOCK API CHỐNG GỌI SHIPPER)
// -----------------------------------------------------------------------------
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    if (order.isDelivered) {
        res.status(400);
        throw new Error('Đơn hàng này đã được gửi đi rồi!');
    }

    let trackingNumber = req.body.trackingNumber || "";
    let carrier = req.body.carrier || "SHOP";
    let shipperName = req.body.shipperName || "";
    let shipperPhone = req.body.shipperPhone || "";

    // NẾU ADMIN CHỌN GHN -> XỬ LÝ THEO CHẾ ĐỘ
    if (req.body.carrier === 'GHN') {
        
        // 💡 CÔNG TẮC BẢO VỆ LẬP TRÌNH VIÊN 
        // true: Giả lập tạo mã an toàn (Dùng khi đang code/test)
        // false: Gọi shipper thật đến lấy hàng (Dùng khi web đã ra mắt)
        const isTestMode = true; 

        if (isTestMode) {
            // === CÁCH 1: MOCK API (GIẢ LẬP HỆ THỐNG GHN) ===
            // Mô phỏng việc chờ server GHN xử lý trong 1 giây
            const fakeResponse = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        // Tạo mã giống định dạng của GHN thật (VD: 5EN938102)
                        order_code: "5EN" + Math.floor(Math.random() * 10000000) 
                    });
                }, 1000);
            });

            trackingNumber = fakeResponse.order_code;
            carrier = 'GHN (Test Mode)';
            shipperName = "Hệ thống GHN Test đang điều phối...";
            shipperPhone = "Đang chờ...";

        } else {
            // === CÁCH 2: GỌI API GHN THẬT ===
            try {
                const itemsGHN = order.orderItems.map(item => ({
                    name: item.name, quantity: item.qty, price: item.price, weight: 200
                }));

                const ghnPayload = {
                    payment_type_id: 2, 
                    note: "ĐƠN HÀNG THẬT TỪ QUỐC HƯNG SHOP", 
                    required_note: "CHOXEMHANGKHONGTHU", 
                    to_name: order.user.name,
                    to_phone: order.shippingAddress.phone || "0909999999", 
                    to_address: order.shippingAddress.address,
                    to_ward_code: "20308", // Hardcode để tránh lỗi "Address convert fail"
                    to_district_id: 1444, 
                    weight: itemsGHN.length * 200,
                    length: 10, width: 10, height: 10,
                    service_type_id: 2,
                    items: itemsGHN
                };

                const ghnConfig = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': process.env.GHN_TOKEN,
                        'ShopId': process.env.GHN_SHOP_ID
                    }
                };

                const { data: ghnResponse } = await axios.post(
                    'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/create',
                    ghnPayload,
                    ghnConfig
                );

                trackingNumber = ghnResponse.data.order_code;
                carrier = 'GHN';
                shipperName = "Hệ thống GHN đang điều phối...";
                shipperPhone = "Đang chờ...";

            } catch (error) {
                res.status(400);
                throw new Error("Lỗi kết nối GHN: " + (error.response?.data?.message || error.message));
            }
        }
    }

    // LƯU CẬP NHẬT VÀO DATABASE
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.trackingNumber = trackingNumber;
    order.carrier = carrier;
    order.shipperName = shipperName;
    order.shipperPhone = shipperPhone;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
};

const cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    if (order.isDelivered) {
      res.status(400);
      throw new Error('Đơn hàng đã giao, không thể hủy!');
    }

    order.isCancelled = true;
    const updatedOrder = await order.save();

    for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            product.countInStock += item.qty;
            await product.save();
        }
    }

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Không tìm thấy đơn hàng');
  }
};

// -----------------------------------------------------------------------------
// 5. CÁC HÀM THỐNG KÊ (Stats)
// -----------------------------------------------------------------------------
const getDashboardStats = async (req, res) => {
  const productCount = await Product.countDocuments();
  const userCount = await User.countDocuments();
  const orderCount = await Order.countDocuments();
  const totalRevenueData = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].totalSales : 0;
  
  res.json({ productCount, userCount, orderCount, totalRevenue });
};

const getOrderStats = async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  
  const stats = await Order.aggregate([
    { $match: { createdAt: { $gte: lastMonth }, isPaid: true } },
    {
      $project: {
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' },
        year: { $year: '$createdAt' },
        totalPrice: 1,
      },
    },
    {
      $group: {
        _id: { day: '$day', month: '$month', year: '$year' },
        totalSales: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  const formattedStats = stats.map((item) => ({
    date: `${item._id.day}/${item._id.month}`,
    sales: item.totalSales,
    orders: item.totalOrders,
  }));
  
  res.json(formattedStats);
};

const getOrderStatusStats = async (req, res) => {
  const delivered = await Order.countDocuments({ isDelivered: true });
  const cancelled = await Order.countDocuments({ isCancelled: true });
  const pending = await Order.countDocuments({ isDelivered: false, isCancelled: false }); 
  
  res.json([
    { name: 'Đã giao thành công', value: delivered, color: '#16a34a' },
    { name: 'Đang xử lý / Vận chuyển', value: pending, color: '#ca8a04' },
    { name: 'Đã hủy', value: cancelled, color: '#dc2626' },
  ]);
};

module.exports = {
  addOrderItems,
  createPaymentUrl,
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  cancelOrder,
  getDashboardStats,
  getOrderStats,
  getOrderStatusStats,
};