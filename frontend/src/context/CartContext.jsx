// frontend/src/context/CartContext.jsx
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. QUẢN LÝ GIỎ HÀNG
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // 2. QUẢN LÝ ĐỊA CHỈ GIAO HÀNG
  const [shippingAddress, setShippingAddress] = useState(() => {
    const storedAddress = localStorage.getItem('shippingAddress');
    return storedAddress ? JSON.parse(storedAddress) : {};
  });

  // 3. QUẢN LÝ PHƯƠNG THỨC THANH TOÁN (Mặc định VNPay)
  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem('paymentMethod') || 'VNPay';
  });

  // --- CÁC HÀM XỬ LÝ ---

  // Thêm sản phẩm vào giỏ
  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      // Nếu có rồi -> Cập nhật số lượng
      const newCart = cartItems.map((x) =>
        x._id === existItem._id ? { ...product, qty } : x
      );
      setCartItems(newCart);
    } else {
      // Nếu chưa có -> Thêm mới
      setCartItems([...cartItems, { ...product, qty }]);
    }
  };

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  // Lưu địa chỉ giao hàng
  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  // Lưu phương thức thanh toán
  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
    localStorage.setItem('paymentMethod', method);
  };

  // Tự động lưu giỏ hàng vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ 
      cartItems,
      setCartItems, 
      addToCart, 
      removeFromCart,
      shippingAddress,
      saveShippingAddress,
      paymentMethod,
      savePaymentMethod
    }}>
      {children}
    </CartContext.Provider>
  );
};