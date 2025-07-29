import React, { useState } from 'react';
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

  const handleFeatureClick = () => {
    toast({
      title: t('featureNotImplemented'),
      description: t('featureNotImplementedDesc'),
      duration: 3000,
    });
  };

  const handleLogout = () => {
    logout();
    toast({ title: t('loggedOut'), duration: 2000 });
    navigate('/');
  };

  const navLinks = [
    { to: "/", text: t('home') },
    { to: "/brand/classic.color.shop", text: t('classicColorShop') },
    { to: "/brand/ghyma68", text: t('ghyma68') },
    { to: "/brand/designerr.mix", text: t('designerrMix') },
    { to: "/about-us", text: t('aboutUs') },
  ];

  const NavLinkItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-medium transition-colors hover:text-primary ${
          isActive ? 'text-primary' : 'text-muted-foreground'
        }`
      }
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* كل عناصر الهيدر داخل عنصر header فقط */}
      {showTrackingSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowTrackingSearch(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-card rounded-xl p-6 w-full max-w-md shadow-xl border flex flex-col gap-4 items-center">
            <h3 className="text-lg font-bold text-foreground mb-2">{t('tracking')}</h3>
            <input type="text" value={trackingInput} onChange={e => setTrackingInput(e.target.value)} placeholder={t('trackingNumber')} className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            <Button variant="default" className="w-full" onClick={() => {
              if (trackingInput.trim()) {
                setShowTrackingSearch(false);
                navigate(`/tracking?order=${trackingInput.trim()}`);
                setTrackingInput("");
              }
            }}>{t('search')}</Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowTrackingSearch(false)}>{t('cancel')}</Button>
          </motion.div>
        </div>
      )}
      <div className="container mx-auto px-4">
        <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMenuOpen(false)}>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
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
          {/* زر لوحة الإدارة يظهر فقط إذا كان المستخدم موظف أو مدير */}
          {user && (user.role === 'admin' || user.role === 'employee') && (
            <Button variant="outline" size="sm" onClick={() => navigate('/admin')} className="flex gap-2">
              <span>لوحة الإدارة</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={() => setShowTrackingSearch(true)}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate('/cart')} className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)} className="relative">
              <Bell className="h-5 w-5" />
              {userNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-background"></span>
              )}
            </Button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-card border rounded-xl shadow-lg z-50">
                <div className="p-4 border-b font-bold text-lg flex justify-between items-center">
                  <span>{t('notifications')}</span>
                  {userNotifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => clearNotifications(user?.id)}>{t('clear')}</Button>
                  )}
                </div>
                <ul className="max-h-64 overflow-y-auto">
                  {userNotifications.length === 0 ? (
                    <li className="p-4 text-muted-foreground text-center">{t('noNotifications')}</li>
                  ) : (
                    userNotifications.map(n => (
                      <li key={n.id} className="flex items-start gap-2 p-4 border-b last:border-b-0">
                        <span className={`inline-block w-2 h-2 rounded-full mt-2 ${n.type === 'offer' ? 'bg-green-500' : n.type === 'order' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                        <div className="flex-grow">
                          <div className="font-medium">{n.message}</div>
                          {n.time && <div className="text-xs text-muted-foreground">{n.time}</div>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeNotification(n.id)}><X className="h-4 w-4" /></Button>
                      </li>
                    ))
                  )}
                </ul>
                <div className="p-2 text-center">
                  <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>{t('close')}</Button>
                </div>
              </div>
            )}
          </div>

          {user ? (
             <Button variant="outline" size="sm" onClick={handleLogout} className="flex gap-2">
              <LogOut className="h-4 w-4" />
              <span>{t('logout')}</span>
             </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/login')} className="flex gap-2">
              <LogIn className="h-4 w-4" />
              <span>{t('login')}</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
          </Button>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t py-4"
        >
          <nav className="flex flex-col space-y-4 mb-4">
            {navLinks.map(link => <NavLinkItem key={link.to} to={link.to}>{link.text}</NavLinkItem>)}
          </nav>
          <div className="border-t pt-4 flex justify-around">
             <Button variant="ghost" onClick={() => { navigate('/cart'); setIsMenuOpen(false); }} className="flex flex-col items-center space-y-1 h-auto">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-xs">{t('cart')}</span>
            </Button>
            <Button variant="ghost" onClick={() => handleFeatureClick('notifications')} className="flex flex-col items-center space-y-1 h-auto">
              <Bell className="h-5 w-5" />
              <span className="text-xs">{t('notifications')}</span>
            </Button>
            {user ? (
               <Button variant="ghost" onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex flex-col items-center space-y-1 h-auto">
                 <LogOut className="h-5 w-5" />
                 <span className="text-xs">{t('logout')}</span>
               </Button>
            ) : (
              <Button variant="ghost" onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="flex flex-col items-center space-y-1 h-auto">
                <LogIn className="h-5 w-5" />
                <span className="text-xs">{t('login')}</span>
              </Button>
            )}
             <Button variant="ghost" onClick={toggleTheme} className="flex flex-col items-center space-y-1 h-auto">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="text-xs">{isDark ? t('lightTheme') : t('darkTheme')}</span>
            </Button>
            <Button variant="ghost" onClick={toggleLanguage} className="flex flex-col items-center space-y-1 h-auto">
              <Globe className="h-5 w-5" />
              <span className="text-xs">{language === 'ar' ? 'EN' : 'AR'}</span>
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;