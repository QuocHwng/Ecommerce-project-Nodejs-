// frontend/src/pages/admin/AdminExportPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaDolly, FaFileInvoiceDollar } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminExportPage = () => {
  const [exports, setExports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExports = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get("https://ecommerce-project-nodejs.onrender.com/api/exports", config);
        setExports(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchExports();
  }, []);

  if (loading) return <div className="p-10 text-center">Đang tải danh sách phiếu xuất...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800 uppercase border-l-4 border-red-600 pl-4">
          Quản lý Xuất kho
        </h1>
        <Link to="/admin/export/create" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 shadow-lg shadow-red-200">
           <FaPlus /> Xuất kho thủ công
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {exports.length === 0 ? (
            <div className="p-8 text-center text-slate-500 italic">Chưa có lịch sử xuất kho.</div>
        ) : (
            <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800 text-white uppercase text-xs">
                <tr>
                <th className="p-4">Mã phiếu</th>
                <th className="p-4">Ngày xuất</th>
                <th className="p-4">Loại xuất</th>
                <th className="p-4">Nội dung / Sản phẩm</th>
                <th className="p-4">Lý do</th>
                </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
                {exports.map((item) => (
                <tr key={item._id} className="border-b hover:bg-slate-50 transition">
                    {/* CỘT MÃ PHIẾU CÓ LINK */}
                    <td className="p-4 font-mono text-slate-500">
                        <Link to={`/admin/export/${item._id}`} className="hover:text-blue-600 hover:underline font-bold transition">
                            {item._id.substring(0, 8)}...
                        </Link>
                    </td>

                    <td className="p-4">{item.createdAt.substring(0, 10)}</td>
                    
                    <td className="p-4">
                        {item.type === 'SALE' ? (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold flex items-center w-fit gap-1">
                                <FaFileInvoiceDollar /> BÁN HÀNG
                            </span>
                        ) : (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold flex items-center w-fit gap-1">
                                <FaDolly /> THỦ CÔNG
                            </span>
                        )}
                    </td>

                    <td className="p-4">
                        {item.exportItems.map(p => (
                            <div key={p._id} className="text-xs mb-1">
                                - {p.name} <span className="text-red-600 font-bold">(-{p.qty})</span>
                            </div>
                        ))}
                    </td>
                    
                    <td className="p-4 text-slate-600 italic max-w-xs truncate" title={item.reason}>
                        {item.reason}
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

export default AdminExportPage;