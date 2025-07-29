import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Truck } from 'lucide-react';

const CheckoutPage = () => {
  const { t } = useLanguage();
  const { cart, cartTotal, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '', notes: '', email: '', password: '' });
  const [isGuestCheckout, setIsGuestCheckout] = useState(!user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    
    // إنشاء حساب جديد إذا لم يكن الطلب كضيف
    if (!isGuestCheckout && !user && customerInfo.email && customerInfo.password) {
      const savedUsers = JSON.parse(localStorage.getItem('dream-boutique-customers') || '[]');
      const newUser = {
        id: Date.now(),
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        password: customerInfo.password, // في التطبيق الحقيقي يجب تشفير كلمة المرور
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      const updatedUsers = [...savedUsers, newUser];
      localStorage.setItem('dream-boutique-customers', JSON.stringify(updatedUsers));
      
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'يمكنك الآن تسجيل الدخول باستخدام بريدك الإلكتروني',
        duration: 3000,
      });
    }
    
    // Save order to localStorage
    const savedOrders = JSON.parse(localStorage.getItem('dream-boutique-orders') || '[]');
    const newOrder = {
        id: Date.now(),
        trackingNumber: `DB${Date.now()}`,
        orderDate: new Date().toLocaleDateString('ar-EG'),
        customerName: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        notes: customerInfo.notes,
        items: cart,
        total: cartTotal,
        status: 'pending',
        brand: cart[0]?.brand || 'mixed',
    };
    const updatedOrders = [newOrder, ...savedOrders];
    localStorage.setItem('dream-boutique-orders', JSON.stringify(updatedOrders));
    
    // Clear cart
    clearCart();

    // Show success message and redirect
    toast({
        title: t('orderPlaced'),
        description: t('orderPlacedDesc'),
        duration: 5000,
    });
    // إرسال إشعار للمستخدم
    if (user) {
      addNotification({
        userId: user.id,
        type: 'order',
        message: t('orderPlacedNotification') || 'تم تنفيذ طلبك بنجاح!',
        time: new Date().toLocaleString('ar-EG')
      });
    }
    navigate('/');
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{t('checkoutTitle')} - Dream Boutique</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-12 px-4">
          <div className="container mx-auto">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
              {t('checkoutTitle')}
            </motion.h1>
            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3 bg-card p-8 rounded-xl shadow-lg border space-y-6">
                {/* خيار نوع المستخدم */}
                {!user && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-foreground mb-4">كيف تريد المتابعة؟</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          isGuestCheckout ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setIsGuestCheckout(true)}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            isGuestCheckout ? 'border-primary bg-primary' : 'border-border'
                          }`} />
                          <h4 className="font-medium">متابعة كضيف</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          أسرع طريقة للشراء دون الحاجة لإنشاء حساب
                        </p>
                      </div>
                      
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          !isGuestCheckout ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setIsGuestCheckout(false)}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            !isGuestCheckout ? 'border-primary bg-primary' : 'border-border'
                          }`} />
                          <h4 className="font-medium">إنشاء حساب</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          احفظ معلوماتك وتتبع طلباتك
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-foreground">
                  {isGuestCheckout || user ? 'معلومات التوصيل' : 'إنشاء حساب جديد'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField name="name" label={t('customerName')} value={customerInfo.name} onChange={handleInputChange} required />
                    <InputField name="phone" label={t('phone')} value={customerInfo.phone} onChange={handleInputChange} required />
                    {!isGuestCheckout && !user && (
                      <>
                        <InputField 
                          name="email" 
                          type="email"
                          label="البريد الإلكتروني" 
                          value={customerInfo.email || ''} 
                          onChange={handleInputChange} 
                          required 
                        />
                        <InputField 
                          name="password" 
                          type="password"
                          label="كلمة المرور" 
                          value={customerInfo.password || ''} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </>
                    )}
                </div>
                <label className="block text-sm font-medium text-foreground">{t('shippingAddress')}</label>
                <textarea name="address" value={customerInfo.address} onChange={handleInputChange} className="w-full p-3 rounded-lg border bg-background" rows="3" required />
                <label className="block text-sm font-medium text-foreground">{t('notes')}</label>
                <textarea name="notes" value={customerInfo.notes} onChange={handleInputChange} className="w-full p-3 rounded-lg border bg-background" rows="3" />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-card p-8 rounded-xl shadow-lg border sticky top-24 space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">{t('orderSummary')}</h2>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-foreground">{item.name} x {item.quantity}</span>
                        <span className="text-muted-foreground">{(item.price * item.quantity).toFixed(2)} {t('jod')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 flex justify-between text-xl font-bold">
                    <span>{t('total')}</span>
                    <span>{cartTotal.toFixed(2)} {t('jod')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground pt-4 border-t">{t('paymentMethod')}</h3>
                  <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Truck className="h-6 w-6 text-primary" />
                        <span>الدفع عند الاستلام</span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary" />
                  </div>
                  <Button type="submit" size="lg" className="w-full">{t('placeOrder')}</Button>
                </div>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

const InputField = ({ label, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
      <input {...props} className="w-full p-3 rounded-lg border bg-background" />
    </div>
);

export default CheckoutPage;