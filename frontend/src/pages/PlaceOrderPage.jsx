// // frontend/src/pages/PlaceOrderPage.jsx
// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaMapMarkerAlt, FaCreditCard, FaTruck, FaBox, FaMoneyBillWave } from 'react-icons/fa';
// import CheckoutSteps from '../components/CheckoutSteps';

// const PlaceOrderPage = () => {
//   const navigate = useNavigate();

//   // 1. Lấy dữ liệu giỏ hàng từ LocalStorage
//   const [cart, setCart] = useState({
//     cartItems: [],
//     shippingAddress: {},
//     paymentMethod: 'PayPal',
//   });

//   // 2. State cho gói vận chuyển
//   const [shippingMethods, setShippingMethods] = useState([]);
//   const [selectedShipping, setSelectedShipping] = useState(null);

//   // Load dữ liệu ban đầu
//   useEffect(() => {
//     // Lấy Cart & Info từ LocalStorage
//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
//     const paymentMethod = localStorage.getItem('paymentMethod') || 'PayPal';

//     // Nếu chưa có Shipping Address -> Đá về trang nhập địa chỉ
//     if (!shippingAddress.address) {
//       navigate('/shipping');
//     } else {
//       setCart({ cartItems, shippingAddress, paymentMethod });
//     }

//     // --- GỌI API LẤY DANH SÁCH GÓI CƯỚC VẬN CHUYỂN ---
//     const fetchShippingMethods = async () => {
//       try {
//         const { data } = await axios.get('https://ecommerce-project-nodejs.onrender.com/api/shipping');
//         setShippingMethods(data);
        
//         // Mặc định chọn gói đầu tiên (thường là Tiêu chuẩn hoặc Rẻ nhất)
//         if (data.length > 0) {
//             // Tìm gói nào có isDefault = true, nếu không thì lấy cái đầu tiên
//             const defaultMethod = data.find(m => m.isDefault) || data[0];
//             setSelectedShipping(defaultMethod);
//         }
//       } catch (error) {
//         console.error("Lỗi lấy gói vận chuyển:", error);
//       }
//     };
//     fetchShippingMethods();

//   }, [navigate]);

//   // --- TÍNH TOÁN CÁC LOẠI PHÍ ---
//   const addDecimals = (num) => {
//     return (Math.round(num * 100) / 100).toFixed(0); // Làm tròn số nguyên cho VNĐ
//   };

//   // 1. Tiền hàng
//   const itemsPrice = cart.cartItems.reduce(
//     (acc, item) => acc + item.price * item.qty,
//     0
//   );

//   // 2. Phí vận chuyển (Lấy từ gói đã chọn, nếu chưa chọn thì = 0)
//   const shippingPrice = selectedShipping ? selectedShipping.price : 0;

//   // 3. Thuế (Ví dụ 0% hoặc 10% tùy chính sách, ở đây để 0 cho đơn giản hoặc 10% nếu muốn)
//   // const taxPrice = Number((0.1 * itemsPrice).toFixed(0)); 
//   const taxPrice = 0; 

//   // 4. Tổng cộng
//   const totalPrice = Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice);

//   // --- XỬ LÝ ĐẶT HÀNG ---
//   const placeOrderHandler = async () => {
//     try {
//       const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       };

//       // Gửi dữ liệu lên Server (Khớp với Order Model mới)
//       const { data } = await axios.post(
//         'https://ecommerce-project-nodejs.onrender.com/api/orders',
//         {
//           orderItems: cart.cartItems,
//           shippingAddress: cart.shippingAddress,
//           paymentMethod: cart.paymentMethod,
          
//           // Thông tin giá cả
//           itemsPrice: itemsPrice,
//           taxPrice: taxPrice,
//           totalPrice: totalPrice,

//           // --- THÔNG TIN VẬN CHUYỂN MỚI ---
//           shippingMethod: selectedShipping ? selectedShipping.name : 'Tiêu chuẩn',
//           shippingPrice: shippingPrice,
//           // --------------------------------
//         },
//         config
//       );

