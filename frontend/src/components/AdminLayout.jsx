// frontend/src/components/AdminLayout.jsx
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaBoxOpen, 
  FaClipboardList, 
  FaUsers, 
  FaSignOutAlt, 
  FaWarehouse,      // Icon Kho hàng
  FaFileImport,     // Icon Phiếu nhập
  FaFileExport,     // Icon Phiếu xuất
  FaTags,
  FaChartPie            
} from 'react-icons/fa';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    window.location.href = '/login';
  };

  // Danh sách Menu Admin (Đã tách bạch Kho/Nhập/Xuất)
  const menuItems = [
    { 
      path: "/admin/dashboard", name: "Tổng quan", icon: <FaHome /> 
    },
    { 
      path: "/admin/productlist", name: "Sản phẩm", icon: <FaBoxOpen /> 
    },
    { 
      path: "/admin/categorylist", name: "Danh mục", icon: <FaTags /> 
    },
    { 
      path: "/admin/orderlist", name: "Đơn hàng", icon: <FaClipboardList /> 
    },
    
    // --- KHU VỰC QUẢN LÝ KHO ---
    { 
      path: "/admin/inventory", name: "Kho hàng (Tồn kho)", icon: <FaWarehouse /> 
    },
    { 
      path: "/admin/import", name: "Phiếu nhập kho", icon: <FaFileImport /> 
    },
    { 
      path: "/admin/export", name: "Phiếu xuất kho", icon: <FaFileExport /> 
    },
    // ---------------------------
    { 
      path: "/admin/userlist", name: "Thành viên", icon: <FaUsers /> 
    },
    { 
      path: "/admin/stats", 
      name: "Thống kê", 
      icon: <FaChartPie /> 
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* SIDEBAR (Cột bên trái) */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10 shadow-xl transition-all duration-300">
        
        {/* Logo Admin */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700 bg-slate-950">
           <Link to="/admin/dashboard" className="text-xl font-black uppercase tracking-wider text-white">
              ADMIN <span className="text-blue-500">PANEL</span>
           </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
           {/* Tiêu đề nhóm */}
           <div className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Quản lý
           </div>

           {menuItems.map((item) => {
             const isActive = location.pathname.includes(item.path);
             return (
               <Link 
                 key={item.path} 
                 to={item.path}
                 className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                    isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                 }`}
               >
                 <span className="text-lg">{item.icon}</span>
                 <span>{item.name}</span>
               </Link>
             )
           })}

           {/* Nút Đăng xuất ở dưới cùng Sidebar */}
           <div className="pt-6 mt-6 border-t border-slate-700">
              <div className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hệ thống
              </div>
              <button 
                onClick={logoutHandler}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors font-medium"
              >
                <FaSignOutAlt className="text-lg" />
                <span>Đăng xuất</span>
              </button>
           </div>
        </nav>
      </aside>

      {/* MAIN CONTENT (Phần nội dung bên phải) */}
      <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
        
        {/* Header Admin (Trắng) */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-20">
            {/* Tiêu đề trang hoặc Breadcrumb */}
            <div className="flex items-center gap-4">
                <button className="text-slate-500 hover:text-slate-800 lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <h2 className="text-lg font-bold text-slate-700 uppercase">Hệ thống quản trị</h2>
            </div>

            {/* Thông tin Admin & Link ra web chính */}
            <div className="flex items-center gap-6">
                <Link to="/" target="_blank" className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">
                    🌐 Xem Website
                </Link>

                <div className="flex items-center gap-3 border-l pl-6">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-400 font-bold uppercase">Admin</p>
                        <p className="text-sm font-bold text-slate-800">{userInfo?.name}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md border-2 border-white">
                        {userInfo?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>

        {/* Nội dung thay đổi (Outlet) */}
        <main className="p-8">
            <Outlet />
        </main>

        {/* Footer Admin nhỏ */}
        <footer className="mt-auto py-6 text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Quốc Hưng Shop Admin Panel. Version 2.0 Pro
        </footer>

      </div>
    </div>
  );
};

export default AdminLayout;