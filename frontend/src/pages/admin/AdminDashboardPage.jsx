// frontend/src/pages/admin/AdminDashboardPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBox, FaClipboardList, FaUsers, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const AdminDashboardPage = () => {
  const [summary, setSummary] = useState({
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      dailyOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            
            const { data } = await axios.get('http://localhost:5000/api/dashboard/summary', config);
            setSummary(data);
            setLoading(false);
        } catch (error) {
            console.error("Lỗi lấy thống kê:", error);
            setLoading(false);
        }
    };
    fetchSummary();
  }, []);

  if (loading) return <div className="p-10 text-center">Đang tải dữ liệu thống kê...</div>;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-800 uppercase mb-8 border-l-4 border-blue-600 pl-4">
          Tổng quan hệ thống
      </h1>

      {/* 4 CARD THỐNG KÊ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex items-center gap-4">
              <div className="p-4 bg-orange-100 text-orange-600 rounded-full text-2xl">
                  <FaBox />
              </div>
              <div>
                  <p className="text-slate-500 text-sm font-bold uppercase">Sản phẩm</p>
                  <p className="text-2xl font-black text-slate-800">{summary.totalProducts}</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex items-center gap-4">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-full text-2xl">
                  <FaClipboardList />
              </div>
              <div>
                  <p className="text-slate-500 text-sm font-bold uppercase">Đơn hàng</p>
                  <p className="text-2xl font-black text-slate-800">{summary.totalOrders}</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex items-center gap-4">
              <div className="p-4 bg-purple-100 text-purple-600 rounded-full text-2xl">
                  <FaUsers />
              </div>
              <div>
                  <p className="text-slate-500 text-sm font-bold uppercase">Thành viên</p>
                  <p className="text-2xl font-black text-slate-800">{summary.totalUsers}</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border border-slate-100 flex items-center gap-4">
              <div className="p-4 bg-green-100 text-green-600 rounded-full text-2xl">
                  <FaMoneyBillWave />
              </div>
              <div>
                  <p className="text-slate-500 text-sm font-bold uppercase">Doanh thu</p>
                  <p className="text-2xl font-black text-green-600">
                      {summary.totalRevenue.toLocaleString()}đ
                  </p>
              </div>
          </div>

      </div>

      {/* BIỂU ĐỒ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Biểu đồ Doanh thu */}
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                  <FaChartLine /> Biểu đồ Doanh thu (7 ngày qua)
              </h3>
              <div className="h-80 w-full">
                {summary.dailyOrders.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 italic">Chưa có dữ liệu đơn hàng</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={summary.dailyOrders}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" style={{ fontSize: '12px' }}/>
                            <YAxis style={{ fontSize: '12px' }} tickFormatter={(value) => value.toLocaleString()} />
                            <Tooltip formatter={(value) => value.toLocaleString() + 'đ'} />
                            <Area type="monotone" dataKey="sales" stroke="#16a34a" fillOpacity={1} fill="url(#colorSales)" name="Doanh thu" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
              </div>
          </div>

          {/* Biểu đồ Số lượng đơn */}
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-6 flex items-center gap-2">
                  <FaClipboardList /> Số lượng đơn hàng (7 ngày qua)
              </h3>
              <div className="h-80 w-full">
                {summary.dailyOrders.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 italic">Chưa có dữ liệu đơn hàng</div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={summary.dailyOrders}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" style={{ fontSize: '12px' }}/>
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="orders" fill="#3b82f6" name="Đơn hàng" barSize={40} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
              </div>
          </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;