//       // Đặt hàng xong -> Xóa giỏ hàng -> Chuyển sang trang chi tiết đơn
//       localStorage.removeItem('cartItems');
//       navigate(`/order-success?id=${data._id}`);

//     } catch (error) {
//       alert(error.response && error.response.data.message
//         ? error.response.data.message
//         : error.message);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-10 px-4">
//       <CheckoutSteps step1 step2 step3 step4 />

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        
//         {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
//         <div className="md:col-span-2 space-y-6">
          
//           {/* 1. Địa chỉ giao hàng */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//             <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
//                <FaMapMarkerAlt className="text-red-500" /> Địa chỉ nhận hàng
//             </h2>
//             <p className="text-slate-600">
//               <span className="font-bold text-slate-800">Địa chỉ: </span>
//               {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
//               {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
//             </p>
//           </div>

//           {/* 2. Phương thức thanh toán */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//             <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
//                <FaCreditCard className="text-blue-500" /> Phương thức thanh toán
//             </h2>
//             <p className="font-bold text-slate-700">
//                {cart.paymentMethod === 'VNPAY' ? 'Thanh toán qua ví VNPAY' : 'Thanh toán khi nhận hàng (COD)'}
//             </p>
//           </div>

//           {/* 3. [MỚI] CHỌN GÓI VẬN CHUYỂN */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
//                 <FaTruck className="text-orange-500" /> Đơn vị vận chuyển
//              </h2>
             
//              {shippingMethods.length === 0 ? (
//                  <div className="text-slate-500 italic">Đang tải gói vận chuyển hoặc chưa có cấu hình... (Mặc định: Tiêu chuẩn)</div>
//              ) : (
//                  <div className="space-y-3">
//                      {shippingMethods.map((method) => (
//                          <div 
//                             key={method._id} 
//                             onClick={() => setSelectedShipping(method)}
//                             className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
//                                 selectedShipping?._id === method._id 
//                                 ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
//                                 : 'border-slate-200 hover:bg-slate-50'
//                             }`}
//                          >
//                              <div className="flex items-center gap-3">
//                                  <input 
//                                      type="radio" 
//                                      name="shippingMethod" 
//                                      checked={selectedShipping?._id === method._id}
//                                      onChange={() => setSelectedShipping(method)}
//                                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
//                                  />
//                                  <div>
//                                      <p className="font-bold text-slate-800 text-sm md:text-base">{method.name}</p>
//                                      <p className="text-xs text-slate-500">Thời gian giao: {method.estimatedTime}</p>
//                                  </div>
//                              </div>
//                              <span className="font-bold text-blue-600">{method.price.toLocaleString()}đ</span>
//                          </div>
//                      ))}
//                  </div>
//              )}
//           </div>

//           {/* 4. Danh sách sản phẩm */}
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
//             <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
//                <FaBox className="text-green-500" /> Sản phẩm đặt mua
//             </h2>
//             {cart.cartItems.length === 0 ? (
//               <p>Giỏ hàng trống</p>
//             ) : (
//               <div className="divide-y">
//                 {cart.cartItems.map((item, index) => (
//                   <div key={index} className="flex items-center py-4">
//                     <div className="w-16 h-16 flex-shrink-0 border rounded overflow-hidden">
//                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
//                     </div>
//                     <div className="ml-4 flex-1">
//                       <Link to={`/product/${item.product}`} className="text-sm font-bold text-slate-700 hover:text-blue-600">
//                         {item.name}
//                       </Link>
//                       <p className="text-xs text-slate-500 mt-1">
//                         {item.qty} x {item.price.toLocaleString()}đ = <span className="font-bold text-slate-800">{(item.qty * item.price).toLocaleString()}đ</span>
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* CỘT PHẢI: TỔNG HỢP & ĐẶT HÀNG */}
//         <div className="md:col-span-1">
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-4">
//             <h2 className="text-xl font-black text-slate-800 mb-6 uppercase text-center border-b pb-4">
//                 Tổng đơn hàng
//             </h2>

