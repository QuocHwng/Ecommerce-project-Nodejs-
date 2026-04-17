// // frontend/src/pages/OrderPage.jsx
// import { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
// import axios from 'axios';
// import { 
//     FaUser, FaMapMarkerAlt, FaEnvelope, FaBox, FaTruck, 
//     FaCreditCard, FaCheckCircle, FaTimesCircle, FaBarcode, FaMoneyBillWave 
// } from 'react-icons/fa';

// const OrderPage = () => {
//   const { id } = useParams();
//   const [sdkReady, setSdkReady] = useState(false);
//   const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // STATE ADMIN
//   const [trackingNumber, setTrackingNumber] = useState('');
//   const [carrier, setCarrier] = useState('GHTK'); 

//   const userInfo = JSON.parse(localStorage.getItem('userInfo'));

//   const fetchOrder = async () => {
//       try {
//         const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
//         const { data } = await axios.get(`https://ecommerce-project-nodejs.onrender.com/api/orders/${id}`, config);
//         setOrder(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message);
//         setLoading(false);
//       }
//   };

//   useEffect(() => {
//     if (!userInfo) {
//         window.location.href = '/login';
//         return;
//     }
    
//     const addPayPalScript = async () => {
//       const { data: clientId } = await axios.get('https://ecommerce-project-nodejs.onrender.com/api/config/paypal');
//       paypalDispatch({
//         type: 'resetOptions',
//         value: { 'client-id': clientId, currency: 'USD' },
//       });
//       paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
//     };

//     if (!order || order._id !== id) {
//        fetchOrder();
//     } else {
//        // Chỉ load PayPal script nếu là đơn chưa trả VÀ phương thức là PayPal
//        if (!order.isPaid && order.paymentMethod === 'PayPal') {
//           if (!window.paypal) {
//             addPayPalScript();
//           } else {
//             setSdkReady(true);
//           }
//        }
//     }
//   }, [id, order, paypalDispatch, userInfo]);


//   // 1. THANH TOÁN PAYPAL (Cho khách)
//   const onApprove = (data, actions) => {
//     return actions.order.capture().then(async function (details) {
//       try {
//         const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
//         await axios.put(`https://ecommerce-project-nodejs.onrender.com/api/orders/${order._id}/pay`, details, config);
//         alert("Thanh toán thành công!");
//         fetchOrder();
//       } catch (err) {
//         alert(err.message);
//       }
//     });
//   };

//   // 2. ADMIN XÁC NHẬN ĐÃ NHẬN TIỀN (Dành cho COD)
//   const markAsPaidHandler = async () => {
//       try {
//         const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
//         await axios.put(`https://ecommerce-project-nodejs.onrender.com/api/orders/${order._id}/pay`, {}, config);
//         alert("Đã cập nhật trạng thái: ĐÃ THANH TOÁN");
//         fetchOrder();
//       } catch (err) {
//         alert(err.message);
//       }
//   };

//   // 3. ADMIN GIAO HÀNG & NHẬP VẬN ĐƠN
//   const deliverHandler = async () => {
//     if(!trackingNumber) return alert("Vui lòng nhập Mã vận đơn!");
//     try {
//       const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
//       await axios.put(
//         `https://ecommerce-project-nodejs.onrender.com/api/orders/${order._id}/deliver`,
//         { trackingNumber, carrier }, 
//         config
//       );
//       alert("Đã cập nhật vận đơn thành công!");
//       fetchOrder();
//     } catch (err) {
//       alert(err.response?.data?.message || err.message);
//     }
//   };

//   if (loading) return <div className="p-10 text-center">Đang tải...</div>;
//   if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

//   return (
//     <div className="max-w-6xl mx-auto py-10 px-4">
//       <h1 className="text-2xl font-black text-slate-800 uppercase mb-2">Chi tiết đơn hàng</h1>
//       <p className="text-slate-500 font-mono text-sm mb-8">Order ID: #{order._id}</p>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
//         {/* --- CỘT TRÁI --- */}
//         <div className="md:col-span-2 space-y-6">
//           {/* Thông tin nhận hàng */}
//           <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
//             <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
//                <FaUser className="text-blue-500"/> Người nhận
//             </h2>
//             <div className="text-slate-700 text-sm space-y-1">
//                 <p><span className="font-bold">Tên:</span> {order.user?.name}</p>
//                 <p><span className="font-bold">Email:</span> {order.user?.email}</p>
//                 <p><span className="font-bold">Địa chỉ:</span> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
//             </div>
            
