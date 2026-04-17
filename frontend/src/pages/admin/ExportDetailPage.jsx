// frontend/src/pages/admin/ExportDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaPrint, FaUser, FaCalendarAlt, FaFileInvoiceDollar, FaDolly } from 'react-icons/fa';

const ExportDetailPage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`https://ecommerce-project-nodejs.onrender.com/api/exports/${id}`, config);
        setNote(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNote();
  }, [id]);

  if (!note) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Nút Quay lại & In (Sẽ bị ẩn khi in nhờ class no-print) */}
      <div className="flex justify-between items-center mb-6 no-print">
          <Link to="/admin/export" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold">
             <FaArrowLeft /> Quay lại danh sách
          </Link>
          <button 
            onClick={() => window.print()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200"
          >
              <FaPrint /> IN PHIẾU XUẤT
          </button>
      </div>

      {/* --- KHU VỰC SẼ ĐƯỢC IN (ID="printable-area") --- */}
      <div id="printable-area" className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          
          {/* Header Phiếu */}
          <div className="flex justify-between items-start border-b border-black pb-6 mb-6">
              <div>
                  <h1 className="text-3xl font-black text-black uppercase mb-2">Phiếu Xuất Kho</h1>
                  <p className="text-black font-mono">Mã phiếu: <span className="font-bold">#{note._id}</span></p>
                  <p className="text-sm text-black mt-1">Ngày in: {new Date().toLocaleString('vi-VN')}</p>
              </div>
              <div className="text-right">
                   {note.type === 'SALE' ? (
                        <div className="border-2 border-black px-4 py-2 font-bold uppercase inline-flex items-center gap-2 text-black">
                             <FaFileInvoiceDollar /> Xuất Bán Hàng
                        </div>
                   ) : (
                        <div className="border-2 border-black px-4 py-2 font-bold uppercase inline-flex items-center gap-2 text-black">
                             <FaDolly /> Xuất Thủ Công
                        </div>
                   )}
                   <p className="mt-2 text-sm font-bold text-black">Đơn vị: Quốc Hưng Shop</p>
                   <p className="text-xs text-black italic">Kho hàng trung tâm</p>
              </div>
          </div>

          {/* Thông tin chung */}
          <div className="grid grid-cols-3 gap-8 mb-8 text-sm text-black">
              <div>
                  <p className="font-bold uppercase mb-1">Người lập phiếu</p>
                  <div className="flex items-center gap-2 font-bold text-base">
                      <FaUser /> {note.user?.name}
                  </div>
              </div>
              <div>
                  <p className="font-bold uppercase mb-1">Thời gian xuất</p>
                  <div className="flex items-center gap-2 font-bold text-base">
                      <FaCalendarAlt /> 
                      {new Date(note.createdAt).toLocaleString('vi-VN')}
                  </div>
              </div>
              <div>
                  <p className="font-bold uppercase mb-1">Lý do xuất</p>
                  <p className="italic border border-black p-2 min-h-[40px]">
                      {note.reason}
                  </p>
              </div>
          </div>

          {/* Bảng sản phẩm */}
          <table className="w-full text-left border-collapse mb-8 border border-black text-black">
              <thead className="bg-gray-200 font-bold uppercase text-xs">
                  <tr>
                      <th className="p-3 border border-black text-center w-12">STT</th>
                      <th className="p-3 border border-black">Mã SP / Tên Sản phẩm</th>
                      <th className="p-3 border border-black text-center">ĐVT</th>
                      <th className="p-3 border border-black text-center">Số lượng</th>
                      <th className="p-3 border border-black text-center">Ghi chú</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  {note.exportItems.map((item, index) => (
                      <tr key={index}>
                          <td className="p-3 border border-black text-center">{index + 1}</td>
                          <td className="p-3 border border-black">
                              <span className="font-bold block text-base">{item.name}</span>
                              <span className="text-xs font-mono">ID: {item.product?._id.substring(0,8)}...</span>
                          </td>
                          <td className="p-3 border border-black text-center">Cái</td>
                          <td className="p-3 border border-black text-center font-bold text-xl">
                              {item.qty}
                          </td>
                          <td className="p-3 border border-black text-center italic text-xs">
                              {note.type === 'SALE' ? 'Giao khách' : 'Xuất kho'}
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>

          {/* Phần Ký tên */}
          <div className="grid grid-cols-3 gap-4 text-center mt-12 pt-4 text-black break-inside-avoid">
              <div>
                  <p className="font-bold uppercase text-xs mb-16">Người lập phiếu</p>
                  <p className="font-bold">{note.user?.name}</p>
              </div>
              <div>
                  <p className="font-bold uppercase text-xs mb-16">Thủ kho</p>
                  <p className="italic">(Ký, họ tên)</p>
              </div>
              <div>
                  <p className="font-bold uppercase text-xs mb-16">Người nhận hàng</p>
                  <p className="italic">(Ký, họ tên)</p>
              </div>
          </div>
          
          {/* Footer in */}
          <div className="text-center text-xs mt-8 pt-4 border-t border-black hidden print:block">
              Hệ thống quản lý kho Quốc Hưng Shop - Hotline hỗ trợ: 1900 xxxx
          </div>

          {/* Link đơn hàng (Sẽ ẩn khi in) */}
          {note.orderId && (
              <div className="mt-6 pt-4 border-t border-slate-200 text-center no-print">
                  <Link to={`/admin/order/${note.orderId}`} className="text-blue-600 hover:underline font-bold">
                      Xem chi tiết đơn hàng liên quan &rarr;
                  </Link>
              </div>
          )}
      </div>
    </div>
  );
};

export default ExportDetailPage;