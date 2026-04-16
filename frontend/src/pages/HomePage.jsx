// frontend/src/pages/HomePage.jsx
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [searchParams, setSearchParams] = useSearchParams(); 
  
  const categoryParam = searchParams.get('category') || '';
  const keywordParam = searchParams.get('keyword') || '';

  // 1. Tải danh mục từ Admin
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/categories');
            setCategories(data);
        } catch (error) {
            console.error("Lỗi tải danh mục");
        }
    };
    fetchCategories();
  }, []);

  // 2. Tải sản phẩm (Lọc theo URL)
  useEffect(() => {
    const fetchProducts = async () => {
      let url = `http://localhost:5000/api/products?keyword=${keywordParam}&category=${categoryParam}`;
      const { data } = await axios.get(url);
      setProducts(data);
    };
    fetchProducts();
  }, [keywordParam, categoryParam]);

  // Xử lý khi bấm vào Danh mục bên trái
  const handleCategoryClick = (catName) => {
    // Nếu đang chọn rồi mà bấm lại -> Hủy chọn
    if (categoryParam === catName) {
        setSearchParams({});
    } else {
        setSearchParams({ category: catName });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      
      {/* --- PHẦN 1: LAYOUT TRÊN CÙNG (SIDEBAR + BANNER) --- */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
          
          {/* A. SIDEBAR DANH MỤC (BÊN TRÁI - 25%) */}
          <div className="w-full md:w-1/4 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
              <div className="bg-slate-800 text-white p-4 font-bold uppercase text-sm tracking-wider flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  Danh mục sản phẩm
              </div>
              <ul className="divide-y divide-slate-100">
                  {/* Nút tất cả */}
                  <li 
                      className={`cursor-pointer p-3 hover:bg-slate-50 hover:text-blue-600 transition flex justify-between items-center ${!categoryParam ? 'font-bold text-blue-600 bg-blue-50' : 'text-slate-600'}`}
                      onClick={() => setSearchParams({})}
                  >
                      <span>Tất cả sản phẩm</span>
                      <span className="text-slate-300">›</span>
                  </li>

                  {/* Danh sách danh mục động từ API */}
                  {categories.map((cat) => (
                      <li 
                          key={cat._id}
                          onClick={() => handleCategoryClick(cat.name)}
                          className={`cursor-pointer p-3 hover:bg-slate-50 hover:text-blue-600 transition flex justify-between items-center ${categoryParam === cat.name ? 'font-bold text-blue-600 bg-blue-50' : 'text-slate-600'}`}
                      >
                          <span>{cat.name}</span>
                          <span className="text-slate-300">›</span>
                      </li>
                  ))}
              </ul>
          </div>

          {/* B. BANNER LỚN (BÊN PHẢI - 75%) */}
          <div className="w-full md:w-3/4 rounded-xl overflow-hidden shadow-lg relative group">
              {/* Ảnh Banner To */}
              <img 
                  src="https://img.freepik.com/free-vector/gradient-colorful-sale-background_23-2148866753.jpg?w=1380&t=st=1709452000~exp=1709452600~hmac=..." 
                  alt="Banner" 
                  className="w-full h-[300px] md:h-[400px] object-cover transition duration-700 group-hover:scale-105"
                  // Link ảnh mẫu, bạn có thể thay bằng link ảnh của bạn
                  onError={(e) => {e.target.src = "https://via.placeholder.com/1200x500?text=BANNER+QUẢNG+CÁO"}} 
              />
              
              {/* Nội dung trên Banner */}
              <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-12">
                  <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                      SIÊU SALE <br/> CÔNG NGHỆ
                  </h2>
                  <p className="text-white text-lg mb-8 max-w-md drop-shadow">
                      Giảm giá lên đến 50% cho các thiết bị điện tử, laptop và phụ kiện.
                  </p>
                  <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold w-fit hover:bg-blue-600 hover:text-white transition shadow-lg">
                      MUA NGAY &rarr;
                  </button>
              </div>
          </div>

      </div>

      {/* --- PHẦN 2: TIÊU ĐỀ LIST SẢN PHẨM --- */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-black text-slate-800 uppercase border-l-4 border-blue-600 pl-3">
              {categoryParam ? `Sản phẩm: ${categoryParam}` : 'Gợi ý cho bạn'}
          </h2>
          {/* Ô tìm kiếm nhỏ gọn bên phải */}
          <div className="relative hidden md:block">
             <input 
                type="text" 
                placeholder="Tìm nhanh..." 
                className="border rounded-full pl-4 pr-10 py-1.5 text-sm focus:outline-blue-500 w-64"
                onChange={(e) => {
                    // Logic tìm kiếm realtime đơn giản
                    if(e.target.value) setSearchParams({ keyword: e.target.value });
                    else setSearchParams({});
                }}
             />
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute right-3 top-2 text-slate-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
             </svg>
          </div>
      </div>

      {/* --- PHẦN 3: DANH SÁCH SẢN PHẨM --- */}
      {products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl">
              <p className="text-slate-500 text-lg">Không tìm thấy sản phẩm nào.</p>
              <button onClick={() => setSearchParams({})} className="text-blue-600 font-bold mt-2 hover:underline">
                  Xem tất cả
              </button>
          </div>
      ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 flex flex-col group overflow-hidden">
                {/* Ảnh */}
                <div className="h-48 p-4 relative">
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition duration-500" 
                    />
                    {product.countInStock === 0 && <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">HẾT</span>}
                </div>
                
                {/* Thông tin */}
                <div className="p-4 flex flex-col flex-grow border-t border-slate-50">
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 tracking-wider">
                    {product.brand || product.category}
                  </div>
                  <Link to={`/product/${product._id}`} className="block mb-2">
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-blue-600 min-h-[40px]">
                        {product.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-auto flex items-center justify-between">
                     <span className="text-lg font-bold text-red-600">
                        {product.price?.toLocaleString()}đ
                     </span>
                     <div className="text-xs text-slate-400 flex items-center">
                        <span className="text-yellow-400 mr-1">★</span> 
                        {product.rating || 0}
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default HomePage;