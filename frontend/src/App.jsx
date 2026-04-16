// // frontend/src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // --- 1. IMPORT LAYOUTS ---
// import UserLayout from './components/UserLayout';
// import AdminLayout from './components/AdminLayout';

// // --- 2. IMPORT TRANG KHÁCH HÀNG ---
// import HomePage from './pages/HomePage';
// import ProductPage from './pages/ProductPage';
// import CartPage from './pages/CartPage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import ProfilePage from './pages/ProfilePage';
// import ShippingPage from './pages/ShippingPage';
// import PaymentPage from './pages/PaymentPage';
// import PlaceOrderPage from './pages/PlaceOrderPage';
// import OrderPage from './pages/OrderPage';
// import OrderSuccessPage from './pages/OrderSuccessPage';


// // --- 3. IMPORT TRANG ADMIN ---
// import AdminDashboardPage from './pages/admin/AdminDashboardPage';
// import ProductListPage from './pages/admin/ProductListPage';
// import ProductEditPage from './pages/admin/ProductEditPage';
// import CategoryListPage from './pages/admin/CategoryListPage';
// import UserListPage from './pages/admin/UserListPage';
// import OrderListPage from './pages/admin/OrderListPage';

// // --- 4. IMPORT MODULE KHO HÀNG (QUAN TRỌNG: KIỂM TRA KỸ NHÓM NÀY) ---
// import AdminInventoryPage from './pages/admin/AdminInventoryPage';       // Xem tồn kho
// import AdminInventoryDetailPage from './pages/admin/AdminInventoryDetailPage'; // Chi tiết sp trong kho

// import AdminImportPage from './pages/admin/AdminImportPage';             // Lịch sử nhập
// import ImportCreatePage from './pages/admin/ImportCreatePage';           // Tạo phiếu nhập
// import ImportDetailPage from './pages/admin/ImportDetailPage';           // Chi tiết phiếu nhập

// import AdminExportPage from './pages/admin/AdminExportPage';             // Lịch sử xuất
// import ExportCreatePage from './pages/admin/ExportCreatePage';           // Tạo phiếu xuất
// import ExportDetailPage from './pages/admin/ExportDetailPage';           // Chi tiết phiếu xuất
// import ProductCreatePage from './pages/admin/ProductCreatePage';
// import AdminStatsPage from './pages/admin/AdminStatsPage';

// const App = () => {
//   return (
//     <Router>
//        <Routes>
//            {/* === GIAO DIỆN KHÁCH HÀNG (Header Xanh) === */}
//            <Route element={<UserLayout />}>
//                <Route path="/" element={<HomePage />} />
//                <Route path="/search/:keyword" element={<HomePage />} />
//                <Route path="/product/:id" element={<ProductPage />} />
//                <Route path="/cart" element={<CartPage />} />
//                <Route path="/login" element={<LoginPage />} />
//                <Route path="/register" element={<RegisterPage />} />
               
//                <Route path="/profile" element={<ProfilePage />} />
//                <Route path="/shipping" element={<ShippingPage />} />
//                <Route path="/payment" element={<PaymentPage />} />
//                <Route path="/placeorder" element={<PlaceOrderPage />} />
//                <Route path="/order/:id" element={<OrderPage />} />
//                <Route path="/order-success" element={<OrderSuccessPage />} />
//            </Route>

//            {/* === GIAO DIỆN ADMIN (Sidebar Đen) === */}
//            <Route element={<AdminLayout />}>
//               <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              
//               {/* Sản phẩm & Danh mục */}
//               <Route path="/admin/productlist" element={<ProductListPage />} />
//               <Route path="/admin/product/create" element={<ProductCreatePage />} />
//               <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
//               <Route path="/admin/categorylist" element={<CategoryListPage />} />
              
//               {/* Đơn hàng & Thành viên */}
//               <Route path="/admin/orderlist" element={<OrderListPage />} />
//               <Route path="/admin/order/:id" element={<OrderPage />} />
//               <Route path="/admin/userlist" element={<UserListPage />} />

//               {/* --- KHO HÀNG --- */}
//               <Route path="/admin/inventory" element={<AdminInventoryPage />} />
//               <Route path="/admin/inventory/:id" element={<AdminInventoryDetailPage />} /> {/* Route mới */}
              
//               {/* --- NHẬP KHO --- */}
//               <Route path="/admin/import" element={<AdminImportPage />} />
//               <Route path="/admin/import/create" element={<ImportCreatePage />} />
//               <Route path="/admin/import/:id" element={<ImportDetailPage />} /> {/* Route mới */}

//               {/* --- XUẤT KHO --- */}
//               <Route path="/admin/export" element={<AdminExportPage />} />
//               <Route path="/admin/export/create" element={<ExportCreatePage />} />
//               <Route path="/admin/export/:id" element={<ExportDetailPage />} /> {/* Route mới */}
//               <Route path="/admin/stats" element={<AdminStatsPage />} />
//               <Route path="/admin/order/:id" element={<OrderPage />} />
//               {/* <Route path="/admin/shipping-config" element={<AdminShippingPage />} /> */}
//            </Route>