//             {/* TRẠNG THÁI GIAO HÀNG */}
//             <div className="mt-4">
//                 {order.isDelivered ? (
//                     <div className="bg-green-100 p-3 rounded text-green-800 border border-green-200">
//                         <p className="font-bold flex items-center gap-2"><FaCheckCircle /> Đã giao hàng</p>
//                         <p className="text-xs mt-1">{new Date(order.deliveredAt).toLocaleString('vi-VN')}</p>
//                         {order.trackingNumber && (
//                             <div className="mt-2 pt-2 border-t border-green-200 text-sm">
//                                 <FaBarcode className="inline"/> Vận đơn: <strong>{order.trackingNumber}</strong> ({order.carrier})
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="bg-yellow-50 p-3 rounded text-yellow-800 border border-yellow-200 flex items-center gap-2 font-bold text-sm">
//                         <FaTruck /> Chưa giao hàng
//                     </div>
//                 )}
//             </div>
//           </div>

//           {/* Sản phẩm */}
//           <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
//             <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
//                <FaBox className="text-orange-500"/> Sản phẩm
//             </h2>
//             <div className="divide-y">
//                 {order.orderItems.map((item, index) => (
//                   <div key={index} className="flex items-center py-3">
//                     <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded border" />
//                     <div className="ml-4 flex-1">
//                       <Link to={`/product/${item.product}`} className="text-sm font-bold text-slate-700 hover:text-blue-600">
//                         {item.name}
//                       </Link>
//                       <p className="text-xs text-slate-500">
//                         {item.qty} x {item.price.toLocaleString()}đ
//                       </p>
//                     </div>
//                     <span className="font-bold text-slate-800">{(item.qty * item.price).toLocaleString()}đ</span>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>

//         {/* --- CỘT PHẢI: THANH TOÁN & ADMIN ACTION --- */}
//         <div className="md:col-span-1">
//           <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-4">
//             <h2 className="text-xl font-black text-slate-800 mb-4 uppercase text-center border-b pb-4">
//                 Thanh toán
//             </h2>

//             {/* Chi tiết giá */}
//             <div className="space-y-3 text-sm text-slate-600 mb-6">
//                 <div className="flex justify-between">
//                     <span>Phương thức:</span>
//                     <span className="font-bold text-blue-600">{order.paymentMethod}</span>
//                 </div>
//                 <div className="flex justify-between">
//                     <span>Gói vận chuyển:</span>
//                     <span className="font-bold text-slate-800">{order.shippingMethod}</span>
//                 </div>
//                 <div className="flex justify-between">
//                     <span>Tiền hàng:</span>
//                     <span>{order.itemsPrice.toLocaleString()}đ</span>
//                 </div>
//                 <div className="flex justify-between">
//                     <span>Phí ship:</span>
//                     <span>{order.shippingPrice.toLocaleString()}đ</span>
//                 </div>
//                 <div className="border-t pt-3 flex justify-between text-xl font-black text-red-600">
//                     <span>Tổng cộng:</span>
//                     <span>{order.totalPrice.toLocaleString()}đ</span>
//                 </div>
//             </div>

//             {/* --- TRẠNG THÁI THANH TOÁN --- */}
//             {order.isPaid ? (
//                 <div className="bg-green-100 text-green-800 p-3 rounded font-bold text-center mb-4 flex items-center justify-center gap-2">
//                     <FaCheckCircle /> ĐÃ THANH TOÁN
//                 </div>
//             ) : (
//                 <div className="bg-red-50 text-red-600 p-3 rounded font-bold text-center mb-4 flex items-center justify-center gap-2 border border-red-100">
//                     <FaTimesCircle /> CHƯA THANH TOÁN
//                 </div>
//             )}

