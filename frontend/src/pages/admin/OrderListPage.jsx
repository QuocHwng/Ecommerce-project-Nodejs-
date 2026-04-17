// frontend/src/pages/admin/OrderListPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTimes, FaCheck } from 'react-icons/fa';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.isAdmin) {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          const { data } = await axios.get('https://ecommerce-project-nodejs.onrender.com/api/orders', config);
          setOrders(data);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [navigate]);

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-800 uppercase mb-6 border-l-4 border-blue-600 pl-4">
        Quản lý Đơn hàng
      </h1>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white uppercase text-sm">
            <tr>
              <th className="p-4">ID Đơn</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Ngày đặt</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4 text-center">Thanh toán</th>
              <th className="p-4 text-center">Giao hàng</th>
              <th className="p-4 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 text-sm">
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4 font-mono text-xs text-slate-500">{order._id}</td>
                <td className="p-4 font-bold">{order.user && order.user.name}</td>
                <td className="p-4">{order.createdAt.substring(0, 10)}</td>
                <td className="p-4 font-bold">{order.totalPrice.toLocaleString()}đ</td>
                
                {/* Trạng thái Thanh toán */}
                <td className="p-4 text-center">
                  {order.isPaid ? (
                    <span className="text-green-600 font-bold">{order.paidAt.substring(0, 10)}</span>
                  ) : (
                    <FaTimes className="text-red-500 mx-auto" />
                  )}
                </td>

                {/* Trạng thái Giao hàng */}
                <td className="p-4 text-center">
                  {order.isDelivered ? (
                    <span className="text-green-600 font-bold">{order.deliveredAt.substring(0, 10)}</span>
                  ) : (
                    <FaTimes className="text-red-500 mx-auto" />
                  )}
                </td>

                <td className="p-4 text-center">
                  <Link to={`/admin/order/${order._id}`} className="bg-slate-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition font-bold text-xs">
                    Xem
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListPage;