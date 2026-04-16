import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OrderStatusPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/orders/status-stats', config);
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-slate-800 uppercase border-l-4 border-blue-600 pl-4 mb-8">
        Phân tích Đơn hàng
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Biểu đồ tròn */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold text-slate-700 mb-4">Tỉ lệ trạng thái đơn hàng</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} đơn`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Bảng chú thích chi tiết */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
              <h3 className="text-xl font-bold text-slate-700 mb-4">Chi tiết số liệu</h3>
              <div className="space-y-4">
                  {data.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border">
                          <div className="flex items-center gap-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="font-bold text-slate-700">{item.name}</span>
                          </div>
                          <span className="text-xl font-black" style={{ color: item.color }}>{item.value}</span>
                      </div>
                  ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded text-sm">
                  <strong>Mẹo:</strong> Hãy theo dõi tỉ lệ "Đã hủy" thường xuyên. Nếu tỉ lệ này quá cao (hơn 10%), bạn cần xem xét lại giá cả hoặc quy trình giao hàng.
              </div>
          </div>

      </div>
    </div>
  );
};

export default OrderStatusPage;