//             {/* --- NÚT PAYPAL (CHỈ HIỆN NẾU LÀ ONLINE & CHƯA TRẢ) --- */}
//             {!order.isPaid && order.paymentMethod === 'PayPal' && (
//                <div className="mb-4">
//                   {isPending ? (
//                       <div className="text-center text-sm italic">Tải PayPal...</div>
//                   ) : (
//                       <PayPalButtons 
//                         createOrder={(data, actions) => {
//                             return actions.order.create({ purchase_units: [{ amount: { value: order.totalPrice } }] });
//                         }}
//                         onApprove={onApprove}
//                       />
//                   )}
//                </div>
//             )}

//             {/* --- HƯỚNG DẪN COD (CHỈ HIỆN NẾU LÀ COD & CHƯA TRẢ) --- */}
//             {!order.isPaid && order.paymentMethod === 'COD' && (
//                 <div className="text-xs bg-slate-100 p-3 rounded text-center text-slate-500 italic mb-4">
//                    Vui lòng thanh toán tiền mặt cho shipper khi nhận hàng.
//                 </div>
//             )}

//             {/* =========================================================
//                 KHU VỰC ADMIN (QUẢN LÝ ĐƠN HÀNG)
//                ========================================================= */}
//             {userInfo && userInfo.isAdmin && (
//                 <div className="border-t-2 border-dashed border-slate-300 pt-6 mt-6">
//                     <p className="text-xs font-bold text-slate-500 uppercase mb-4 text-center bg-slate-100 py-1 rounded">
//                         Admin Control Panel
//                     </p>
                    
//                     {/* 1. XÁC NHẬN THANH TOÁN (Cho đơn COD) */}
//                     {!order.isPaid && (
//                         <button 
//                             onClick={markAsPaidHandler}
//                             className="w-full bg-green-600 text-white py-2 rounded mb-4 font-bold hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
//                         >
//                             <FaMoneyBillWave /> Xác nhận Đã nhận tiền
//                         </button>
//                     )}

//                     {/* 2. GIAO HÀNG & NHẬP VẬN ĐƠN (Hiện luôn, kể cả chưa trả tiền nếu là COD) */}
//                     {!order.isDelivered && (
//                         <div className="space-y-3 bg-slate-50 p-3 rounded border border-slate-200">
//                             <p className="font-bold text-sm text-slate-700">Cập nhật vận chuyển</p>
//                             <input 
//                                 type="text" 
//                                 placeholder="Mã vận đơn (VD: GHTK...)" 
//                                 className="w-full border p-2 rounded text-sm"
//                                 value={trackingNumber}
//                                 onChange={(e) => setTrackingNumber(e.target.value)}
//                             />
//                             <select 
//                                 className="w-full border p-2 rounded text-sm"
//                                 value={carrier}
//                                 onChange={(e) => setCarrier(e.target.value)}
//                             >
//                                 <option value="GHTK">Giao Hàng Tiết Kiệm</option>
//                                 <option value="GHN">Giao Hàng Nhanh</option>
//                                 <option value="Viettel">Viettel Post</option>
//                                 <option value="J&T">J&T Express</option>
//                             </select>
//                             <button 
//                                 onClick={deliverHandler}
//                                 className="w-full bg-slate-800 text-white py-2 rounded font-bold hover:bg-black text-sm flex items-center justify-center gap-2"
//                             >
//                                 <FaTruck /> Gửi hàng ngay
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}
            
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default OrderPage;
// frontend/src/pages/OrderPage.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import { 
    FaUser, FaMapMarkerAlt, FaEnvelope, FaBox, FaTruck, 
    FaCreditCard, FaCheckCircle, FaTimesCircle, FaBarcode, FaMoneyBillWave, FaMotorcycle, FaPhoneAlt 
} from 'react-icons/fa';

