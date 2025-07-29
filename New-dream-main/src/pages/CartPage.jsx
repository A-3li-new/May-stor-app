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
import { Trash2, Plus, Minus, Tag, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { t } = useLanguage();
  const { cart, removeFromCart, updateQuantity, cartTotal, cartTotalDiscounted, applyCoupon, removeCoupon, currentAppliedDiscount } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState('');

  const handleApplyDiscount = (e) => {
    e.preventDefault();
    if (discountCode.trim().length === 0) {
      toast({
        title: t('invalidCoupon'),
        description: t('pleaseEnterCoupon'),
        duration: 3000,
      });
      return;
    }
    applyCoupon(discountCode.trim());
    toast({
      title: t('couponApplied'),
      description: t('discountAppliedDesc'),
      duration: 3000,
    });
  };
  const handleRemoveCoupon = () => {
    removeCoupon();
    setDiscountCode('');
    toast({
      title: t('couponRemoved'),
      description: t('discountRemovedDesc'),
      duration: 3000,
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      <Helmet>
        <title>{t('shoppingCart')} - Dream Boutique</title>
        <meta name="description" content="مراجعة سلة التسوق الخاصة بك وإتمام عملية الشراء." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-12 px-4">
          <div className="container mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-center text-foreground mb-8"
            >
              {t('shoppingCart')}
            </motion.h1>

            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground mb-6">{t('emptyCart')}</p>
                <Button onClick={() => navigate('/')}>{t('continueShopping')}</Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card rounded-xl shadow-lg border p-6 space-y-4">
                  {cart.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-4 border-b pb-4 last:border-b-0"
                    >
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
                      <div className="flex-grow">
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.price} {t('jod')}</p>
                      </div>
                      <div className="flex items-center gap-2 border rounded-lg p-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                      </div>
                      <p className="font-bold text-primary w-24 text-center">{(item.price * item.quantity).toFixed(2)} {t('jod')}</p>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => removeFromCart(item.id)}><Trash2 className="h-5 w-5" /></Button>
                    </motion.div>
                  ))}
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-card rounded-xl shadow-lg border p-6 space-y-6 sticky top-24">
                    <h2 className="text-2xl font-bold text-foreground">{t('orderSummary')}</h2>
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">{t('subtotal')}</span>
                      <span className="font-semibold text-foreground">{cartTotal.toFixed(2)} {t('jod')}</span>
                    </div>
                    {currentAppliedDiscount && (
                      <div className="flex justify-between text-lg text-green-600">
                        <span>{t('discount')}</span>
                        <span>-{(cartTotal - cartTotalDiscounted).toFixed(2)} {t('jod')}</span>
                      </div>
                    )}
                    <form onSubmit={handleApplyDiscount} className="space-y-2">
                      <label htmlFor="discount" className="font-medium text-foreground">{t('discountCode')}</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="discount"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder={t('discountCode')}
                          className="flex-grow px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          disabled={!!currentAppliedDiscount}
                        />
                        {!currentAppliedDiscount ? (
                          <Button type="submit" variant="outline"><Tag className="h-4 w-4" /></Button>
                        ) : (
                          <Button type="button" variant="destructive" onClick={handleRemoveCoupon}>{t('remove')}</Button>
                        )}
                      </div>
                      {currentAppliedDiscount && (
                        <div className="text-green-600 text-sm mt-1">{t('couponAppliedSuccess')}</div>
                      )}
                    </form>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-xl font-bold mb-4">
                        <span>{t('total')}</span>
                        <span>{cartTotalDiscounted.toFixed(2)} {t('jod')}</span>
                      </div>
                      <Button size="lg" className="w-full" onClick={handleCheckout}>{t('checkout')}</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CartPage;