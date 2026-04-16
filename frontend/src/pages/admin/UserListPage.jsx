// frontend/src/pages/admin/UserListPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // --- 1. HÀM LẤY DANH SÁCH USER ---
  const fetchUsers = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.get('http://localhost:5000/api/users', config);
      setUsers(data);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
    }
  };

  // --- 2. KIỂM TRA QUYỀN ADMIN KHI VÀO TRANG ---
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.isAdmin) {
      fetchUsers();
    } else {
      navigate('/login'); // Không phải Admin thì đuổi về Login
    }
  }, [navigate]);

  // --- 3. HÀM XÓA USER ---
  const deleteHandler = async (id) => {
    if (window.confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác!')) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        await axios.delete(`http://localhost:5000/api/users/${id}`, config);
        
        alert('Đã xóa thành công!');
        fetchUsers(); // Tải lại danh sách sau khi xóa
      } catch (error) {
        alert('Lỗi xóa người dùng: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      
      {/* --- TIÊU ĐỀ & NÚT DẪN SANG BIỂU ĐỒ --- */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-black text-slate-800 uppercase border-l-4 border-blue-600 pl-4">
            Quản lý Người dùng
        </h1>
        
        {/* Nút bấm để xem Biểu đồ (Giải quyết vấn đề bạn không thấy báo cáo) */}
        <Link 
            to="/admin/user-stats" 
            className="bg-pink-600 text-white px-5 py-2 rounded-lg shadow hover:bg-pink-700 transition flex items-center gap-2 font-bold"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M6 16.5v2.25a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0024 18.75V7.5a2.25 2.25 0 00-2.25-2.25H13.5m-7.5-3v13.5m-3-13.5h22.5" />
            </svg>
            Xem biểu đồ tăng trưởng
        </Link>
      </div>
      
      {/* --- BẢNG DANH SÁCH USER --- */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-white uppercase text-sm">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Tên hiển thị</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Vai trò</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-slate-50 transition last:border-0">
                <td className="p-4 font-mono text-xs text-slate-500">{user._id}</td>
                <td className="p-4 font-bold text-slate-800">{user.name}</td>
                <td className="p-4 text-blue-600">
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                
                {/* Cột Admin */}
                <td className="p-4 text-center">
                  {user.isAdmin ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 shadow-sm">
                        ✔ Quản trị viên
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm">Khách hàng</span>
                  )}
                </td>

                {/* Cột Nút bấm */}
                <td className="p-4 text-center flex justify-center gap-2">
                   {/* Link Sửa */}
                   <Link 
                     to={`/admin/user/${user._id}/edit`} 
                     className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100 transition"
                     title="Sửa / Phân quyền"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                     </svg>
                   </Link>
                   
                   {/* Nút Xóa */}
                   <button 
                      onClick={() => deleteHandler(user._id)}
                      className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100 transition"
                      title="Xóa người dùng"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                     </svg>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserListPage;