import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Dummy users for demonstration
const dummyUsers = {
  admin: { password: 'admin', role: 'admin' },
  employee: { password: 'employee', role: 'employee' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dream-boutique-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('dream-boutique-user');
    } finally {
      setLoading(false);
    }
  }, []);

  // تعديل دالة تسجيل الدخول لتبحث في بيانات الموظفين من localStorage
  const login = (phoneOrEmail, password) => {
    // جلب جميع الموظفين من localStorage
    const savedUsers = localStorage.getItem('dream-boutique-users');
    let users = [];
    try {
      users = savedUsers ? JSON.parse(savedUsers) : [];
    } catch (e) {
      users = [];
    }
    // البحث عن الموظف حسب رقم الهاتف أو البريد الإلكتروني
    const foundUser = users.find(u =>
      (u.phone === phoneOrEmail || (u.email && u.email === phoneOrEmail)) && u.password === password
    );
    if (foundUser) {
      const userData = { ...foundUser };
      setUser(userData);
      localStorage.setItem('dream-boutique-user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, message: 'رقم الهاتف أو كلمة المرور غير صحيحة' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dream-boutique-user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};