import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LoginPage = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const result = login(username, password);
    if (result.success) {
      toast({ title: t('loggedIn'), duration: 2000 });
      // إرسال إشعار للمستخدم
      addNotification({
        userId: result.user.id,
        type: 'info',
        message: t('welcomeNotification') || 'تم تسجيل الدخول بنجاح!',
        time: new Date().toLocaleString('ar-EG')
      });
      navigate('/admin');
    } else {
      setError(t('loginFailed'));
      toast({ title: t('loginFailed'), variant: 'destructive', duration: 3000 });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('login')} - Dream Boutique</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <div className="bg-card p-8 rounded-2xl shadow-2xl border">
              <div className="text-center mb-8">
                {/* استيراد الصورة بشكل صحيح مع Vite */}
                <img
                  src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/910249c9f1ce9578f1c98ada7b5b2bff.png"
                  alt="Dream Boutique Logo"
                  className="h-20 w-auto mx-auto mb-4"
                />
import logo from '@/assets/logo.png';
                <h1 className="text-2xl font-bold text-foreground">{t('loginToDashboard')}</h1>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('username')}</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('password')}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" size="lg">{t('login')}</Button>
              </form>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default LoginPage;