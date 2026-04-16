import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OrderStatsPage = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        // Gọi API thống kê mới tạo
        const { data } = await axios.get('http://localhost:5000/api/orders/stats', config);
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-slate-800 uppercase border-l-4 border-blue-600 pl-4 mb-8">
        Báo cáo Doanh thu (30 ngày qua)
      </h1>

      <div className="grid grid-cols-1 gap-8">
        
        {/* BIỂU ĐỒ CỘT DOANH THU */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Biểu đồ Doanh thu (VNĐ)
          </h3>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                <Legend />
                <Bar dataKey="sales" name="Doanh thu" fill="#3b82f6" barSize={50} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BẢNG CHI TIẾT DƯỚI BIỂU ĐỒ */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b">
                <h3 className="font-bold text-slate-700">Chi tiết theo ngày</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-white border-b text-slate-500 text-sm uppercase">
                    <tr>
                        <th className="p-4">Ngày</th>
                        <th className="p-4 text-center">Số đơn hàng</th>
                        <th className="p-4 text-right">Doanh thu</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-slate-50">
                            <td className="p-4 font-bold text-slate-700">{item.date}</td>
                            <td className="p-4 text-center">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-bold text-xs">{item.orders} đơn</span>
                            </td>
                            <td className="p-4 text-right font-bold text-blue-600">
                                {item.sales.toLocaleString()}đ
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
};

export default OrderStatsPage;