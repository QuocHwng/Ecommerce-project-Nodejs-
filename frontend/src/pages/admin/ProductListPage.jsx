// frontend/src/pages/admin/ProductListPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ProductListPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchProducts();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // XỬ LÝ XÓA SẢN PHẨM
  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        fetchProducts(); 
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải danh sách...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-slate-800 uppercase border-l-4 border-blue-600 pl-4">
          Danh sách sản phẩm
        </h1>
        
        {/* --- KHẮC PHỤC LỖI TẠI ĐÂY --- */}
        {/* Thay vì dùng Button gọi API bị lỗi, ta dùng Link để chuyển trang */}
        <Link 
            to="/admin/product/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200"
        >
           <FaPlus /> Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white uppercase text-xs">
            <tr>
              <th className="p-4">ID / Hình ảnh</th>
              <th className="p-4">Tên sản phẩm</th>
              <th className="p-4">Giá bán</th>
              <th className="p-4">Danh mục</th>
              <th className="p-4">Thương hiệu</th>
              <th className="p-4 text-center">Tồn kho</th>
              <th className="p-4 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-700">
            {products.map((product) => (
              <tr key={product._id} className="border-b hover:bg-slate-50 transition">
                <td className="p-4 flex items-center gap-3">
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded border" />
                    <span className="font-mono text-xs text-slate-400">{product._id.substring(0,6)}...</span>
                </td>
                <td className="p-4 font-bold max-w-[200px] truncate" title={product.name}>
                    {product.name}
                </td>
                <td className="p-4 font-bold text-slate-800">
                    {product.price.toLocaleString()}đ
                </td>
                <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{product.category}</span>
                </td>
                <td className="p-4">{product.brand}</td>
                
                <td className="p-4 text-center">
                     {product.countInStock === 0 ? (
                        <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded">Hết hàng</span>
                     ) : (
                        <span className="font-bold">{product.countInStock}</span>
                     )}
                </td>

                <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                        <Link to={`/admin/product/${product._id}/edit`} className="bg-yellow-100 text-yellow-700 p-2 rounded hover:bg-yellow-200 transition" title="Sửa">
                            <FaEdit />
                        </Link>
                        <button 
                            onClick={() => deleteHandler(product._id)}
                            className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition" 
                            title="Xóa"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListPage;