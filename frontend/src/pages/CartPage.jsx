// frontend/src/pages/CartPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // 👇 HÀM ĐỌC DỮ LIỆU TỪ LOCAL STORAGE
  const loadCartFromStorage = () => {
    const items = localStorage.getItem("cartItems") 
      ? JSON.parse(localStorage.getItem("cartItems")) 
      : [];
    setCartItems(items);
  };

  useEffect(() => {
    // 1. Load ngay khi vào trang
    loadCartFromStorage();

    // 2. 👇 QUAN TRỌNG: Lắng nghe sự kiện thay đổi dữ liệu
    // Giúp cập nhật ngay lập tức nếu có thay đổi từ nơi khác mà không cần F5
    window.addEventListener("storage", loadCartFromStorage);

    return () => {
      window.removeEventListener("storage", loadCartFromStorage);
    };
  }, []);

  // Cập nhật lại LocalStorage và báo hiệu cho toàn app biết
  const updateCart = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem("cartItems", JSON.stringify(newItems));
    
    // Bắn tín hiệu để Header cập nhật lại số lượng ngay
    window.dispatchEvent(new Event("storage")); 
  };

  const removeFromCartHandler = (id) => {
    const newItems = cartItems.filter((x) => x.product !== id);
    updateCart(newItems);
  };

  const increaseQty = (item) => {
    const newQty = item.qty + 1;
    if (newQty > item.countInStock) return; // Không được quá tồn kho
    
    const newItems = cartItems.map((x) => 
       x.product === item.product ? { ...item, qty: newQty } : x
    );
    updateCart(newItems);
  };

  const decreaseQty = (item) => {
    const newQty = item.qty - 1;
    if (newQty < 1) return; // Không được nhỏ hơn 1
    
    const newItems = cartItems.map((x) => 
       x.product === item.product ? { ...item, qty: newQty } : x
    );
    updateCart(newItems);
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const checkoutHandler = () => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
        navigate('/login?redirect=/shipping');
    } else {
        navigate('/shipping');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <Link to="/" className="text-slate-500 hover:text-slate-800 font-bold mb-6 inline-flex items-center gap-2">
         <FaArrowLeft /> Tiếp tục mua sắm
      </Link>

      <h1 className="text-3xl font-black text-slate-800 uppercase mb-8 border-l-4 border-blue-600 pl-4">
        Giỏ hàng ({cartItems.length} sản phẩm)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* DANH SÁCH SẢN PHẨM */}
        <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
                <div className="bg-blue-50 text-blue-700 p-8 rounded-xl border border-blue-100 text-center">
                    <p className="text-lg font-bold mb-4">Giỏ hàng của bạn đang trống!</p>
                    <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {cartItems.map((item) => (
                        <div key={item.product} className="flex flex-col sm:flex-row items-center gap-4 p-4 border-b last:border-0 hover:bg-slate-50 transition">
                            
                            {/* Ảnh */}
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-contain rounded border p-1" />

                            {/* Tên & Giá */}
                            <div className="flex-1 text-center sm:text-left">
                                <Link to={`/product/${item.product}`} className="font-bold text-slate-800 text-lg hover:text-blue-600 line-clamp-2">
                                    {item.name}
                                </Link>
                                <p className="text-red-600 font-black mt-1">{item.price.toLocaleString()}đ</p>
                                <p className="text-xs text-slate-400 mt-1">Kho: {item.countInStock}</p>
                            </div>

                            {/* Bộ chỉnh số lượng (+ -) */}
                            <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                                <button 
                                    onClick={() => decreaseQty(item)}
                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                                >
                                    <FaMinus size={10} />
                                </button>
                                <span className="w-10 text-center font-bold text-slate-800">{item.qty}</span>
                                <button 
                                    onClick={() => increaseQty(item)}
                                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                                >
                                    <FaPlus size={10} />
                                </button>
                            </div>

                            {/* Tổng tiền con */}
                            <div className="font-bold text-slate-700 w-28 text-center hidden sm:block">
                                {(item.qty * item.price).toLocaleString()}đ
                            </div>

                            {/* Nút xóa */}
                            <button 
                                onClick={() => removeFromCartHandler(item.product)}
                                className="text-red-400 hover:text-red-600 p-2 transition hover:bg-red-50 rounded-full"
                                title="Xóa khỏi giỏ"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* TỔNG TIỀN & THANH TOÁN */}
        <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-4">
                <h2 className="text-lg font-black text-slate-800 uppercase mb-6 pb-4 border-b">Thông tin đơn hàng</h2>
                
                <div className="flex justify-between mb-3 text-slate-600">
                    <span>Tạm tính:</span>
                    <span className="font-bold">{totalPrice.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between mb-6 text-slate-600">
                    <span>Giảm giá:</span>
                    <span className="font-bold text-green-600">0đ</span>
                </div>
                
                <div className="flex justify-between text-2xl font-black text-red-600 mb-8 border-t pt-4">
                    <span>Tổng cộng:</span>
                    <span>{totalPrice.toLocaleString()}đ</span>
                </div>

                <button 
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition uppercase shadow-lg shadow-blue-200 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    TIẾN HÀNH ĐẶT HÀNG
                </button>

                <p className="text-xs text-center text-slate-400 mt-4">
                    Chưa bao gồm phí vận chuyển (sẽ tính ở bước sau)
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;