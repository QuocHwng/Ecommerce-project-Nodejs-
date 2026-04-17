import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaBox, FaTag, FaWarehouse } from 'react-icons/fa';

const AdminInventoryDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`https://ecommerce-project-nodejs.onrender.com/api/products/${id}`);
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/admin/inventory" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 font-bold">
         <FaArrowLeft /> Quay lại kho hàng
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột ảnh */}
          <div className="md:col-span-1">
              <div className="bg-white p-4 rounded-xl shadow border border-slate-200">
                  <img src={product.image} alt={product.name} className="w-full h-auto object-contain rounded" />
              </div>
          </div>

          {/* Cột thông tin */}
          <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                  <h1 className="text-3xl font-black text-slate-800 mb-2">{product.name}</h1>
                  <p className="text-slate-500 font-mono text-sm mb-4">ID: {product._id}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-xs text-blue-500 font-bold uppercase mb-1">Tồn kho hiện tại</p>
                          <p className="text-4xl font-black text-blue-700">{product.countInStock}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-xs text-green-500 font-bold uppercase mb-1">Giá bán niêm yết</p>
                          <p className="text-2xl font-black text-green-700">{product.price.toLocaleString()}đ</p>
                      </div>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                  <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><FaTag /> Thông tin chi tiết</h3>
                  <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Danh mục:</span>
                          <span className="font-bold">{product.category}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-500">Thương hiệu:</span>
                          <span className="font-bold">{product.brand}</span>
                      </div>
                      <div className="pt-2">
                          <span className="block text-slate-500 mb-1">Mô tả sản phẩm:</span>
                          <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded">{product.description}</p>
                      </div>
                  </div>
              </div>
              
              <div className="flex gap-4">
                  <Link to={`/admin/product/${product._id}/edit`} className="flex-1 bg-slate-800 text-white py-3 rounded-lg font-bold text-center hover:bg-black transition">
                      Chỉnh sửa thông tin
                  </Link>
                  {/* Ý tưởng phát triển sau này: Nút xem lịch sử giao dịch của riêng sản phẩm này */}
              </div>
          </div>
      </div>
    </div>
  );
};

export default AdminInventoryDetailPage;