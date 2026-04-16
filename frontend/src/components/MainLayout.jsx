// frontend/src/components/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <>
      <Header /> {/* Header có tìm kiếm, giỏ hàng... */}
      <main className="flex-grow bg-slate-50 min-h-screen">
        <Outlet /> {/* Nơi hiển thị các trang con (Home, Product...) */}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;