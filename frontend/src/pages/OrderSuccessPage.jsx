// // frontend/src/pages/OrderSuccessPage.jsx
// import { useEffect, useState } from 'react';
// import { Link, useSearchParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { FaCheckCircle, FaTimesCircle, FaArrowRight, FaShoppingBag, FaSpinner } from 'react-icons/fa';

// const OrderSuccessPage = () => {
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();
    
//     // Lấy các tham số từ URL
//     const orderId = searchParams.get('id');
//     const vnp_ResponseCode = searchParams.get('vnp_ResponseCode'); // Mã trả về từ VNPAY

//     const [loading, setLoading] = useState(true);
//     const [isSuccess, setIsSuccess] = useState(false);
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         // TRƯỜNG HỢP 1: Đơn hàng COD hoặc PayPal (Chỉ có ID, không có mã VNPAY)
//         if (orderId && !vnp_ResponseCode) {
//             setIsSuccess(true);
//             setLoading(false);
//             return;
//         }

//         // TRƯỜNG HỢP 2: Thanh toán VNPAY trả về
//         if (vnp_ResponseCode) {
//             const verifyPayment = async () => {
//                 try {
//                     // Nếu mã = 00 là thành công
//                     if (vnp_ResponseCode === '00') {
//                         setIsSuccess(true);
//                         // Gọi API cập nhật trạng thái đã thanh toán (nếu cần thiết)
//                         // await axios.put(...) 
//                         // Tuy nhiên, logic chuẩn là Backend tự xử lý IPN, Frontend chỉ hiện thông báo
//                     } else {
//                         setIsSuccess(false);
//                         setMessage('Giao dịch thất bại hoặc bị hủy.');
//                     }
//                 } catch (error) {
//                     console.error(error);
//                     setIsSuccess(false);
//                     setMessage('Có lỗi khi xác minh thanh toán.');
//                 } finally {
//                     setLoading(false);
//                 }
//             };
//             verifyPayment();
//         } else {
//             // Không có ID cũng không có mã VNPAY -> Chuyển về trang chủ
//             navigate('/'); 
//         }

//     }, [orderId, vnp_ResponseCode, navigate]);

//     // --- GIAO DIỆN LOADING ---
//     if (loading) return (
//         <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
//             <FaSpinner className="animate-spin text-4xl mb-4 text-blue-600" />
//             <p>Đang xử lý kết quả...</p>
//         </div>
//     );

//     // --- GIAO DIỆN THẤT BẠI ---
//     if (!isSuccess) return (
//         <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
//             <FaTimesCircle className="text-red-500 text-6xl mb-6 shadow-red-200 drop-shadow-xl" />
//             <h1 className="text-3xl font-black text-slate-800 uppercase mb-2">Thanh toán thất bại</h1>
//             <p className="text-slate-500 mb-8">{message}</p>
//             <div className="flex gap-4">
//                  <Link to="/placeorder" className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-slate-800">
//                     Thử lại
//                 </Link>
//                 <Link to="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">
//                     Về trang chủ
//                 </Link>
//             </div>
//         </div>
//     );

//     // --- GIAO DIỆN THÀNH CÔNG (COD & VNPAY OK) ---
//     return (
//         <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
//             <FaCheckCircle className="text-green-500 text-6xl mb-6 shadow-green-200 drop-shadow-xl animate-bounce" />
            
//             <h1 className="text-3xl font-black text-slate-800 uppercase mb-2">Đặt hàng thành công!</h1>
//             <p className="text-slate-500 mb-8 max-w-md">
//                 Cảm ơn bạn đã mua sắm tại Quốc Hưng Shop.<br/>
//                 Đơn hàng {vnp_ResponseCode && <span className="font-bold text-blue-600">(Đã thanh toán)</span>} của bạn đang chờ xử lý.
//             </p>

//             <div className="flex gap-4">
//                 <Link to="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 flex items-center gap-2">
//                     <FaShoppingBag /> Tiếp tục mua sắm
//                 </Link>
                
//                 {/* Chỉ hiện nút xem đơn hàng nếu có ID (Trường hợp VNPAY trả về có thể cần lấy ID từ context khác nếu URL ko có) */}
//                 {orderId ? (
//                     <Link to={`/order/${orderId}`} className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-slate-800 flex items-center gap-2 shadow-lg shadow-slate-300">
//                         Xem chi tiết đơn hàng <FaArrowRight />
//                     </Link>
//                 ) : (
//                     <Link to="/profile" className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-slate-800">
//                         Xem lịch sử đơn hàng
//                     </Link>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default OrderSuccessPage;
// frontend/src/pages/OrderSuccessPage.jsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaArrowRight, FaShoppingBag, FaSpinner } from 'react-icons/fa';

const OrderSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Lấy ID đơn hàng. Nếu là VNPAY trả về thì nó nằm ở biến vnp_TxnRef
    const orderId = searchParams.get('id') || searchParams.get('vnp_TxnRef');
    const vnp_ResponseCode = searchParams.get('vnp_ResponseCode'); 

    const [loading, setLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const updateOrderStatus = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if (!userInfo) {
                    navigate('/login');
                    return;
                }

                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

                // TRƯỜNG HỢP 1: THANH TOÁN VNPAY
                if (vnp_ResponseCode) {
                    // Mã 00 nghĩa là giao dịch thành công tại ngân hàng
                    if (vnp_ResponseCode === '00') {
                        // Gọi API để cập nhật trạng thái đơn hàng thành "Đã thanh toán"
                        await axios.put(`https://ecommerce-project-nodejs.onrender.com/api/orders/${orderId}/pay`, {
                            id: searchParams.get('vnp_TransactionNo'),
                            status: 'COMPLETED_VNPAY',
                            update_time: searchParams.get('vnp_PayDate'),
                            email_address: userInfo.email
                        }, config);

                        setIsSuccess(true);
                    } else {
                        // Khách hàng hủy giao dịch hoặc thanh toán thất bại
                        setIsSuccess(false);
                        setMessage('Giao dịch thanh toán bị hủy hoặc không thành công.');
                    }
                } 
                // TRƯỜNG HỢP 2: ĐƠN HÀNG COD (Không có vnp_ResponseCode)
                else if (orderId) {
                    setIsSuccess(true);
                } 
                else {
                    // Tránh trường hợp người dùng gõ link bậy
                    navigate('/');
                }
            } catch (error) {
                console.error("Lỗi cập nhật trạng thái thanh toán:", error);
                setIsSuccess(false);
                setMessage('Có lỗi xảy ra khi xác nhận đơn hàng của bạn.');
            } finally {
                setLoading(false);
            }
        };

        updateOrderStatus();

    }, [orderId, vnp_ResponseCode, navigate, searchParams]);

    // --- GIAO DIỆN LOADING ---
    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
            <FaSpinner className="animate-spin text-4xl mb-4 text-blue-600" />
            <p>Đang xử lý kết quả giao dịch...</p>
        </div>
    );

    // --- GIAO DIỆN THẤT BẠI ---
    if (!isSuccess) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <FaTimesCircle className="text-red-500 text-6xl mb-6 shadow-red-200 drop-shadow-xl" />
            <h1 className="text-3xl font-black text-slate-800 uppercase mb-2">Đặt hàng thất bại</h1>
            <p className="text-slate-500 mb-8">{message}</p>
            <div className="flex gap-4">
                 <Link to="/placeorder" className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-slate-800">
                    Thử lại
                </Link>
                <Link to="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">
                    Về trang chủ
                </Link>
            </div>
        </div>
    );

    // --- GIAO DIỆN THÀNH CÔNG (VNPAY & COD) ---
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <FaCheckCircle className="text-green-500 text-6xl mb-6 shadow-green-200 drop-shadow-xl animate-bounce" />
            
            <h1 className="text-3xl font-black text-slate-800 uppercase mb-2">Đặt hàng thành công!</h1>
            <p className="text-slate-500 mb-8 max-w-md">
                Cảm ơn bạn đã mua sắm tại Quốc Hưng Shop.<br/>
                Đơn hàng {vnp_ResponseCode && <span className="font-bold text-blue-600">(Đã thanh toán qua VNPAY)</span>} của bạn đã được ghi nhận.
            </p>

            <div className="flex gap-4">
                <Link to="/" className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 flex items-center gap-2">
                    <FaShoppingBag /> Tiếp tục mua sắm
                </Link>
                
                {orderId ? (
                    <Link to={`/order/${orderId}`} className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-slate-800 flex items-center gap-2 shadow-lg shadow-slate-300">
                        Xem chi tiết đơn hàng <FaArrowRight />
                    </Link>
                ) : (
                    <Link to="/profile" className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-slate-800">
                        Xem lịch sử đơn hàng
                    </Link>
                )}
            </div>
        </div>
    );
};

export default OrderSuccessPage;