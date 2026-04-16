import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import thêm useNavigate

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('Nam');

  const navigate = useNavigate(); // 2. Khởi tạo hàm điều hướng

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      // Gửi dữ liệu đăng ký
      await axios.post('http://localhost:5000/api/users', {
        name,
        email,
        password,
        phone,
        address,
        gender
      });

      // --- THAY ĐỔI LOGIC TẠI ĐÂY ---
      
      // 1. Không lưu userInfo vào localStorage nữa (để tránh tự động đăng nhập)
      // localStorage.setItem('userInfo', JSON.stringify(data)); <--- Đã xóa dòng này

      // 2. Thông báo thành công
      alert("Đăng ký thành công! Vui lòng đăng nhập bằng tài khoản vừa tạo.");

      // 3. Chuyển hướng về trang Đăng nhập
      navigate('/login'); 
      
    } catch (error) {
      alert("Đăng ký thất bại: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex justify-center items-center py-10 bg-slate-100 min-h-screen">
      <form onSubmit={submitHandler} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200">
        <h2 className="text-3xl font-black text-center text-slate-800 mb-6 uppercase">Tạo tài khoản mới</h2>
        
        {/* Hàng 1: Tên + Giới tính */}
        <div className="flex gap-4 mb-4">
          <div className="w-2/3">
            <label className="block text-slate-600 font-bold mb-2">Họ và tên</label>
            <input 
              type="text" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nguyễn Văn A" value={name} onChange={(e) => setName(e.target.value)} required
            />
          </div>
          <div className="w-1/3">
            <label className="block text-slate-600 font-bold mb-2">Giới tính</label>
            <select 
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={gender} onChange={(e) => setGender(e.target.value)}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>

        {/* Số điện thoại */}
        <div className="mb-4">
          <label className="block text-slate-600 font-bold mb-2">Số điện thoại</label>
          <input 
            type="text" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="09xxx..." value={phone} onChange={(e) => setPhone(e.target.value)} required
          />
        </div>

        {/* Địa chỉ */}
        <div className="mb-4">
          <label className="block text-slate-600 font-bold mb-2">Địa chỉ giao hàng</label>
          <input 
            type="text" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Số nhà, Đường, Quận, TP..." value={address} onChange={(e) => setAddress(e.target.value)} required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-slate-600 font-bold mb-2">Email</label>
          <input 
            type="email" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
          />
        </div>

        {/* Mật khẩu */}
        <div className="flex gap-4 mb-6">
          <div className="w-1/2">
            <label className="block text-slate-600 font-bold mb-2">Mật khẩu</label>
            <input 
              type="password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-slate-600 font-bold mb-2">Nhập lại MK</label>
            <input 
              type="password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="******" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
            />
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg">
          ĐĂNG KÝ TÀI KHOẢN
        </button>

        <div className="mt-4 text-center">
          <p className="text-slate-500">Đã có tài khoản? <Link to="/login" className="text-blue-600 font-bold hover:underline">Đăng nhập</Link></p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;