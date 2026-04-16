import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        // Lấy thông tin User cần sửa
        const { data } = await axios.get(`http://localhost:5000/api/users/${id}`, config);
        
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error(error);
        alert("Không tìm thấy người dùng");
      }
    };
    fetchUser();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // Gửi thông tin cập nhật lên Server
      await axios.put(
        `http://localhost:5000/api/users/${id}`,
        { name, email, isAdmin }, // Gửi kèm trạng thái isAdmin mới
        config
      );

      alert('Cập nhật người dùng thành công!');
      navigate('/admin/userlist');
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Link to="/admin/userlist" className="text-slate-500 hover:text-slate-800 mb-4 inline-block">&larr; Quay lại danh sách</Link>
      
      <h1 className="text-3xl font-black text-slate-800 mb-6 uppercase border-l-4 border-blue-600 pl-4">
        Chỉnh sửa Người dùng
      </h1>

      <form onSubmit={submitHandler} className="bg-white p-8 rounded-xl shadow-md border border-slate-200 space-y-4">
        
        <div>
          <label className="block text-slate-600 font-bold mb-1">Tên hiển thị</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded focus:outline-blue-500" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>

        <div>
          <label className="block text-slate-600 font-bold mb-1">Email</label>
          <input 
            type="email" 
            className="w-full p-2 border rounded focus:outline-blue-500" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>

        {/* --- QUYỀN LỰC NẰM Ở ĐÂY --- */}
        <div className="flex items-center p-4 bg-slate-50 rounded border border-slate-200">
          <input 
            type="checkbox" 
            id="isAdmin" 
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            checked={isAdmin} 
            onChange={(e) => setIsAdmin(e.target.checked)} 
          />
          <label htmlFor="isAdmin" className="ml-3 font-bold text-slate-700 cursor-pointer select-none">
             Cấp quyền Admin (Quản trị viên)
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
          CẬP NHẬT NGƯỜI DÙNG
        </button>

      </form>
    </div>
  );
};

export default UserEditPage;