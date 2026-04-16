// frontend/src/pages/admin/ImportCreatePage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Thêm Link vào import
import { FaSave, FaPlusCircle, FaTrash, FaArrowLeft } from "react-icons/fa";

const ImportCreatePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [importItems, setImportItems] = useState([]); 
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/products");
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };
    fetchProducts();
  }, []);

  const addItemHandler = () => {
      if (!selectedProduct) return alert("Vui lòng chọn sản phẩm!");
      const productDetails = products.find(p => p._id === selectedProduct);
      
      const newItem = {
          product: productDetails._id,
          name: productDetails.name,
          qty: Number(qty),
          price: Number(price)
      };
      
      setImportItems([...importItems, newItem]);
      setQty(1);
      setPrice(0);
  };

  const removeItemHandler = (index) => {
      const newItems = [...importItems];
      newItems.splice(index, 1);
      setImportItems(newItems);
  };

  const submitHandler = async () => {
      if (importItems.length === 0) return alert("Chưa có sản phẩm nào!");
      try {
          const userInfo = JSON.parse(localStorage.getItem("userInfo"));
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          
          await axios.post("http://localhost:5000/api/imports", {
              importItems,
              note
          }, config);

          alert("Nhập kho thành công! Tồn kho đã được cập nhật.");
          
          // --- SỬA LỖI TẠI ĐÂY ---
          // Trước đây là: navigate("/admin/warehouse"); -> SAI (Trang này đã bị xóa)
          // Sửa thành:
          navigate("/admin/import"); 
          // -----------------------

      } catch (error) {
          alert("Lỗi: " + error.message);
      }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Nút quay lại */}
      <Link to="/admin/import" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-bold">
         <FaArrowLeft /> Quay lại danh sách nhập
      </Link>

      <h1 className="text-2xl font-black text-slate-800 uppercase mb-6 border-l-4 border-green-600 pl-4">
         Tạo phiếu nhập kho
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* FORM NHẬP LIỆU */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow border border-slate-200 h-fit">
              <div className="mb-4">
                  <label className="block font-bold text-sm mb-2">1. Chọn sản phẩm</label>
                  <select 
                    className="w-full border p-2 rounded focus:outline-green-500"
                    onChange={(e) => setSelectedProduct(e.target.value)}
                  >
                      <option value="">-- Chọn --</option>
                      {products.map(p => (
                          <option key={p._id} value={p._id}>{p.name} (Tồn: {p.countInStock})</option>
                      ))}
                  </select>
              </div>

              <div className="mb-4">
                  <label className="block font-bold text-sm mb-2">2. Số lượng nhập</label>
                  <input type="number" min="1" className="w-full border p-2 rounded focus:outline-green-500" value={qty} onChange={e => setQty(e.target.value)} />
              </div>

              <div className="mb-4">
                  <label className="block font-bold text-sm mb-2">3. Giá nhập (VNĐ)</label>
                  <input type="number" min="0" className="w-full border p-2 rounded focus:outline-green-500" value={price} onChange={e => setPrice(e.target.value)} />
              </div>

              <button onClick={addItemHandler} className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 flex justify-center items-center gap-2">
                  <FaPlusCircle /> Thêm vào phiếu
              </button>
          </div>

          {/* DANH SÁCH CHỜ LƯU */}
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow border border-slate-200">
              <h3 className="font-bold text-lg mb-4 text-slate-700">Danh sách hàng chuẩn bị nhập</h3>
              
              {importItems.length === 0 ? <p className="text-slate-400 italic">Chưa có sản phẩm nào...</p> : (
                  <table className="w-full text-sm mb-6">
                      <thead className="bg-slate-100 font-bold">
                          <tr>
                              <td className="p-2">Sản phẩm</td>
                              <td className="p-2">SL</td>
                              <td className="p-2">Giá nhập</td>
                              <td className="p-2">Thành tiền</td>
                              <td className="p-2"></td>
                          </tr>
                      </thead>
                      <tbody>
                          {importItems.map((item, index) => (
                              <tr key={index} className="border-b">
                                  <td className="p-2 font-bold">{item.name}</td>
                                  <td className="p-2">{item.qty}</td>
                                  <td className="p-2">{item.price.toLocaleString()}</td>
                                  <td className="p-2 font-bold">{(item.qty * item.price).toLocaleString()}</td>
                                  <td className="p-2">
                                      <button onClick={() => removeItemHandler(index)} className="text-red-500"><FaTrash /></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              )}

              <div className="mb-4">
                  <label className="block font-bold text-sm mb-2">Ghi chú phiếu nhập:</label>
                  <textarea className="w-full border p-2 rounded focus:outline-green-500" rows="2" value={note} onChange={e => setNote(e.target.value)} placeholder="VD: Nhập hàng từ NCC A..."></textarea>
              </div>

              <div className="flex justify-between items-center border-t pt-4 mt-4">
                  <div>
                      <span className="block text-sm text-slate-500">Tổng giá trị phiếu:</span>
                      <span className="text-2xl font-black text-red-600">
                          {importItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString()}đ
                      </span>
                  </div>
                  <button onClick={submitHandler} disabled={importItems.length === 0} className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-slate-300">
                      <FaSave className="inline mr-2"/> LƯU VÀ NHẬP KHO
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default ImportCreatePage;