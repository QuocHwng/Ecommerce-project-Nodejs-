// frontend/src/pages/ProductPage.jsx
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMinus, FaPlus, FaCartPlus, FaCheckCircle } from 'react-icons/fa';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [qty, setQty] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError('Không tìm thấy sản phẩm');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const increaseQty = () => {
    if (product && qty < product.countInStock) {
        setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
        setQty(qty - 1);
    }
  };

  // 👇 LOGIC QUAN TRỌNG: GỘP SẢN PHẨM TRÙNG
  const addToCartHandler = () => {
    let cartItems = localStorage.getItem('cartItems') 
      ? JSON.parse(localStorage.getItem('cartItems')) 
      : [];

    const newItem = {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty: Number(qty),
    };

    // Tìm xem sản phẩm này đã có trong giỏ chưa (So sánh ID dạng chuỗi)
    const existItem = cartItems.find((x) => x.product.toString() === newItem.product.toString());

    if (existItem) {
      // TRƯỜNG HỢP ĐÃ CÓ: CỘNG DỒN SỐ LƯỢNG
      const newQty = Number(existItem.qty) + Number(newItem.qty);
      
      // Kiểm tra tồn kho
      if (newQty > product.countInStock) {
          alert(`Bạn đã có ${existItem.qty} cái trong giỏ. Kho chỉ còn ${product.countInStock}, không thể thêm quá số lượng này!`);
          return;
      }

      newItem.qty = newQty; // Cập nhật số lượng mới cho item
      
      // Thay thế item cũ bằng item mới (đã gộp số lượng)
      cartItems = cartItems.map((x) => 
        x.product.toString() === existItem.product.toString() ? newItem : x
      );
    } else {
      // TRƯỜNG HỢP CHƯA CÓ: THÊM MỚI VÀO CUỐI
      cartItems.push(newItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Cập nhật Header
    window.dispatchEvent(new Event("storage"));

    // Hiển thị thông báo
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
        alert('Vui lòng chọn số sao!');
        return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`http://localhost:5000/api/products/${id}/reviews`, { rating, comment }, config);
      alert('Đánh giá thành công!');
      setRating(0);
      setComment('');
      fetchProduct();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 relative">
      
      {showSuccess && (
        <div className="fixed top-20 right-5 z-50 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce">
            <FaCheckCircle className="text-2xl" />
            <div>
                <h4 className="font-bold text-lg">Đã cập nhật giỏ hàng!</h4>
                <p className="text-sm">Số lượng sản phẩm đã được cộng thêm.</p>
            </div>
        </div>
      )}

      <Link to="/" className="text-slate-500 hover:text-slate-800 font-bold mb-6 inline-block">
         &larr; Quay lại
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <img src={product.image} alt={product.name} className="max-h-[400px] object-contain hover:scale-105 transition duration-500" />
        </div>

        <div>
            <h1 className="text-3xl font-black text-slate-800 uppercase mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="text-yellow-500 font-bold text-lg">
                    {'★'.repeat(Math.round(product.rating))} 
                    <span className="text-slate-300">{'★'.repeat(5 - Math.round(product.rating))}</span>
                </div>
                <span className="text-slate-500">({product.numReviews} đánh giá)</span>
            </div>
            
            <div className="text-4xl font-black text-red-600 mb-6 border-b border-slate-100 pb-6">
                {product.price?.toLocaleString()}đ
            </div>

            <p className="text-slate-600 leading-relaxed mb-8 text-lg">{product.description}</p>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 w-full md:w-96">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                    <span className="text-slate-600 font-bold">Trạng thái kho:</span>
                    {product.countInStock > 0 ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold text-sm">● Còn hàng </span>
                    ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded font-bold text-sm">● Hết hàng</span>
                    )}
                </div>

                {product.countInStock > 0 && (
                    <div className="mb-8">
                        <span className="text-slate-600 font-bold block mb-3">Chọn số lượng:</span>
                        <div className="flex items-center">
                            <button onClick={decreaseQty} className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-l flex items-center justify-center text-slate-600 transition"><FaMinus /></button>
                            <input type="text" value={qty} readOnly className="w-16 h-12 border-t border-b border-slate-100 text-center font-bold text-lg text-slate-800 focus:outline-none"/>
                            <button onClick={increaseQty} className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-r flex items-center justify-center text-slate-600 transition"><FaPlus /></button>
                        </div>
                    </div>
                )}

                <button 
                    onClick={addToCartHandler}
                    disabled={product.countInStock === 0}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-blue-200 flex items-center justify-center gap-2 text-lg"
                >
                    <FaCartPlus />
                    {product.countInStock === 0 ? 'TẠM HẾT HÀNG' : 'THÊM VÀO GIỎ NGAY'}
                </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t pt-10 mt-10">
          <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase mb-6">Đánh giá từ khách hàng</h2>
              {product.reviews.length === 0 && <div className="text-slate-500 italic">Chưa có đánh giá nào.</div>}
              <div className="space-y-4">
                  {product.reviews.map((review) => (
                      <div key={review._id} className="bg-slate-50 p-4 rounded-lg">
                          <div className="flex justify-between font-bold text-slate-800">
                              <span>{review.name}</span>
                              <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                          </div>
                          <p className="text-slate-600 mt-2">{review.comment}</p>
                      </div>
                  ))}
              </div>
          </div>

          <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase mb-6">Viết đánh giá</h2>
              {userInfo ? (
                  <form onSubmit={submitReviewHandler} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
                      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full border p-3 rounded">
                          <option value="">Chọn số sao...</option>
                          <option value="5">5 - Tuyệt vời</option>
                          <option value="4">4 - Tốt</option>
                          <option value="3">3 - Khá</option>
                          <option value="2">2 - Trung bình</option>
                          <option value="1">1 - Tệ</option>
                      </select>
                      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows="3" className="w-full border p-3 rounded" placeholder="Nhập bình luận..."></textarea>
                      <button className="bg-slate-800 text-white px-6 py-3 rounded font-bold hover:bg-black w-full">GỬI ĐÁNH GIÁ</button>
                  </form>
              ) : (
                  <p>Vui lòng <Link to="/login" className="text-blue-600 font-bold">đăng nhập</Link> để đánh giá.</p>
              )}
          </div>
      </div>
    </div>
  );
};

export default ProductPage;