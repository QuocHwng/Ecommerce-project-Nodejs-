// frontend/src/pages/admin/ProductEditPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Các state cho sản phẩm
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(""); // Lưu danh mục được chọn
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  
  // 👇 MỚI: State để chứa danh sách danh mục lấy từ DB
  const [categories, setCategories] = useState([]); 
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // 1. Hàm lấy thông tin sản phẩm cần sửa
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://ecommerce-project-nodejs.onrender.com/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      }
    };

    // 2. 👇 MỚI: Hàm lấy danh sách danh mục để đổ vào Dropdown
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("https://ecommerce-project-nodejs.onrender.com/api/categories");
        setCategories(data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [id]);

  // Xử lý upload ảnh
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post("https://ecommerce-project-nodejs.onrender.com/api/upload", formData, config);
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  // Xử lý lưu sản phẩm
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.put(
        `https://ecommerce-project-nodejs.onrender.com/api/products/${id}`,
        { name, price, image, brand, category, countInStock, description },
        config
      );
      
      alert("Cập nhật thành công!");
      navigate("/admin/productlist");
    } catch (error) {
      alert("Lỗi cập nhật: " + error.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link to="/admin/productlist" className="text-slate-500 hover:text-slate-800 mb-4 inline-block font-bold">
        &larr; Quay lại danh sách
      </Link>
      
      <h1 className="text-3xl font-black text-slate-800 uppercase border-l-4 border-blue-600 pl-4 mb-8">
        Chỉnh sửa sản phẩm
      </h1>

      <div className="bg-white p-8 rounded-xl shadow border border-slate-200">
        <form onSubmit={submitHandler} className="space-y-6">
            
            {/* Tên sản phẩm */}
            <div>
                <label className="block text-slate-700 font-bold mb-2">Tên sản phẩm</label>
                <input 
                    type="text" 
                    className="w-full border p-3 rounded focus:outline-blue-500" 
                    value={name} onChange={(e) => setName(e.target.value)} 
                />
            </div>

            {/* Giá & Tồn kho */}
            
                <div>
                    <label className="block text-slate-700 font-bold mb-2">Giá (VNĐ)</label>
                    <input 
                        type="number" 
                        className="w-full border p-3 rounded focus:outline-blue-500" 
                        value={price} onChange={(e) => setPrice(e.target.value)} 
                    />
                </div>
                
            

            {/* Upload Ảnh */}
            <div>
                <label className="block text-slate-700 font-bold mb-2">Hình ảnh</label>
                <div className="flex gap-2 mb-2">
                    <input 
                        type="text" 
                        className="w-full border p-3 rounded bg-slate-100 text-slate-500" 
                        value={image} readOnly 
                    />
                    <label className="bg-blue-600 text-white px-4 py-3 rounded cursor-pointer hover:bg-blue-700 font-bold">
                        Chọn ảnh
                        <input type="file" className="hidden" onChange={uploadFileHandler} />
                    </label>
                </div>
                {uploading && <p className="text-sm text-blue-500">Đang tải ảnh lên...</p>}
            </div>

            {/* Thương hiệu & Danh mục */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-slate-700 font-bold mb-2">Thương hiệu</label>
                    <input 
                        type="text" 
                        className="w-full border p-3 rounded focus:outline-blue-500" 
                        placeholder="VD: Logitech, Apple..."
                        value={brand} onChange={(e) => setBrand(e.target.value)} 
                    />
                </div>
                
                {/* 👇 ĐÃ SỬA THÀNH DROPDOWN (SELECT) */}
                <div>
                    <label className="block text-slate-700 font-bold mb-2">Danh mục</label>
                    <select 
                        className="w-full border p-3 rounded focus:outline-blue-500 bg-white"
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Mô tả */}
            <div>
                <label className="block text-slate-700 font-bold mb-2">Mô tả</label>
                <textarea 
                    className="w-full border p-3 rounded h-32 focus:outline-blue-500" 
                    value={description} onChange={(e) => setDescription(e.target.value)} 
                ></textarea>
            </div>

            <button type="submit" className="w-full bg-slate-800 text-white py-4 rounded-lg font-bold text-lg hover:bg-black transition shadow-lg">
                CẬP NHẬT SẢN PHẨM
            </button>

        </form>
      </div>
    </div>
  );
};

export default ProductEditPage;