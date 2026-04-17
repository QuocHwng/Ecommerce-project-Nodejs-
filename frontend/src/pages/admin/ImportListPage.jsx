// frontend/src/pages/admin/ImportListPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaEye } from 'react-icons/fa';

const ImportListPage = () => {
  const navigate = useNavigate();
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchImports = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('https://ecommerce-project-nodejs.onrender.com/api/imports', config);
        setImports(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchImports();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (loading) return <div className="p-10 text-center">Đang tải danh sách phiếu nhập...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800 uppercase border-l-4 border-green-600 pl-4">
          Lịch sử Nhập Kho
        </h1>
        <Link 
            to="/admin/import/create"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg shadow-green-200"
        >
           <FaPlus /> Tạo phiếu nhập
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white uppercase text-xs">
            <tr>
              <th className="p-4">Mã phiếu</th>
              <th className="p-4">Người nhập</th>
              <th className="p-4">Ngày nhập</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {imports.map((item) => (
              <tr key={item._id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4 font-mono text-xs font-bold text-slate-500">#{item._id}</td>
                <td className="p-4 font-bold">{item.user?.name}</td>
                <td className="p-4">{new Date(item.createdAt).toLocaleString('vi-VN')}</td>
                <td className="p-4 font-bold text-green-600">{item.totalPrice.toLocaleString()}đ</td>
                <td className="p-4 text-center">
                    <Link to={`/admin/import/${item._id}`} className="text-blue-600 hover:text-blue-800 text-lg">
                        <FaEye />
                    </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {imports.length === 0 && <p className="p-4 text-center text-slate-400 italic">Chưa có phiếu nhập nào.</p>}
      </div>
    </div>
  );
};

export default ImportListPage;