//        </Routes>
//     </Router>
//   );
// };

// export default App;

// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; // <--- 1. THÊM IMPORT NÀY

// --- 1. IMPORT LAYOUTS ---
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';

// --- 2. IMPORT TRANG KHÁCH HÀNG ---
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

// --- 3. IMPORT TRANG ADMIN ---
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminStatsPage from './pages/admin/AdminStatsPage';

// Quản lý Sản phẩm & Danh mục
import ProductListPage from './pages/admin/ProductListPage';
import ProductCreatePage from './pages/admin/ProductCreatePage';
import ProductEditPage from './pages/admin/ProductEditPage';
import CategoryListPage from './pages/admin/CategoryListPage';

// Quản lý Đơn hàng & Thành viên & Vận chuyển
import OrderListPage from './pages/admin/OrderListPage';
import UserListPage from './pages/admin/UserListPage';
import UserEditPage from './pages/admin/UserEditPage';
import AdminShippingPage from './pages/admin/AdminShippingPage';

// --- 4. IMPORT MODULE KHO HÀNG ---
// Tồn kho
import AdminInventoryPage from './pages/admin/AdminInventoryPage';
import AdminInventoryDetailPage from './pages/admin/AdminInventoryDetailPage';

// Nhập kho
import ImportListPage from './pages/admin/ImportListPage';
import ImportCreatePage from './pages/admin/ImportCreatePage';
import ImportDetailPage from './pages/admin/ImportDetailPage';

// Xuất kho
import ExportListPage from './pages/admin/ExportListPage';
import ExportCreatePage from './pages/admin/ExportCreatePage';
import ExportDetailPage from './pages/admin/ExportDetailPage';


const App = () => {
  return (
    // <--- 2. BỌC PROVIDER Ở NGOÀI CÙNG (client-id="test" là tạm thời, OrderPage sẽ tự load ID thật)
    <PayPalScriptProvider options={{ "client-id": "test", components: "buttons", currency: "USD" }}>
      <Router>
         <Routes>
             {/* =========================================================
                 GIAO DIỆN KHÁCH HÀNG (Dùng UserLayout)
             ========================================================= */}
             <Route element={<UserLayout />}>
                 <Route path="/" element={<HomePage />} />
                 <Route path="/search/:keyword" element={<HomePage />} />
                 <Route path="/product/:id" element={<ProductPage />} />
                 <Route path="/cart" element={<CartPage />} />
                 <Route path="/login" element={<LoginPage />} />
                 <Route path="/register" element={<RegisterPage />} />
                 
                 {/* Các trang cần đăng nhập */}
                 <Route path="/profile" element={<ProfilePage />} />
                 <Route path="/shipping" element={<ShippingPage />} />
                 <Route path="/payment" element={<PaymentPage />} />
                 <Route path="/placeorder" element={<PlaceOrderPage />} />
                 <Route path="/order/:id" element={<OrderPage />} />
                 <Route path="/order-success" element={<OrderSuccessPage />} />
             </Route>
  
             {/* =========================================================
                 GIAO DIỆN ADMIN (Dùng AdminLayout)
             ========================================================= */}
             <Route element={<AdminLayout />}>
                
                {/* 1. Tổng quan & Thống kê */}
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/stats" element={<AdminStatsPage />} />
                
                {/* 2. Sản phẩm & Danh mục */}
                <Route path="/admin/productlist" element={<ProductListPage />} />
                <Route path="/admin/product/create" element={<ProductCreatePage />} />
                <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />
                <Route path="/admin/categorylist" element={<CategoryListPage />} />
                
                {/* 3. Đơn hàng & Vận chuyển */}
                <Route path="/admin/orderlist" element={<OrderListPage />} />
                <Route path="/admin/order/:id" element={<OrderPage />} /> 
                <Route path="/admin/shipping-config" element={<AdminShippingPage />} />
  
                {/* 4. Thành viên */}
                <Route path="/admin/userlist" element={<UserListPage />} />
                <Route path="/admin/user/:id/edit" element={<UserEditPage />} />
  
                {/* 5. KHO HÀNG - NHẬP KHO */}
                <Route path="/admin/import" element={<ImportListPage />} />
                <Route path="/admin/import/create" element={<ImportCreatePage />} />
                <Route path="/admin/import/:id" element={<ImportDetailPage />} />
  
                {/* 6. KHO HÀNG - XUẤT KHO */}
                <Route path="/admin/export" element={<ExportListPage />} />
                <Route path="/admin/export/create" element={<ExportCreatePage />} />
                <Route path="/admin/export/:id" element={<ExportDetailPage />} />
  
                {/* 7. TỒN KHO CHI TIẾT */}
                <Route path="/admin/inventory" element={<AdminInventoryPage />} />
                <Route path="/admin/inventory/:id" element={<AdminInventoryDetailPage />} />
                
             </Route>
  
         </Routes>
      </Router>
    </PayPalScriptProvider>
  );
};

export default App;