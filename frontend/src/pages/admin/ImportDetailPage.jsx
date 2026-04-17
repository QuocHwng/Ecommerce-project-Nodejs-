// frontend/src/pages/admin/ImportDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaPrint, FaUser, FaCalendarAlt, FaFileImport } from 'react-icons/fa';

const ImportDetailPage = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`https://ecommerce-project-nodejs.onrender.com/api/imports/${id}`, config);
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
      
      {/* Nút Quay lại & In (Có class no-print để ẩn đi) */}
      <div className="flex justify-between items-center mb-6 no-print">
          <Link to="/admin/import" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold">
             <FaArrowLeft /> Quay lại danh sách
          </Link>
          <button 
            onClick={() => window.print()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200"
          >
              <FaPrint /> IN PHIẾU NHẬP
          </button>
      </div>

      {/* --- KHU VỰC SẼ ĐƯỢC IN (Thêm ID="printable-area") --- */}
      <div id="printable-area" className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          
          {/* Header Phiếu */}
          <div className="flex justify-between items-start border-b border-black pb-6 mb-6">
              <div>
                  <h1 className="text-3xl font-black text-black uppercase mb-2">Phiếu Nhập Kho</h1>
                  <p className="text-black font-mono">Mã phiếu: <span className="font-bold">#{note._id}</span></p>
                  <p className="text-sm text-black mt-1">Ngày in: {new Date().toLocaleString('vi-VN')}</p>
              </div>
              <div className="text-right">
                   <div className="border-2 border-black px-4 py-2 font-bold uppercase inline-flex items-center gap-2 text-black">
                        <FaFileImport /> Nhập Mua Hàng
                   </div>
                   <p className="mt-2 text-sm font-bold text-black">Đơn vị: Quốc Hưng Shop</p>
              </div>
          </div>

          {/* Thông tin chung */}
          <div className="grid grid-cols-3 gap-8 mb-8 text-sm text-black">
              <div>
                  <p className="font-bold uppercase mb-1">Người nhập hàng</p>
                  <div className="flex items-center gap-2 font-bold text-base">
                      <FaUser /> {note.user?.name}
                  </div>
                  <p className="text-xs">{note.user?.email}</p>
              </div>
              <div>
                  <p className="font-bold uppercase mb-1">Thời gian nhập</p>
                  <div className="flex items-center gap-2 font-bold text-base">
                      <FaCalendarAlt /> 
                      {new Date(note.createdAt).toLocaleString('vi-VN')}
                  </div>
              </div>
              <div>
                  <p className="font-bold uppercase mb-1">Ghi chú</p>
                  <p className="italic border border-black p-2 min-h-[40px]">
                      {note.note || "Không có ghi chú"}
                  </p>
              </div>
          </div>

          {/* Bảng sản phẩm */}
          <table className="w-full text-left border-collapse mb-6 border border-black text-black">
              <thead className="bg-gray-200 font-bold uppercase text-xs">
                  <tr>
                      <th className="p-2 border border-black text-center w-10">STT</th>
                      <th className="p-2 border border-black">Sản phẩm</th>
                      <th className="p-2 border border-black text-center">ĐVT</th>
                      <th className="p-2 border border-black text-center">SL</th>
                      <th className="p-2 border border-black text-right">Đơn giá</th>
                      <th className="p-2 border border-black text-right">Thành tiền</th>
                  </tr>
              </thead>
              <tbody className="text-sm">
                  {note.importItems.map((item, index) => (
                      <tr key={index}>
                          <td className="p-2 border border-black text-center">{index + 1}</td>
                          <td className="p-2 border border-black font-bold">
                              {item.name}
                              <div className="text-xs font-normal text-gray-600 font-mono">ID: {item.product?._id.substring(0,8)}...</div>
                          </td>
                          <td className="p-2 border border-black text-center">Cái</td>
                          <td className="p-2 border border-black text-center font-bold text-lg">
                              {item.qty}
                          </td>
                          <td className="p-2 border border-black text-right">
                              {item.price.toLocaleString()}đ
                          </td>
                          <td className="p-2 border border-black text-right font-bold">
                              {(item.qty * item.price).toLocaleString()}đ
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>

          {/* Tổng tiền */}
          <div className="flex justify-end pt-2 mb-8">
              <div className="text-right text-black">
                  <span className="font-bold uppercase text-xs mr-4">Tổng giá trị phiếu nhập:</span>
                  <span className="text-3xl font-black border-b-2 border-black pb-1">
                      {note.totalPrice.toLocaleString()}đ
                  </span>
              </div>
          </div>

          {/* Ký tên */}
          <div className="grid grid-cols-3 gap-4 text-center mt-12 pt-4 text-black">
              <div>
                  <p className="font-bold uppercase text-xs mb-16">Người lập phiếu</p>
                  <p className="font-bold">{note.user?.name}</p>
              </div>
              <div>
                  <p className="font-bold uppercase text-xs mb-16">Thủ kho</p>
                  <p className="italic">(Ký, họ tên)</p>
              </div>
              <div>
                  <p className="font-bold uppercase text-xs mb-16">Nhà cung cấp / Giao hàng</p>
                  <p className="italic">(Ký, họ tên)</p>
              </div>
          </div>
          
          {/* Footer chỉ hiện khi in */}
          <div className="text-center text-xs mt-8 pt-4 border-t border-black hidden print:block">
               In từ hệ thống Quốc Hưng Shop - Ngày in: {new Date().toLocaleDateString()}
          </div>
      </div>
    </div>
  );
};

export default ImportDetailPage;