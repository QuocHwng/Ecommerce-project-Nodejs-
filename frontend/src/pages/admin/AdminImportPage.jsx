// frontend/src/pages/admin/AdminImportPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaFileInvoice } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminImportPage = () => {
  const [imports, setImports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImports = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get("http://localhost:5000/api/imports", config);
        setImports(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchImports();
  }, []);

  if (loading) return <div className="p-10 text-center">Đang tải danh sách phiếu nhập...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800 uppercase border-l-4 border-green-600 pl-4">
          Quản lý Phiếu Nhập
        </h1>
        <Link to="/admin/import/create" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2 shadow-lg shadow-green-200">
           <FaPlus /> Tạo phiếu nhập
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {imports.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic">Chưa có phiếu nhập hàng nào.</div>
        ) : (
            <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800 text-white uppercase text-xs">
                <tr>
                <th className="p-4">Mã phiếu</th>
                <th className="p-4">Ngày nhập</th>
                <th className="p-4">Người nhập</th>
                <th className="p-4">Chi tiết nội dung</th>
                <th className="p-4 text-right">Tổng tiền</th>
                </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
                {imports.map((item) => (
                <tr key={item._id} className="border-b hover:bg-slate-50 transition">
                    {/* CỘT MÃ PHIẾU CÓ LINK */}
                    <td className="p-4 font-mono text-slate-500">
                        <Link to={`/admin/import/${item._id}`} className="flex items-center gap-2 hover:text-blue-600 hover:underline font-bold transition">
                            <FaFileInvoice className="text-green-600"/> 
                            {item._id.substring(0, 8)}...
                        </Link>
                    </td>
                    
                    <td className="p-4">{item.createdAt.substring(0, 10)}</td>
                    <td className="p-4 font-bold">{item.user?.name}</td>
                    
                    <td className="p-4">
                        {item.importItems.map(p => (
                            <div key={p._id} className="text-xs mb-1">
                                • {p.name} (SL: <strong>{p.qty}</strong>)
                            </div>
                        ))}
                        {item.note && <p className="text-xs text-slate-400 italic mt-1">Ghi chú: {item.note}</p>}
                    </td>
                    
                    <td className="p-4 text-right font-bold text-green-700">
                        {item.totalPrice.toLocaleString()}đ
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default AdminImportPage;