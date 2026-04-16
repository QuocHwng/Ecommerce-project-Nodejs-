import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSave, FaPlusCircle, FaTrash } from "react-icons/fa";

const ExportCreatePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [exportItems, setExportItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
    };
    fetchProducts();
  }, []);

  const addItemHandler = () => {
      if (!selectedProduct) return alert("Vui lòng chọn sản phẩm!");
      const productDetails = products.find(p => p._id === selectedProduct);
      
      // Kiểm tra tồn kho ngay tại đây
      if (Number(qty) > productDetails.countInStock) {
          return alert(`Không đủ hàng! Kho chỉ còn ${productDetails.countInStock}`);
      }

      const newItem = {
          product: productDetails._id,
          name: productDetails.name,
          qty: Number(qty),
          price: productDetails.price 
      };
      
      setExportItems([...exportItems, newItem]);
      setQty(1);
  };

  const removeItemHandler = (index) => {
      const newItems = [...exportItems];
      newItems.splice(index, 1);
      setExportItems(newItems);
  };

  const submitHandler = async () => {
      if (exportItems.length === 0) return alert("Chưa có sản phẩm!");
      if (!reason.trim()) return alert("Vui lòng nhập lý do xuất kho!");

      try {
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          
          await axios.post("http://localhost:5000/api/exports", {
              exportItems,
              reason
          }, config);

          alert("Xuất kho thành công!");
          navigate("/admin/export");
      } catch (error) {
          alert("Lỗi: " + (error.response?.data?.message || error.message));
      }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-black text-slate-800 uppercase mb-6 border-l-4 border-red-600 pl-4">
         Tạo phiếu xuất kho (Thủ công)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow border border-slate-200 h-fit">
              <div className="mb-4">
                  <label className="block font-bold text-sm mb-2">1. Chọn sản phẩm</label>
                  <select className="w-full border p-2 rounded" onChange={(e) => setSelectedProduct(e.target.value)}>
                      <option value="">-- Chọn --</option>
                      {products.map(p => (
                          <option key={p._id} value={p._id}>{p.name} (Tồn: {p.countInStock})</option>
                      ))}
                  </select>
              </div>

              <div className="mb-4">
                  <label className="block font-bold text-sm mb-2">2. Số lượng xuất</label>
                  <input type="number" className="w-full border p-2 rounded" value={qty} onChange={e => setQty(e.target.value)} />
              </div>

              <button onClick={addItemHandler} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                  <FaPlusCircle /> Thêm
              </button>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow border border-slate-200">
              <h3 className="font-bold text-lg mb-4 text-slate-700">Danh sách xuất</h3>
              
              {exportItems.length === 0 ? <p className="text-slate-400 italic">Trống...</p> : (
                  <table className="w-full text-sm mb-6">
                      <thead className="bg-slate-100 font-bold">
                          <tr>
                              <td className="p-2">Sản phẩm</td>
                              <td className="p-2">SL</td>
                              <td className="p-2"></td>
                          </tr>
                      </thead>
                      <tbody>
                          {exportItems.map((item, index) => (
                              <tr key={index} className="border-b">
                                  <td className="p-2 font-bold">{item.name}</td>
                                  <td className="p-2 text-red-600 font-bold">-{item.qty}</td>
                                  <td className="p-2">
                                      <button onClick={() => removeItemHandler(index)} className="text-red-500"><FaTrash /></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}

              <div className="mb-4">
                  <label className="block font-bold text-sm mb-2 text-red-600">Lý do xuất (*):</label>
                  <textarea className="w-full border p-2 rounded" rows="2" value={reason} onChange={e => setReason(e.target.value)} placeholder="VD: Hủy hàng hỏng, Xuất biếu tặng..."></textarea>
              </div>

              <div className="text-right mt-4">
                  <button onClick={submitHandler} disabled={exportItems.length === 0} className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 disabled:bg-slate-300">
                      <FaSave className="inline mr-2"/> XÁC NHẬN XUẤT KHO
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ExportCreatePage;