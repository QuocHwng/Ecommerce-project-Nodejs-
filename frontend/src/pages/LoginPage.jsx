// import { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom'; // ⚠️ QUAN TRỌNG: Phải có dòng này mới không bị trắng trang

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post('http://localhost:5000/api/users/login', {
//         email,
//         password,
//       });
      
//       alert("Đăng nhập thành công!");
//       localStorage.setItem('userInfo', JSON.stringify(data));
//       if (data.isAdmin) {
//         // Nếu là Admin -> Bay thẳng vào trang Dashboard
//         navigate('/admin/dashboard');
//       } else {
//         // Nếu là Khách -> Về trang chủ hoặc trang trước đó
//         navigate('/');
//       }
      
//     } catch (error) {
//       alert("Đăng nhập thất bại: " + (error.response?.data?.message || error.message));
//     }
//   };

//   return (
//     <div className="flex justify-center items-center py-10 min-h-[80vh]">
//       <form onSubmit={submitHandler} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
//         <h2 className="text-3xl font-black text-center text-slate-800 mb-8 uppercase">Đăng nhập</h2>
        
//         <div className="mb-4">
//           <label className="block text-slate-600 font-bold mb-2">Email Address</label>
//           <input 
//             type="email" 
//             className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Nhập email..." 
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-slate-600 font-bold mb-2">Password</label>
//           <input 
//             type="password" 
//             className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Nhập mật khẩu..." 
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg mb-4">
//           ĐĂNG NHẬP
//         </button>

       
//         <div className="text-center text-slate-500">
//           Chưa có tài khoản? <Link to="/register" className="text-blue-600 font-bold hover:underline">Đăng ký ngay</Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  // 1. Kiểm tra nếu đã đăng nhập từ trước thì đá về đúng nơi quy định ngay
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo) {
      if (userInfo.isAdmin) {
          // Nếu là Admin -> Chuyển hướng cứng về Dashboard
          window.location.href = '/admin/dashboard'; 
      } else {
          // Nếu là Khách -> Chuyển hướng về trang chủ
          navigate(redirect);
      }
    }
  }, [navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // 2. XỬ LÝ CHUYỂN HƯỚNG SAU KHI BẤM NÚT ĐĂNG NHẬP
      if (data.isAdmin) {
          // QUAN TRỌNG: Dùng window.location.href để tải lại toàn bộ trang Admin
          // Điều này giúp tách biệt hoàn toàn giao diện Admin và Khách
          window.location.href = '/admin/dashboard';
      } else {
          // Khách hàng thì dùng navigate cho mượt
          window.location.href = redirect === '/' ? '/' : redirect;
      }

    } catch (error) {
      setError(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
        <h1 className="text-3xl font-black text-slate-800 text-center mb-6 uppercase">
            Đăng Nhập
        </h1>
        
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm font-bold border border-red-200">{error}</div>}

        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded focus:outline-blue-500"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full p-3 border rounded focus:outline-blue-500"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
          >
            ĐĂNG NHẬP
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Chưa có tài khoản?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-blue-600 font-bold hover:underline">
            Đăng ký tại đây
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;