//             <div className="space-y-4 text-sm text-slate-600">
//               <div className="flex justify-between">
//                 <span>Tạm tính:</span>
//                 <span className="font-bold text-slate-800">{itemsPrice.toLocaleString()}đ</span>
//               </div>
              
//               <div className="flex justify-between">
//                 <span>Phí vận chuyển:</span>
//                 <span className="font-bold text-slate-800">{shippingPrice.toLocaleString()}đ</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Thuế (VAT):</span>
//                 <span className="font-bold text-slate-800">{taxPrice.toLocaleString()}đ</span>
//               </div>

//               <div className="border-t pt-4 flex justify-between text-lg font-black text-red-600">
//                 <span>Tổng cộng:</span>
//                 <span>{totalPrice.toLocaleString()}đ</span>
//               </div>
//             </div>

//             {/* Thông báo gói vận chuyển đang chọn */}
//             {selectedShipping && (
//                 <div className="mt-4 bg-blue-50 text-blue-700 p-2 rounded text-xs text-center border border-blue-100">
//                     Gói vận chuyển: <strong>{selectedShipping.name}</strong>
//                 </div>
//             )}

//             <button
//               type="button"
//               className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase mt-6 hover:bg-slate-800 transition flex justify-center items-center gap-2 shadow-lg shadow-slate-300"
//               disabled={cart.cartItems.length === 0}
//               onClick={placeOrderHandler}
//             >
//               <FaMoneyBillWave /> Đặt hàng ngay
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default PlaceOrderPage;
// frontend/src/pages/PlaceOrderPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCreditCard, FaTruck, FaBox, FaMoneyBillWave } from 'react-icons/fa';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderPage = () => {
  const navigate = useNavigate();

  // 1. Lấy dữ liệu giỏ hàng từ LocalStorage
  const [cart, setCart] = useState({
    cartItems: [],
    shippingAddress: {},
    paymentMethod: 'VNPAY', // Mặc định khớp với PaymentPage
  });

  // 2. State cho gói vận chuyển
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  // Load dữ liệu ban đầu
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
    const paymentMethod = localStorage.getItem('paymentMethod') || 'VNPAY';

    if (!shippingAddress.address) {
      navigate('/shipping');
    } else {
      setCart({ cartItems, shippingAddress, paymentMethod });
    }

    const fetchShippingMethods = async () => {
      try {
        const { data } = await axios.get('https://ecommerce-project-nodejs.onrender.com/api/shipping');
        setShippingMethods(data);
        if (data.length > 0) {
            const defaultMethod = data.find(m => m.isDefault) || data[0];
            setSelectedShipping(defaultMethod);
        }
      } catch (error) {
        console.error("Lỗi lấy gói vận chuyển:", error);
      }
    };
    fetchShippingMethods();
  }, [navigate]);

  // --- TÍNH TOÁN CÁC LOẠI PHÍ ---
  const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = selectedShipping ? selectedShipping.price : 0;
  const taxPrice = 0; 
  const totalPrice = Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice);

  // --- XỬ LÝ ĐẶT HÀNG ---
  const placeOrderHandler = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // BƯỚC 1: TẠO ĐƠN HÀNG TRÊN SERVER
      const { data } = await axios.post(
        'https://ecommerce-project-nodejs.onrender.com/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: itemsPrice,
          taxPrice: taxPrice,
          totalPrice: totalPrice,
          shippingMethod: selectedShipping ? selectedShipping.name : 'Tiêu chuẩn',
          shippingPrice: shippingPrice,
        },
        config
      );

      // BƯỚC 2: KIỂM TRA PHƯƠNG THỨC THANH TOÁN ĐỂ REDIRECT
      if (cart.paymentMethod === 'VNPAY') {
        // Nếu chọn VNPAY -> Gọi tiếp API lấy Link VNPAY
        const { data: paymentData } = await axios.post(
          'https://ecommerce-project-nodejs.onrender.com/api/orders/create_payment_url',
          {
            amount: totalPrice,
            orderId: data._id, // ID đơn hàng vừa tạo ở bước 1
          },
          config
        );

        // Xóa giỏ hàng local
        localStorage.removeItem('cartItems');

        // NHẢY SANG TRANG THANH TOÁN CỦA VNPAY
        if (paymentData.vnpUrl) {
            window.location.href = paymentData.vnpUrl;
        } else {
            alert("Không thể tạo link thanh toán VNPAY");
        }
      } else {
        // Nếu chọn COD -> Chuyển sang trang success bình thường
        localStorage.removeItem('cartItems');
        navigate(`/order-success?id=${data._id}`);
      }

    } catch (error) {
      alert(error.response && error.response.data.message
        ? error.response.data.message
        : error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <CheckoutSteps step1 step2 step3 step4 />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
               <FaMapMarkerAlt className="text-red-500" /> Địa chỉ nhận hàng
            </h2>
            <p className="text-slate-600">
              {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
               <FaCreditCard className="text-blue-500" /> Phương thức thanh toán
            </h2>
            <p className="font-bold text-slate-700 uppercase">
               {cart.paymentMethod === 'VNPAY' ? 'Ví VNPAY / Thẻ ATM / Thẻ Quốc tế' : 'Thanh toán khi nhận hàng (COD)'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                <FaTruck className="text-orange-500" /> Đơn vị vận chuyển
             </h2>
             {shippingMethods.length === 0 ? (
                 <div className="text-slate-500 italic">Đang tải gói vận chuyển hoặc chưa có cấu hình...</div>
             ) : (
                 <div className="space-y-3">
                     {shippingMethods.map((method) => (
                         <div 
                            key={method._id} 
                            onClick={() => setSelectedShipping(method)}
                            className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                                selectedShipping?._id === method._id 
                                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                         >
                             <div className="flex items-center gap-3">
                                 <input 
                                    type="radio" 
                                    checked={selectedShipping?._id === method._id} 
                                    readOnly 
                                    className="w-5 h-5 text-blue-600" 
                                 />
                                 <div>
                                     <p className="font-bold text-slate-800">{method.name}</p>
                                     <p className="text-xs text-slate-500">{method.estimatedTime}</p>
                                 </div>
                             </div>
                             <span className="font-bold text-blue-600">{method.price.toLocaleString()}đ</span>
                         </div>
                     ))}
                 </div>
             )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
               <FaBox className="text-green-500" /> Sản phẩm đặt mua
            </h2>
            <div className="divide-y">
              {cart.cartItems.map((item, index) => (
                <div key={index} className="flex items-center py-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded border" />
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-bold text-slate-700">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.qty} x {item.price.toLocaleString()}đ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-4">
            <h2 className="text-xl font-black text-slate-800 mb-6 uppercase text-center border-b pb-4">Tổng đơn hàng</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between"><span>Tạm tính:</span><span className="font-bold">{itemsPrice.toLocaleString()}đ</span></div>
              <div className="flex justify-between"><span>Phí ship:</span><span className="font-bold">{shippingPrice.toLocaleString()}đ</span></div>
              <div className="border-t pt-4 flex justify-between text-lg font-black text-red-600">
                <span>Tổng cộng:</span><span>{totalPrice.toLocaleString()}đ</span>
              </div>
            </div>
            
            {selectedShipping && (
                <div className="mt-4 bg-blue-50 text-blue-700 p-2 rounded text-xs text-center border border-blue-100">
                    Gói vận chuyển: <strong>{selectedShipping.name}</strong>
                </div>
            )}

            <button
              className="w-full bg-black text-white py-4 rounded-lg font-bold mt-6 hover:bg-slate-800 flex justify-center items-center gap-2 shadow-lg shadow-slate-300"
              disabled={cart.cartItems.length === 0}
              onClick={placeOrderHandler}
            >
              <FaMoneyBillWave /> {cart.paymentMethod === 'VNPAY' ? 'Thanh toán ngay' : 'Xác nhận đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;