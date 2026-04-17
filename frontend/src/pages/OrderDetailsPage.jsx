// frontend/src/pages/OrderDetailsPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho Modal hủy đơn
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Danh sách lý do mẫu để người dùng chọn
  const reasons = [
    "Muốn thay đổi địa chỉ nhận hàng",
    "Muốn thay đổi sản phẩm trong đơn (kích thước, màu sắc...)",
    "Thủ tục thanh toán rắc rối",
    "Tìm thấy giá rẻ hơn ở nơi khác",
    "Đổi ý, không muốn mua nữa",
    "Khác"
  ];

  // Hàm tải dữ liệu đơn hàng
  const fetchOrder = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.get(`https://ecommerce-project-nodejs.onrender.com/api/orders/${id}`, config);
      setOrder(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Hàm XÁC NHẬN HỦY (Gọi API)
  const confirmCancelHandler = async () => {
    if (!cancelReason) {
        alert("Vui lòng chọn lý do bạn muốn hủy đơn!");
        return;
    }

    if(window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            
            // Gửi request PUT kèm lý do hủy
            await axios.put(
                `https://ecommerce-project-nodejs.onrender.com/api/orders/${id}/cancel`, 
                { reason: cancelReason }, 
                config
            );
            
            alert("Đã hủy đơn hàng thành công!");
            setShowCancelModal(false); // Đóng modal
            fetchOrder(); // Load lại trang để cập nhật trạng thái
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || error.message));
        }
    }
  }

  // --- GIAO DIỆN ---
  if (loading) return <div className="text-center py-10 font-bold text-slate-500">Đang tải thông tin đơn hàng...</div>;
  if (!order) return <div className="text-center py-10 text-red-500">Không tìm thấy đơn hàng hoặc đơn hàng không tồn tại.</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 relative">
      <Link to="/profile" className="text-slate-500 hover:text-slate-800 mb-4 inline-block font-bold">&larr; Quay lại danh sách</Link>
      
      {/* 1. HEADER: MÃ ĐƠN & TRẠNG THÁI CHUNG */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-black uppercase text-slate-800">
                Đơn hàng #{order._id.substring(0, 8)}
            </h1>
            <span className="text-sm text-slate-500">Ngày đặt: {order.createdAt.substring(0, 10)}</span>
        </div>
        
        <div className="text-right">
            {order.isCancelled ? (
                <div className="text-right">
                    <span className="bg-red-100 text-red-600 font-bold px-4 py-2 rounded-full border border-red-200 uppercase inline-block mb-1">
                        ❌ ĐÃ HỦY
                    </span>
                    <p className="text-sm text-slate-500 italic">Lý do: {order.cancellationReason || 'Không rõ'}</p>
                </div>
            ) : order.isDelivered ? (
                <span className="bg-green-100 text-green-600 font-bold px-4 py-2 rounded-full border border-green-200 uppercase">
                    ✅ GIAO THÀNH CÔNG
                </span>
            ) : (
                <span className="bg-yellow-100 text-yellow-700 font-bold px-4 py-2 rounded-full border border-yellow-200 uppercase">
                    🚚 ĐANG XỬ LÝ / VẬN CHUYỂN
                </span>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* === CỘT TRÁI: TIMELINE & SẢN PHẨM === */}
        <div className="md:col-span-2 space-y-6">
            
            {/* TIMELINE (Chỉ hiện nếu chưa hủy) */}
            {!order.isCancelled && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex justify-between items-center text-center relative overflow-hidden shadow-sm">
                    {/* Bước 1 */}
                    <div className={`z-10 relative ${order.createdAt ? 'text-blue-700' : 'text-slate-400'}`}>
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold shadow-lg border-2 border-white">1</div>
                        <p className="text-xs font-bold uppercase tracking-wider">Đã đặt</p>
                    </div>
                    
                    {/* Đường kẻ nối */}
                    <div className="h-1 bg-blue-200 absolute top-10 left-0 w-full z-0 transform -translate-y-1/2"></div>

                    {/* Bước 2 */}
                    <div className={`z-10 relative ${order.isPaid ? 'text-blue-700' : 'text-slate-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold shadow-lg border-2 border-white transition-colors ${order.isPaid ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-500'}`}>2</div>
                        <p className="text-xs font-bold uppercase tracking-wider">Thanh toán</p>
                    </div>

                    {/* Bước 3 */}
                    <div className={`z-10 relative ${order.isDelivered ? 'text-blue-700' : 'text-slate-400'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold shadow-lg border-2 border-white transition-colors ${order.isDelivered ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-500'}`}>3</div>
                        <p className="text-xs font-bold uppercase tracking-wider">Đã giao</p>
                    </div>
                </div>
            )}

            {/* DANH SÁCH SẢN PHẨM */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200">
                    <h2 className="text-lg font-bold text-slate-700 uppercase">Sản phẩm trong đơn</h2>
                </div>
                <div className="p-4">
                    {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b border-dashed border-slate-200 last:border-0 py-4">
                            <div className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                                <div>
                                    <Link to={`/product/${item.product}`} className="font-bold text-slate-700 hover:text-blue-600 text-lg block mb-1">
                                        {item.name}
                                    </Link>
                                    <p className="text-sm text-slate-500 font-medium bg-slate-100 inline-block px-2 py-1 rounded">x {item.qty}</p>
                                </div>
                            </div>
                            <p className="font-bold text-slate-700 text-lg">{(item.price * item.qty).toLocaleString()}đ</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* === CỘT PHẢI: THÔNG TIN & HÀNH ĐỘNG === */}
        <div className="space-y-6">
            
            {/* ĐỊA CHỈ */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-700 uppercase text-sm mb-4 border-b pb-2">Địa chỉ nhận hàng</h3>
                <p className="font-bold text-lg text-slate-800 mb-1">{order.user?.name}</p>
                <p className="text-slate-600 mb-1">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                <p className="text-slate-600">SĐT: <span className="font-mono font-bold">{order.shippingAddress.postalCode}</span></p>
            </div>

            {/* TỔNG TIỀN & THANH TOÁN */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-700 uppercase text-sm mb-4 border-b pb-2">Tổng quan thanh toán</h3>
                <div className="flex justify-between mb-2 text-slate-600"><span>Tiền hàng:</span> <span>{order.itemsPrice?.toLocaleString()}đ</span></div>
                <div className="flex justify-between mb-2 text-slate-600"><span>Phí vận chuyển:</span> <span>{order.shippingPrice?.toLocaleString()}đ</span></div>
                <div className="flex justify-between font-black text-2xl text-red-600 mt-4 border-t border-dashed pt-4">
                    <span>Tổng cộng:</span> 
                    <span>{order.totalPrice?.toLocaleString()}đ</span>
                </div>
                
                <div className="mt-6 space-y-3">
                    {/* Nút Thanh toán (Nếu chưa trả & chưa hủy) */}
                    {!order.isPaid && !order.isCancelled && (
                         <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5">
                             💳 Thanh toán ngay (VNPay)
                         </button>
                    )}
                    
                    {/* Nút HỦY ĐƠN (Mở Modal) */}
                    {!order.isDelivered && !order.isCancelled && (
                         <button 
                            onClick={() => setShowCancelModal(true)}
                            className="w-full bg-white text-red-500 py-3 rounded-lg font-bold hover:bg-red-50 border border-red-200 transition"
                        >
                             Hủy đơn hàng
                         </button>
                    )}
                </div>
            </div>
        </div>

      </div>

      {/* --- MODAL (POPUP) CHỌN LÝ DO HỦY --- */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in px-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full transform transition-all scale-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Xác nhận hủy đơn</h3>
                    <button onClick={() => setShowCancelModal(false)} className="text-slate-400 hover:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <p className="mb-4 text-slate-600 text-sm">Chúng tôi rất tiếc khi bạn muốn hủy đơn. Vui lòng cho biết lý do để chúng tôi cải thiện dịch vụ:</p>
                
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                    {reasons.map((r, index) => (
                        <label key={index} className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${cancelReason === r ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                            <input 
                                type="radio" 
                                name="cancelReason" 
                                value={r} 
                                checked={cancelReason === r}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                            />
                            <span className="ml-3 text-sm font-medium text-slate-700">{r}</span>
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button 
                        onClick={() => setShowCancelModal(false)}
                        className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-bold text-sm transition"
                    >
                        Đóng
                    </button>
                    <button 
                        onClick={confirmCancelHandler}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-sm shadow-md shadow-red-200 transition"
                    >
                        Xác nhận Hủy
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default OrderDetailsPage;