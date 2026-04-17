// frontend/src/pages/admin/ProductCreatePage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaSave, FaBox, FaUpload } from "react-icons/fa"; // <--- Thêm FaUpload

const ProductCreatePage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(""); 
  const [description, setDescription] = useState("");
  
  // State xử lý upload
  const [uploading, setUploading] = useState(false); 
  const [categories, setCategories] = useState([]); 

  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const { data } = await axios.get("https://ecommerce-project-nodejs.onrender.com/api/categories");
            setCategories(data);
            if (data && data.length > 0) {
                setCategory(data[0].name); 
            }
        } catch (error) {
            console.error("Lỗi lấy danh mục:", error);
        }
    };
    fetchCategories();
  }, []);

  // --- HÀM XỬ LÝ UPLOAD ẢNH (MỚI THÊM) ---
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      // Gọi vào API upload bạn ĐÃ CÓ sẵn ở Backend
      const { data } = await axios.post('https://ecommerce-project-nodejs.onrender.com/api/upload', formData, config);

      // Backend trả về đường dẫn (vd: /uploads/image-123.jpg)
      // Ta nối thêm domain vào để hiển thị được
      setImage(`https://ecommerce-project-nodejs.onrender.com${data}`);
      setUploading(false);

    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Lỗi khi upload ảnh!');
    }
  };
  // ----------------------------------------

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.post(
        'https://ecommerce-project-nodejs.onrender.com/api/products',
        {
          name,
          price,
          image,
          brand,
          category,
          description,
        },
        config
      );
      
      alert("Thêm sản phẩm mới thành công!");
      navigate("/admin/productlist");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/admin/productlist" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-bold">
         <FaArrowLeft /> Quay lại danh sách
      </Link>

      <h1 className="text-2xl font-black text-slate-800 uppercase mb-6 border-l-4 border-green-600 pl-4">
          Thêm sản phẩm mới
      </h1>

      <form onSubmit={submitHandler} className="bg-white p-8 rounded-xl shadow border border-slate-200 space-y-6">
          
          <div>
              <label className="block text-slate-700 font-bold mb-2">Tên sản phẩm</label>
              <input 
                  type="text" required
                  className="w-full border p-3 rounded focus:outline-green-500"
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên sản phẩm..."
              />
          </div>

          <div>
              <label className="block text-slate-700 font-bold mb-2">Giá bán (VNĐ)</label>
              <input 
                  type="number" required min="0"
                  className="w-full border p-3 rounded focus:outline-green-500"
                  value={price} onChange={(e) => setPrice(e.target.value)}
              />
          </div>

          {/* --- KHU VỰC CHỌN ẢNH (ĐÃ CẬP NHẬT) --- */}
          <div>
              <label className="block text-slate-700 font-bold mb-2">Hình ảnh</label>
              <div className="flex flex-col gap-3">
                  {/* Ô nhập link (giữ nguyên phòng khi muốn paste link mạng) */}
                  <input 
                      type="text" required
                      className="w-full border p-3 rounded focus:outline-green-500 bg-slate-50"
                      value={image} 
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Link ảnh sẽ hiện ở đây..."
                      readOnly // Có thể để readOnly nếu muốn bắt buộc upload
                  />
                  
                  {/* Nút upload file */}
                  <div className="relative">
                      <label className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded cursor-pointer w-fit transition">
                          <FaUpload /> 
                          {uploading ? 'Đang tải lên...' : 'Chọn ảnh từ máy'}
                          <input 
                              type="file" 
                              className="hidden" 
                              onChange={uploadFileHandler}
                          />
                      </label>
                  </div>

                  {/* Hiện ảnh xem trước nếu đã có link */}
                  {image && (
                      <div className="mt-2 p-2 border rounded bg-slate-50 inline-block">
                          <p className="text-xs text-slate-400 mb-1">Xem trước:</p>
                          <img src={image} alt="Preview" className="h-32 w-auto object-contain" />
                      </div>
                  )}
              </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
              <div>
                  <label className="block text-slate-700 font-bold mb-2">Thương hiệu</label>
                  <input 
                      type="text" required
                      className="w-full border p-3 rounded focus:outline-green-500"
                      value={brand} onChange={(e) => setBrand(e.target.value)}
                  />
              </div>

              <div>
                  <label className="block text-slate-700 font-bold mb-2">Danh mục</label>
                  <select 
                      className="w-full border p-3 rounded focus:outline-green-500 bg-white"
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      required
                  >
                      {categories.length === 0 ? (
                          <option value="">Đang tải danh mục...</option>
                      ) : (
                          categories.map((cat) => (
                              <option key={cat._id} value={cat.name}>{cat.name}</option>
                          ))
                      )}
                  </select>
              </div>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-slate-500 text-sm">
              <FaBox className="inline mr-2"/> 
              Sản phẩm mới sẽ có <strong>Tồn kho = 0</strong>. Vui lòng tạo phiếu nhập kho để thêm số lượng.
          </div>

          <div>
              <label className="block text-slate-700 font-bold mb-2">Mô tả chi tiết</label>
              <textarea 
                  rows="5" required
                  className="w-full border p-3 rounded focus:outline-green-500"
                  value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả sản phẩm..."
              ></textarea>
          </div>

          <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition flex justify-center items-center gap-2">
              <FaSave /> LƯU SẢN PHẨM
          </button>
      </form>
    </div>
  );
};

export default ProductCreatePage;