const OrderPage = () => {
  const { id } = useParams();
  const [sdkReady, setSdkReady] = useState(false);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // STATE ADMIN
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('GHTK'); 
  // 👇 THÊM STATE CHO SHIPPER
  const [shipperName, setShipperName] = useState('');
  const [shipperPhone, setShipperPhone] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`https://ecommerce-project-nodejs.onrender.com/api/orders/${id}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
  };

  useEffect(() => {
    if (!userInfo) {
        window.location.href = '/login';
        return;
    }
    
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('https://ecommerce-project-nodejs.onrender.com/api/config/paypal');
      paypalDispatch({
        type: 'resetOptions',
        value: { 'client-id': clientId, currency: 'USD' },
      });
      paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
    };

    if (!order || order._id !== id) {
       fetchOrder();
    } else {
       if (!order.isPaid && order.paymentMethod === 'PayPal') {
          if (!window.paypal) {
            addPayPalScript();
          } else {
            setSdkReady(true);
          }
       }
    }
  }, [id, order, paypalDispatch, userInfo]);


  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`https://ecommerce-project-nodejs.onrender.com/api/orders/${order._id}/pay`, details, config);
        alert("Thanh toán thành công!");
        fetchOrder();
      } catch (err) {
        alert(err.message);
      }
    });
  };

  const markAsPaidHandler = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`https://ecommerce-project-nodejs.onrender.com/api/orders/${order._id}/pay`, {}, config);
        alert("Đã cập nhật trạng thái: ĐÃ THANH TOÁN");
        fetchOrder();
      } catch (err) {
        alert(err.message);
      }
  };

  const deliverHandler = async () => {
    if (carrier !== 'GHN' && !trackingNumber) {
        return alert("Vui lòng nhập Mã vận đơn đối với hình thức giao hàng này!");
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(
        `https://ecommerce-project-nodejs.onrender.com/api/orders/${order._id}/deliver`,
        { trackingNumber, carrier, shipperName, shipperPhone }, // Gửi thêm data shipper
        config
      );
      alert("Đã cập nhật vận đơn & thông tin Shipper thành công!");
      fetchOrder();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-black text-slate-800 uppercase mb-2">Chi tiết đơn hàng</h1>
      <p className="text-slate-500 font-mono text-sm mb-8">Order ID: #{order._id}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI --- */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
               <FaUser className="text-blue-500"/> Người nhận
            </h2>
            <div className="text-slate-700 text-sm space-y-1">
                <p><span className="font-bold">Tên:</span> {order.user?.name}</p>
                <p><span className="font-bold">Email:</span> {order.user?.email}</p>
                <p><span className="font-bold">Địa chỉ:</span> {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
            </div>
            
            <div className="mt-4">
                {order.isDelivered ? (
                    <div>
                        <div className="bg-green-100 p-3 rounded text-green-800 border border-green-200 mb-3">
                            <p className="font-bold flex items-center gap-2"><FaCheckCircle /> Đã gửi hàng cho đơn vị vận chuyển</p>
                            <p className="text-xs mt-1">Cập nhật lúc: {new Date(order.deliveredAt).toLocaleString('vi-VN')}</p>
                            {order.trackingNumber && (
                                <div className="mt-2 pt-2 border-t border-green-200 text-sm">
                                    <FaBarcode className="inline"/> Vận đơn: <strong>{order.trackingNumber}</strong> ({order.carrier})
                                </div>
                            )}
                        </div>

                        {/* HIỂN THỊ THÔNG TIN SHIPPER CHO KHÁCH HÀNG */}
                        {(order.shipperName || order.shipperPhone) && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl">
                                    <FaMotorcycle />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Thông tin Shipper</p>
                                    <p className="text-sm font-bold text-slate-800">{order.shipperName || 'Tài xế giao hàng'}</p>
                                    <p className="text-sm font-mono text-slate-600 flex items-center gap-1 mt-1">
                                        <FaPhoneAlt className="text-xs" /> {order.shipperPhone || 'Đang cập nhật...'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-yellow-50 p-3 rounded text-yellow-800 border border-yellow-200 flex items-center gap-2 font-bold text-sm">
                        <FaTruck /> Chưa giao hàng
                    </div>
                )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
               <FaBox className="text-orange-500"/> Sản phẩm
            </h2>
            <div className="divide-y">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center py-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded border" />
                    <div className="ml-4 flex-1">
                      <Link to={`/product/${item.product}`} className="text-sm font-bold text-slate-700 hover:text-blue-600">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {item.qty} x {(item.price || 0).toLocaleString()}đ
                      </p>
                    </div>
                    <span className="font-bold text-slate-800">{((item.qty * item.price) || 0).toLocaleString()}đ</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI: THANH TOÁN & ADMIN ACTION --- */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-4">
            <h2 className="text-xl font-black text-slate-800 mb-4 uppercase text-center border-b pb-4">
                Thanh toán
            </h2>

            <div className="space-y-3 text-sm text-slate-600 mb-6">
                <div className="flex justify-between">
                    <span>Phương thức:</span>
                    <span className="font-bold text-blue-600">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                    <span>Gói vận chuyển:</span>
                    <span className="font-bold text-slate-800">{order.shippingMethod || 'Tiêu chuẩn'}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tiền hàng:</span>
                    <span>{(order.itemsPrice || 0).toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                    <span>Phí ship:</span>
                    <span>{(order.shippingPrice || 0).toLocaleString()}đ</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-black text-red-600">
                    <span>Tổng cộng:</span>
                    <span>{(order.totalPrice || 0).toLocaleString()}đ</span>
                </div>
            </div>

            {order.isPaid ? (
                <div className="bg-green-100 text-green-800 p-3 rounded font-bold text-center mb-4 flex items-center justify-center gap-2">
                    <FaCheckCircle /> ĐÃ THANH TOÁN
                </div>
            ) : (
                <div className="bg-red-50 text-red-600 p-3 rounded font-bold text-center mb-4 flex items-center justify-center gap-2 border border-red-100">
                    <FaTimesCircle /> CHƯA THANH TOÁN
                </div>
            )}

            {!order.isPaid && order.paymentMethod === 'PayPal' && (
               <div className="mb-4">
                  {isPending ? (
                      <div className="text-center text-sm italic">Tải PayPal...</div>
                  ) : (
                      <PayPalButtons 
                        createOrder={(data, actions) => {
                            return actions.order.create({ purchase_units: [{ amount: { value: order.totalPrice } }] });
                        }}
                        onApprove={onApprove}
                      />
                  )}
               </div>
            )}

            {!order.isPaid && order.paymentMethod === 'COD' && (
                <div className="text-xs bg-slate-100 p-3 rounded text-center text-slate-500 italic mb-4">
                   Vui lòng thanh toán tiền mặt cho shipper khi nhận hàng.
                </div>
            )}

            {userInfo && userInfo.isAdmin && (
                <div className="border-t-2 border-dashed border-slate-300 pt-6 mt-6">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-4 text-center bg-slate-100 py-1 rounded">
                        Admin Control Panel
                    </p>
                    
                    {!order.isPaid && (
                        <button 
                            onClick={markAsPaidHandler}
                            className="w-full bg-green-600 text-white py-2 rounded mb-4 font-bold hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
                        >
                            <FaMoneyBillWave /> Xác nhận Đã nhận tiền
                        </button>
                    )}

                    {!order.isDelivered && (
                        <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <p className="font-bold text-sm text-slate-800 border-b pb-2 mb-2">Cập nhật vận chuyển & Shipper</p>
                            
                            <select 
                                className="w-full border p-2 rounded text-sm bg-white"
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                            >
                                <option value="GHTK">Giao Hàng Tiết Kiệm (GHTK)</option>
                                <option value="GHN">Giao Hàng Nhanh (GHN)</option>
                                <option value="Viettel">Viettel Post</option>
                                <option value="J&T">J&T Express</option>
                                <option value="SHOP">Tự giao hàng (Shipper của Shop)</option>
                            </select>

                            <input 
                                type="text" 
                                placeholder="Mã vận đơn (VD: GHTK...)" 
                                className="w-full border p-2 rounded text-sm bg-white"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                            />

                            {/* Ô nhập thông tin Shipper */}
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <input 
                                    type="text" 
                                    placeholder="Tên tài xế..." 
                                    className="w-full border p-2 rounded text-sm bg-white"
                                    value={shipperName}
                                    onChange={(e) => setShipperName(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="SĐT tài xế..." 
                                    className="w-full border p-2 rounded text-sm bg-white"
                                    value={shipperPhone}
                                    onChange={(e) => setShipperPhone(e.target.value)}
                                />
                            </div>

                            <button 
                                onClick={deliverHandler}
                                className="w-full bg-slate-800 text-white py-2 mt-2 rounded font-bold hover:bg-black text-sm flex items-center justify-center gap-2 shadow-md"
                            >
                                <FaMotorcycle /> Xác nhận Gửi hàng
                            </button>
                        </div>
                    )}
                </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderPage;