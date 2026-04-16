import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingPage = () => {
  const { shippingAddress, saveShippingAddress } = useContext(CartContext);
  const navigate = useNavigate();

  // Khởi tạo state bằng dữ liệu cũ (nếu có)
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [phone, setPhone] = useState(shippingAddress.phone || '');
  const [country, setCountry] = useState(shippingAddress.country || 'Việt Nam');

  // Nếu chưa đăng nhập thì đá về login
  useEffect(() => {
     if(!localStorage.getItem('userInfo')) {
         navigate('/login');
     }
  }, [navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Lưu địa chỉ vào kho chứa
    saveShippingAddress({ address, city, phone, country });
    // Chuyển sang bước tiếp theo: Thanh toán
    navigate('/payment');
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      {/* Thanh tiến trình: Đang ở bước 2 */}
      <CheckoutSteps step1 step2 />

      <h1 className="text-3xl font-black text-slate-800 mb-6 uppercase text-center">
        Địa chỉ giao hàng
      </h1>

      <form onSubmit={submitHandler} className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        
        {/* Địa chỉ cụ thể */}
        <div className="mb-4">
          <label className="block text-slate-600 font-bold mb-2">Địa chỉ nhận hàng</label>
          <input 
            type="text" 
            placeholder="Số nhà, tên đường, phường/xã..." 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
          />
        </div>

        {/* Thành phố */}
        <div className="mb-4">
          <label className="block text-slate-600 font-bold mb-2">Tỉnh / Thành phố</label>
          <input 
            type="text" 
            placeholder="Ví dụ: TP. Hồ Chí Minh" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            required 
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
          />
        </div>

        {/* Số điện thoại */}
        <div className="mb-4">
          <label className="block text-slate-600 font-bold mb-2">Số điện thoại người nhận</label>
          <input 
            type="text" 
            placeholder="09xx..." 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
            className="w-full p-3 border rounded-lg focus:outline-blue-500"
          />
        </div>

        {/* Quốc gia (Mặc định VN) */}
        <div className="mb-6">
          <label className="block text-slate-600 font-bold mb-2">Quốc gia</label>
          <input 
            type="text" 
            value={country} 
            onChange={(e) => setCountry(e.target.value)} 
            required 
            className="w-full p-3 border rounded-lg focus:outline-blue-500 bg-slate-100"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg">
          TIẾP TỤC ĐẾN THANH TOÁN
        </button>
      </form>
    </div>
  );
};

export default ShippingPage;