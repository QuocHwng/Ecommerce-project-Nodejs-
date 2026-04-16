// frontend/src/pages/PaymentPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaTruck, FaArrowRight } from 'react-icons/fa';

const PaymentPage = () => {
  const navigate = useNavigate();
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'));

  // Mặc định chọn VNPAY
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');

  useEffect(() => {
    // Nếu chưa nhập địa chỉ thì đá về trang nhập địa chỉ
    if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Lưu phương thức đã chọn vào LocalStorage
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      
      {/* Breadcrumb */}
      <div className="flex justify-center mb-8 text-sm font-bold text-slate-400">
        <span className="text-green-600">Đăng nhập</span> &gt; 
        <span className="text-green-600 mx-2">Địa chỉ</span> &gt; 
        <span className="text-slate-800 mx-2 border-b-2 border-slate-800">Thanh toán</span> &gt; 
        <span className="mx-2">Đặt hàng</span>
      </div>

      <h1 className="text-3xl font-black text-slate-800 uppercase mb-8 border-l-4 border-blue-600 pl-4">
        Chọn phương thức thanh toán
      </h1>

      <form onSubmit={submitHandler} className="space-y-6">
        
        {/* Lựa chọn 1: VNPAY */}
        <div 
            onClick={() => setPaymentMethod('VNPAY')}
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'VNPAY' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
        >
            <input 
                type="radio" 
                id="VNPAY" 
                name="paymentMethod" 
                value="VNPAY" 
                checked={paymentMethod === 'VNPAY'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-blue-600"
            />
            <label htmlFor="VNPAY" className="ml-4 flex-1 cursor-pointer">
                <span className="block font-bold text-slate-800 text-lg">Ví VNPAY / Thẻ ATM / Thẻ Quốc tế</span>
                <span className="text-slate-500 text-sm">Thanh toán an toàn, tiện lợi qua cổng VNPAY</span>
            </label>
            <FaCreditCard className="text-3xl text-blue-600" />
        </div>

        {/* Lựa chọn 2: COD */}
        <div 
            onClick={() => setPaymentMethod('COD')}
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-green-600 bg-green-50' : 'border-slate-200 hover:border-green-300'}`}
        >
            <input 
                type="radio" 
                id="COD" 
                name="paymentMethod" 
                value="COD" // Lưu ý: String này sẽ được lưu xuống DB
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-5 h-5 text-green-600"
            />
            <label htmlFor="COD" className="ml-4 flex-1 cursor-pointer">
                <span className="block font-bold text-slate-800 text-lg">Thanh toán khi nhận hàng (COD)</span>
                <span className="text-slate-500 text-sm">Trả tiền mặt cho shipper khi nhận được hàng</span>
            </label>
            <FaTruck className="text-3xl text-green-600" />
        </div>

        <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold hover:bg-black transition text-lg flex items-center justify-center gap-2 mt-8 shadow-xl"
        >
            TIẾP TỤC <FaArrowRight />
        </button>

      </form>
    </div>
  );
};

export default PaymentPage;