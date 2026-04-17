// frontend/src/pages/admin/ExportListPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEye, FaFileInvoiceDollar } from 'react-icons/fa';

const ExportListPage = () => {
  const navigate = useNavigate();
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchExports = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('https://ecommerce-project-nodejs.onrender.com/api/exports', config);
        setExports(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchExports();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (loading) return <div className="p-10 text-center">Đang tải danh sách phiếu xuất...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800 uppercase border-l-4 border-red-600 pl-4">
          Lịch sử Xuất Kho
        </h1>
        <Link 
            to="/admin/export/create"
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 shadow-lg shadow-red-200"
        >
           <FaPlus /> Tạo phiếu xuất
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white uppercase text-xs">
            <tr>
              <th className="p-4">Mã phiếu</th>
              <th className="p-4">Người xuất</th>
              <th className="p-4">Loại phiếu</th>
              <th className="p-4">Ngày xuất</th>
              <th className="p-4 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {exports.map((item) => (
              <tr key={item._id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4 font-mono text-xs font-bold text-slate-500">#{item._id}</td>
                <td className="p-4 font-bold">{item.user?.name}</td>
                <td className="p-4">
                    {item.type === 'SALE' ? (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">Bán hàng</span>
                    ) : (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded font-bold">Thủ công</span>
                    )}
                </td>
                <td className="p-4">{new Date(item.createdAt).toLocaleString('vi-VN')}</td>
                <td className="p-4 text-center">
                    <Link to={`/admin/export/${item._id}`} className="text-blue-600 hover:text-blue-800 text-lg">
                        <FaEye />
                    </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {exports.length === 0 && <p className="p-4 text-center text-slate-400 italic">Chưa có phiếu xuất nào.</p>}
      </div>
    </div>
  );
};

export default ExportListPage;