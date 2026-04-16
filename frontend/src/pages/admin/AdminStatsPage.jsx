// frontend/src/pages/admin/AdminStatsPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartPie } from 'react-icons/fa';

const AdminStatsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Màu sắc cho biểu đồ tròn
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.get('http://localhost:5000/api/stats', config);
            setData(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center">Đang tải biểu đồ...</div>;
  if (!data) return <div className="p-10 text-center">Không có dữ liệu</div>;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-800 uppercase mb-8 border-l-4 border-purple-600 pl-4">
          Báo cáo & Thống kê
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 1. BIỂU ĐỒ TRÒN: CƠ CẤU DANH MỤC */}
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <FaChartPie className="text-blue-500"/> Phân bố sản phẩm theo Danh mục
              </h3>
              <div className="h-80 w-full flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.categoryStats}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="_id"
                        >
                            {data.categoryStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* 2. BIỂU ĐỒ TRÒN: TRẠNG THÁI ĐƠN HÀNG */}
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <FaChartPie className="text-green-500"/> Tỉ lệ thanh toán đơn hàng
              </h3>
              <div className="h-80 w-full flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data.orderStatusStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={60} // Biểu đồ vành khuyên (Donut)
                            outerRadius={100}
                            fill="#82ca9d"
                            paddingAngle={5}
                            dataKey="count"
                            nameKey="_id"
                        >
                            {data.orderStatusStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry._id === 'Đã thanh toán' ? '#22c55e' : '#f59e0b'} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* 3. BIỂU ĐỒ CỘT: HOẠT ĐỘNG NHẬP XUẤT */}
          <div className="bg-white p-6 rounded-xl shadow border border-slate-200 lg:col-span-2">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <FaChartPie className="text-red-500"/> Tần suất Nhập kho vs Xuất kho
              </h3>
              <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.ioStats} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100}/>
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" name="Số lượng phiếu" fill="#8884d8" barSize={40} label={{ position: 'right' }}>
                                <Cell fill="#16a34a" /> {/* Nhập - Xanh */}
                                <Cell fill="#dc2626" /> {/* Xuất - Đỏ */}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

      </div>
    </div>
  );
};

export default AdminStatsPage;