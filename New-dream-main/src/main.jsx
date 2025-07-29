// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // قد تكون عندك '@/App' وهذا صحيح أيضاً
import './index.css';

// استيراد جميع الـ Context Providers التي لديك
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext'; // إذا كنت تستخدمها
import { DiscountProvider } from './contexts/DiscountContext'; // هذا هو الاستيراد الجديد الذي أضفناه

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> {/* إذا كنت تستخدم ThemeProvider، ضعه هنا */}
      <LanguageProvider>
        <AuthProvider>
          {/* DiscountProvider يجب أن يلف CartProvider */}
          <DiscountProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </DiscountProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
);