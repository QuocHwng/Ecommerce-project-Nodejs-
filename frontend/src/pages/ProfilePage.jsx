import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Lấy thông tin User hiện tại
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
      
      // CHỈ TẢI ĐƠN HÀNG NẾU KHÔNG PHẢI ADMIN
      if (!userInfo.isAdmin) {
          fetchMyOrders();
      }
    }
  }, [navigate]);

  const fetchMyOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Mật khẩu không khớp');
    } else {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.put(
          'http://localhost:5000/api/users/profile',
          { name, email, password },
          config
        );
        localStorage.setItem('userInfo', JSON.stringify(data));
        setMessage('Cập nhật thành công!');
        // Reload nhẹ để cập nhật Header
        setTimeout(() => window.location.reload(), 500);
      } catch (error) {
        setMessage(error.response?.data?.message || error.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      
      {/* --- GIAO DIỆN RIÊNG CHO ADMIN --- */}
      {userInfo && userInfo.isAdmin ? (
         <div className="max-w-2xl mx-auto">
             <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center gap-4 mb-6 border-b pb-4">
                    <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-black">
                        {userInfo.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 uppercase">Hồ sơ Quản trị viên</h1>
                        <p className="text-slate-500 text-sm">Quản lý thông tin đăng nhập của bạn</p>
                    </div>
                </div>

                {message && <div className={`p-3 rounded mb-4 font-bold text-center ${message.includes('thành công') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Tên hiển thị</label>
                        <input type="text" className="w-full p-3 border rounded bg-slate-50" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Email</label>
                        <input type="email" className="w-full p-3 border rounded bg-slate-50" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Mật khẩu mới</label>
                        <input type="password" className="w-full p-3 border rounded" placeholder="Để trống nếu không đổi" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="block font-bold text-slate-700 mb-1">Nhập lại mật khẩu</label>
                        <input type="password" className="w-full p-3 border rounded" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-black transition">
                        CẬP NHẬT HỒ SƠ
                    </button>
                </form>
             </div>
         </div>
      ) : (
        
      /* --- GIAO DIỆN RIÊNG CHO KHÁCH HÀNG (CÓ ĐƠN HÀNG) --- */
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Cột Trái: Form thông tin */}
        <div className="md:col-span-1">
            <h2 className="text-2xl font-black text-slate-800 uppercase mb-6">Thông tin cá nhân</h2>
            {message && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-sm font-bold">{message}</div>}
            
            <form onSubmit={submitHandler} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                <div>
                    <label className="block font-bold text-slate-700 text-sm mb-1">Tên hiển thị</label>
                    <input type="text" className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label className="block font-bold text-slate-700 text-sm mb-1">Email</label>
                    <input type="email" className="w-full p-2 border rounded bg-slate-100 text-slate-500" value={email} disabled />
                </div>
                <div>
                    <label className="block font-bold text-slate-700 text-sm mb-1">Mật khẩu mới</label>
                    <input type="password" className="w-full p-2 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label className="block font-bold text-slate-700 text-sm mb-1">Xác nhận mật khẩu</label>
                    <input type="password" className="w-full p-2 border rounded" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                    Cập nhật
                </button>
            </form>
        </div>

        {/* Cột Phải: Lịch sử đơn hàng (Chỉ khách mới thấy) */}
        <div className="md:col-span-2">
            <h2 className="text-2xl font-black text-slate-800 uppercase mb-6">Lịch sử mua hàng</h2>
            {orders.length === 0 ? (
                <div className="bg-blue-50 text-blue-600 p-4 rounded border border-blue-100">
                    Bạn chưa mua đơn hàng nào. <a href="/" className="font-bold underline">Mua sắm ngay!</a>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-800 text-white uppercase">
                            <tr>
                                <th className="p-3">Mã đơn</th>
                                <th className="p-3">Ngày mua</th>
                                <th className="p-3">Tổng tiền</th>
                                <th className="p-3">Thanh toán</th>
                                <th className="p-3">Giao hàng</th>
                                <th className="p-3">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="p-3 font-mono text-slate-500">{order._id.substring(0,10)}...</td>
                                    <td className="p-3">{order.createdAt.substring(0,10)}</td>
                                    <td className="p-3 font-bold">{order.totalPrice.toLocaleString()}đ</td>
                                    <td className="p-3">
                                        {order.isPaid ? <span className="text-green-600 font-bold">Đã thanh toán</span> : <span className="text-red-600">Chưa</span>}
                                    </td>
                                    <td className="p-3">
                                        {order.isDelivered ? <span className="text-green-600 font-bold">Đã vận chuyển</span> : <span className="text-red-600">Chưa</span>}
                                    </td>
                                    <td className="p-3">
                                        <a href={`/order/${order._id}`} className="text-blue-600 hover:underline font-bold">Xem</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

      </div>
      )}

    </div>
  );
};

export default ProfilePage;