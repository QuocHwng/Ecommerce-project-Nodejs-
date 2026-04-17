// frontend/src/pages/admin/CategoryListPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState(""); // Tên danh mục mới
  const navigate = useNavigate();

  // 1. Hàm lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("https://ecommerce-project-nodejs.onrender.com/api/categories");
      setCategories(data);
    } catch (error) {
      console.error("Lỗi tải danh mục:", error);
    }
  };

  useEffect(() => {
    // Kiểm tra quyền Admin
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.isAdmin) {
      fetchCategories();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // 2. Xử lý THÊM MỚI
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name) return alert("Vui lòng nhập tên danh mục!");

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.post("https://ecommerce-project-nodejs.onrender.com/api/categories", { name }, config);
      
      setName(""); // Xóa ô nhập sau khi thêm
      fetchCategories(); // Load lại danh sách ngay lập tức
      alert("Thêm thành công!");
    } catch (error) {
      alert("Lỗi: " + (error.response?.data?.error || error.message));
    }
  };

  // 3. Xử lý XÓA
  const deleteHandler = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        await axios.delete(`https://ecommerce-project-nodejs.onrender.com/api/categories/${id}`, config);
        fetchCategories(); // Load lại sau khi xóa
      } catch (error) {
        alert("Không thể xóa: " + error.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <Link to="/admin/dashboard" className="text-slate-500 hover:text-slate-800 mb-4 inline-block font-bold">
        &larr; Quay lại Dashboard
      </Link>
      
      <h1 className="text-3xl font-black text-slate-800 uppercase border-l-4 border-blue-600 pl-4 mb-8">
        Quản lý Danh mục
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* CỘT TRÁI: FORM THÊM MỚI */}
        <div className="bg-white p-6 rounded-xl shadow border border-slate-200 h-fit">
            <h3 className="font-bold text-lg mb-4 text-slate-700 uppercase">Tạo danh mục mới</h3>
            <form onSubmit={submitHandler}>
                <label className="block text-sm font-bold mb-2 text-slate-600">Tên danh mục:</label>
                <input 
                    type="text" 
                    className="w-full border p-3 rounded mb-4 focus:outline-blue-500" 
                    placeholder="VD: Điện thoại, Laptop, Phụ kiện..." 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                    + THÊM NGAY
                </button>
            </form>
        </div>

        {/* CỘT PHẢI: BẢNG DANH SÁCH */}
        <div className="md:col-span-2 bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-800 text-white uppercase text-sm">
                    <tr>
                        <th className="p-4">Tên danh mục</th>
                        <th className="p-4 text-right">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {categories.length === 0 && (
                        <tr><td colSpan="2" className="p-4 text-center text-slate-500">Chưa có danh mục nào.</td></tr>
                    )}
                    {categories.map((cat) => (
                        <tr key={cat._id} className="hover:bg-slate-50 transition">
                            <td className="p-4 font-bold text-slate-700">{cat.name}</td>
                            <td className="p-4 text-right">
                                <button 
                                    onClick={() => deleteHandler(cat._id)}
                                    className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-bold text-sm transition"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

      </div>
    </div>
  );
};

export default CategoryListPage;