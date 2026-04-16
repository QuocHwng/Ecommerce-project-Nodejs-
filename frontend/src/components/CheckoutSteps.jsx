import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-center items-center mb-8 space-x-4 text-sm font-bold uppercase tracking-wide">
      {/* Bước 1: Đăng nhập */}
      <div className={step1 ? 'text-blue-600' : 'text-slate-400'}>
        {step1 ? <Link to="/login">Đăng nhập</Link> : <span>Đăng nhập</span>}
      </div>
      <span className="text-slate-300">/</span>

      {/* Bước 2: Địa chỉ */}
      <div className={step2 ? 'text-blue-600' : 'text-slate-400'}>
        {step2 ? <Link to="/shipping">Địa chỉ</Link> : <span>Địa chỉ</span>}
      </div>
      <span className="text-slate-300">/</span>

      {/* Bước 3: Thanh toán */}
      <div className={step3 ? 'text-blue-600' : 'text-slate-400'}>
        {step3 ? <Link to="/payment">Thanh toán</Link> : <span>Thanh toán</span>}
      </div>
      <span className="text-slate-300">/</span>

      {/* Bước 4: Đặt hàng */}
      <div className={step4 ? 'text-blue-600' : 'text-slate-400'}>
        {step4 ? <Link to="/placeorder">Đặt hàng</Link> : <span>Đặt hàng</span>}
      </div>
    </div>
  );
};

export default CheckoutSteps;