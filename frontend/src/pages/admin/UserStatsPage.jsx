import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserStatsPage = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('http://localhost:5000/api/users/stats', config);
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-black text-slate-800 uppercase border-l-4 border-pink-600 pl-4 mb-8">
        Thống kê Tăng trưởng Thành viên
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
          <h3 className="text-xl font-bold text-slate-700 mb-6">Người dùng đăng ký mới (Theo tháng)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Người dùng mới" stroke="#db2777" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-slate-500 mt-4 italic">Biểu đồ thể hiện số lượng tài khoản được tạo mới trong 12 tháng qua.</p>
      </div>
    </div>
  );
};

export default UserStatsPage;