// frontend/src/pages/admin/AdminInventoryPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaBoxes, FaExclamationTriangle, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminInventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // Tính tổng giá trị tồn kho ước tính
  const totalValue = products.reduce((acc, item) => acc + (item.price * item.countInStock), 0);

  if (loading) return <div className="p-10 text-center">Đang tải dữ liệu kho...</div>;

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-800 uppercase border-l-4 border-blue-600 pl-4 mb-6">
          Tồn kho hiện tại
      </h1>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl shadow border border-slate-200 flex items-center gap-4">
               <div className="p-4 bg-blue-100 text-blue-600 rounded-full text-2xl"><FaBoxes /></div>
               <div>
                   <p className="text-slate-500 text-sm font-bold">Tổng sản phẩm trong kho</p>
                   <p className="text-2xl font-black">{products.reduce((acc, item) => acc + item.countInStock, 0)} cái</p>
               </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow border border-slate-200 flex items-center gap-4">
               <div className="p-4 bg-purple-100 text-purple-600 rounded-full text-2xl">$$$</div>
               <div>
                   <p className="text-slate-500 text-sm font-bold">Ước tính giá trị kho (Giá bán)</p>
                   <p className="text-2xl font-black text-purple-600">{totalValue.toLocaleString()}đ</p>
               </div>
           </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white uppercase text-xs">
            <tr>
              <th className="p-4">Hình ảnh</th>
              <th className="p-4">Tên sản phẩm</th>
              <th className="p-4">SKU / ID</th>
              <th className="p-4">Giá bán</th>
              <th className="p-4 text-center">Tồn kho</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded border" />
                </td>
                <td className="p-4 font-bold">{product.name}</td>
                <td className="p-4 font-mono text-xs text-slate-500">{product._id.substring(0, 8)}...</td>
                <td className="p-4">{product.price.toLocaleString()}đ</td>
                
                {/* Cột Số lượng tồn kho */}
                <td className="p-4 text-center">
                    <span className={`text-lg font-black ${product.countInStock < 10 ? 'text-red-600' : 'text-slate-800'}`}>
                        {product.countInStock}
                    </span>
                </td>

                {/* Cảnh báo trạng thái */}
                <td className="p-4 text-center">
                    {product.countInStock === 0 ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center justify-center gap-1">
                            <FaExclamationTriangle /> HẾT HÀNG
                        </span>
                    ) : product.countInStock < 10 ? (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">
                            Sắp hết
                        </span>
                    ) : (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            Còn hàng
                        </span>
                    )}
                </td>

                {/* Link xem chi tiết thẻ kho */}
                <td className="p-4 text-center">
                    <Link to={`/admin/inventory/${product._id}`} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-blue-200 inline-flex items-center gap-1">
                        <FaEye /> Chi tiết
                    </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventoryPage;