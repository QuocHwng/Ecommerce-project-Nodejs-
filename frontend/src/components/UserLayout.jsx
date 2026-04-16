// frontend/src/components/UserLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header chỉ hiện ở UserLayout */}
      <Header /> 
      
      <main className="flex-1 bg-slate-50 pb-10">
        {/* Nơi hiển thị nội dung các trang con (Home, Product, Cart...) */}
        <Outlet /> 
      </main>

      {/* Footer chỉ hiện ở UserLayout */}
      <Footer />
    </div>
  );
};

export default UserLayout;