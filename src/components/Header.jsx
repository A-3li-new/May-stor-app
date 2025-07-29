import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Bell, 
  Sun, 
  Moon, 
  Globe,
  Menu,
  X,
  LogOut,
  LogIn,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
// حذف الاستيراد المكرر
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Header = () => {
  const [trackingInput, setTrackingInput] = useState("");
  const [showTrackingSearch, setShowTrackingSearch] = useState(false);
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const { t, toggleLanguage, language } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { notifications, removeNotification, clearNotifications, getUserNotifications } = useNotifications();
  const userNotifications = user ? getUserNotifications(user.id) : [];

  // إضافة مستمع الأحداث للوحة المفاتيح للطريقة السرية Ctrl+Alt+D
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.altKey && event.key === 'd') {
        event.preventDefault();
        if (user && (user.role === 'admin' || user.role === 'employee')) {
          navigate('/admin');
          toast({
            title: 'تم فتح لوحة التحكم',
            description: 'تم فتح لوحة التحكم بنجاح',
            duration: 2000,
          });
        } else {
          toast({
            title: 'غير مصرح لك',
            description: 'يجب تسجيل الدخول كموظف أو مدير للوصول لهذه الصفحة',
            duration: 3000,
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, navigate, toast]);

  // وظيفة للضغط السري على الشعار (5 ضغطات سريعة)
  const handleLogoSecretClick = () => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime;
    
    if (timeDiff < 500) { // إذا كان الضغط خلال نصف ثانية
      const newCount = secretClickCount + 1;
      setSecretClickCount(newCount);
      setLastClickTime(currentTime);
      
      if (newCount >= 5) { // بعد 5 ضغطات سريعة
        setSecretClickCount(0);
        if (user && (user.role === 'admin' || user.role === 'employee')) {
          navigate('/admin');
          toast({
            title: 'تم فتح لوحة التحكم',
            description: 'تم فتح لوحة التحكم بالطريقة السرية',
            duration: 2000,
          });
        } else {
          toast({
            title: 'غير مصرح لك',
            description: 'يجب تسجيل الدخول كموظف أو مدير للوصول لهذه الصفحة',
            duration: 3000,
          });
        }
      }
    } else {
      setSecretClickCount(1);
      setLastClickTime(currentTime);
    }
    
    // إعادة تعيين العداد بعد ثانيتين
    setTimeout(() => {
      setSecretClickCount(0);
    }, 2000);
  };

  const navLinks = [
    { to: '/', text: t('Home') },
    { to: '/products', text: t('Products') },
    { to: '/about', text: t('About') },
    { to: '/contact', text: t('Contact') },
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoSecretClick}
            className="cursor-pointer"
          >
            <img
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/910249c9f1ce9578f1c98ada7b5b2bff.png"
              alt="Dream Boutique Logo"
              className="h-16 w-auto"
            />
          </motion.div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => <NavLinkItem key={link.to} to={link.to}>{link.text}</NavLinkItem>)}
        </nav>

        <div className="hidden md:flex items-center space-x-2">
          {/* تم إخفاء زر لوحة التحكم - الآن يمكن الوصول إليه عبر Ctrl+Alt+D أو 5 ضغطات سريعة على الشعار */}
          <Button variant="ghost" onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
            {isDark ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          </Button>
          <Button variant="ghost" onClick={toggleLanguage} className="text-gray-600 dark:text-gray-300">
            {language === 'ar' ? 'ع' : 'En'}
          </Button>
          <Button variant="ghost" onClick={() => setShowNotifications(!showNotifications)} className="text-gray-600 dark:text-gray-300">
            <Bell className="h-6 w-6" />
            {userNotifications.length > 0 && (
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
            )}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/cart')} className="text-gray-600 dark:text-gray-300">
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
            )}
          </Button>
          {user ? (
            <Button variant="ghost" onClick={logout} className="text-gray-600 dark:text-gray-300">
              <LogOut className="h-6 w-6" />
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/login')} className="text-gray-600 dark:text-gray-300">
              <LogIn className="h-6 w-6" />
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogoSecretClick}
                  className="cursor-pointer"
                >
                  <img
                    src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/910249c9f1ce9578f1c98ada7b5b2bff.png"
                    alt="Dream Boutique Logo"
                    className="h-16 w-auto"
                  />
                </motion.div>
                <Button variant="ghost" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="mt-6">
                {navLinks.map(link => (
                  <NavLinkItem key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}>
                    {link.text}
                  </NavLinkItem>
                ))}
              </nav>

              <div className="mt-6 flex flex-col space-y-4">
                <Button variant="ghost" onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
                  {isDark ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                </Button>
                <Button variant="ghost" onClick={toggleLanguage} className="text-gray-600 dark:text-gray-300">
                  {language === 'ar' ? 'ع' : 'En'}
                </Button>
                <Button variant="ghost" onClick={() => setShowNotifications(!showNotifications)} className="text-gray-600 dark:text-gray-300">
                  <Bell className="h-6 w-6" />
                  {userNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                  )}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/cart')} className="text-gray-600 dark:text-gray-300">
                  <ShoppingCart className="h-6 w-6" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
                  )}
                </Button>
                {user ? (
                  <Button variant="ghost" onClick={logout} className="text-gray-600 dark:text-gray-300">
                    <LogOut className="h-6 w-6" />
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => navigate('/login')} className="text-gray-600 dark:text-gray-300">
                    <LogIn className="h-6 w-6" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {showNotifications && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">{t('Notifications')}</h3>
            {userNotifications.length === 0 ? (
              <p>{t('No new notifications')}</p>
            ) : (
              <ul className="space-y-2">
                {userNotifications.map(notification => (
                  <li key={notification.id} className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <span>{notification.message}</span>
                    <button onClick={() => removeNotification(notification.id)} className="text-red-500 hover:text-red-600">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="ghost" onClick={clearNotifications} className="mt-4 text-red-500 hover:text-red-600">
              {t('Clear all')}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

const NavLinkItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ${isActive ? 'font-medium' : ''}`
    }
  >
    {children}
  </NavLink>
);

export default Header;