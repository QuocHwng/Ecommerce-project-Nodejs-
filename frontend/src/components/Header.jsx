// frontend/src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [keyword, setKeyword] = useState('');
  const [cartCount, setCartCount] = useState(0); 
  const navigate = useNavigate();
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // 👇 LOGIC ĐẾM SỐ SẢN PHẨM TRONG GIỎ (ĐÃ SỬA)
  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // YÊU CẦU CỦA BẠN: Đếm số loại sản phẩm (số dòng)
    // Ví dụ: 5 chuột + 3 phím = 2 loại (Header hiện số 2)
    setCartCount(cartItems.length);
    
    /* Lưu ý: Nếu bạn muốn đếm TỔNG số lượng (5+3=8), 
       thì dùng lại dòng này:
       const total = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);
    */
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?keyword=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-blue-600 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        
        <Link to="/" className="text-2xl md:text-3xl font-black text-white tracking-tighter flex-shrink-0">
          QUỐC HƯNG <span className="text-yellow-400">SHOP</span>
        </Link>

        <form onSubmit={submitSearch} className="flex-1 max-w-2xl relative hidden md:block">
            <input 
              type="text" 
              className="w-full border-2 border-yellow-400 rounded-full py-2 px-5 pr-12 focus:outline-none shadow-sm text-slate-800 font-medium"
              placeholder="Bạn tìm gì hôm nay?..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="absolute right-1 top-1 bottom-1 bg-yellow-400 text-blue-800 px-4 rounded-full hover:bg-yellow-300 transition font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
        </form>

        <div className="flex items-center gap-4 md:gap-6 text-white font-bold text-sm md:text-base flex-shrink-0">
            <Link to="/" className="hover:text-yellow-300 transition hidden sm:block">Trang chủ</Link>
            
            {userInfo && userInfo.isAdmin && (
                <Link to="/admin/dashboard" className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition border border-red-400">ADMIN</Link>
            )}

            {userInfo ? (
                <div className="relative group">
                    <button className="flex items-center gap-2 bg-blue-700 py-1.5 px-3 rounded-full hover:bg-blue-800 transition border border-blue-500">
                        <div className="w-7 h-7 bg-yellow-400 rounded-full text-blue-800 flex items-center justify-center text-xs font-black">
                            {userInfo.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="max-w-[100px] truncate">{userInfo.name}</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white text-slate-800 rounded-lg shadow-xl invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50 overflow-hidden border border-slate-100">
                        <Link to="/profile" className="block px-4 py-3 hover:bg-slate-50">👤 Hồ sơ cá nhân</Link>
                        <button onClick={logoutHandler} className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-bold">🚪 Đăng xuất</button>
                    </div>
                </div>
            ) : (
                <Link to="/login" className="hover:text-yellow-300">Đăng nhập</Link>
            )}

            <Link to="/cart" className="relative hover:text-yellow-300 transition">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-blue-600">
                        {cartCount}
                    </span>
                )}
            </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;