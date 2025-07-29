// src/contexts/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDiscount } from './DiscountContext'; // <--- أضف هذا السطر لاستيراد DiscountContext

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // <--- أضف هذا السطر لتتبع الكوبون المطبق
  const { applyDiscounts } = useDiscount(); // <--- أضف هذا السطر لاستخدام دالة applyDiscounts

  useEffect(() => {
    const savedCart = localStorage.getItem('dream-boutique-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    // يمكنك أيضاً تحميل الكوبون المطبق إذا كنت تريد حفظه في localStorage
    const savedCoupon = localStorage.getItem('dream-boutique-applied-coupon');
    if (savedCoupon) {
      setAppliedCoupon(JSON.parse(savedCoupon));
    }
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem('dream-boutique-cart', JSON.stringify(updatedCart));
  };

  // <--- أضف هذه الدالة الجديدة لتطبيق الكوبون
  const applyCoupon = (couponCode) => {
    // هنا نقوم فقط بحفظ الكوبون، وسيتم حساب الخصم في cartTotalDiscounted
    setAppliedCoupon({ code: couponCode });
    localStorage.setItem('dream-boutique-applied-coupon', JSON.stringify({ code: couponCode }));
  };

  // <--- أضف هذه الدالة الجديدة لإزالة الكوبون المطبق
  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('dream-boutique-applied-coupon');
  };

  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      const updatedCart = cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCart(updatedCart);
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      saveCart(updatedCart);
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    saveCart(updatedCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      const updatedCart = cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveCart(updatedCart);
    }
  };

  const clearCart = () => {
    saveCart([]);
    removeCoupon(); // <--- قم بإزالة الكوبون عند مسح السلة
  };

  // هذا هو الإجمالي الأصلي بدون خصم
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // <--- هذا هو الإجمالي بعد تطبيق الخصومات
  const { finalTotal: cartTotalDiscounted, appliedDiscount: currentAppliedDiscount } = 
    applyDiscounts(cartTotal, appliedCoupon ? appliedCoupon.code : null);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal, // الإجمالي قبل الخصم
      cartTotalDiscounted, // الإجمالي بعد الخصم
      applyCoupon, // دالة لتطبيق كوبون
      removeCoupon, // دالة لإزالة الكوبون
      currentAppliedDiscount // معلومات حول الخصم الحالي المطبق (الكوبون أو الخصم التلقائي)
    }}>
      {children}
    </CartContext.Provider>
  );
};
