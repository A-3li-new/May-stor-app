
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const TrackingPage = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('q') || '');
  const [orderInfo, setOrderInfo] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const statusIcons = {
    pending: Package,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle
  };

  const statusColors = {
    pending: 'status-pending',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled'
  };

  useEffect(() => {
    if (searchParams.get('q')) {
      handleSearch();
    }
  }, [searchParams]);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) return;

    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock order data
      const mockOrders = [
        {
          id: 'DB001',
          trackingNumber: 'DB001',
          customerName: 'أحمد محمد',
          phone: '0791234567',
          address: 'عمان، الأردن',
          status: 'shipped',
          items: [
            { name: 'فستان أنيق للمناسبات الخاصة', price: 85, quantity: 1 }
          ],
          total: 85,
          orderDate: '2024-01-15',
          estimatedDelivery: '2024-01-18'
        },
        {
          id: 'DB002',
          trackingNumber: 'DB002',
          customerName: 'فاطمة أحمد',
          phone: '0797654321',
          address: 'إربد، الأردن',
          status: 'delivered',
          items: [
            { name: 'حقيبة يد عصرية وأنيقة', price: 120, quantity: 1 }
          ],
          total: 120,
          orderDate: '2024-01-10',
          deliveredDate: '2024-01-14'
        }
      ];

      const foundOrder = mockOrders.find(order => 
        order.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
      );

      setOrderInfo(foundOrder);
      setIsSearching(false);
    }, 1000);
  };

  const StatusIcon = orderInfo ? statusIcons[orderInfo.status] : Package;

  return (
    <>
      <Helmet>
        <title>تتبع الطلب - Dream Boutique</title>
        <meta name="description" content="تتبعوا طلباتكم في Dream Boutique باستخدام رقم التتبع الخاص بكم." />
      </Helmet>

      <div className="min-h-screen gradient-bg">
        <Header />

        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {t('tracking')}
              </h1>
              <p className="text-xl text-muted-foreground">
                أدخلوا رقم التتبع لمعرفة حالة طلبكم
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-card rounded-xl p-6 shadow-lg mb-8">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="رقم التتبع (مثال: DB001)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !trackingNumber.trim()}
                  className="px-6"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Order Information */}
            {orderInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-xl p-6 shadow-lg"
              >
                <div className="space-y-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">
                        طلب رقم: {orderInfo.id}
                      </h2>
                      <p className="text-muted-foreground">
                        تاريخ الطلب: {orderInfo.orderDate}
                      </p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${statusColors[orderInfo.status]}`}>
                      <StatusIcon className="h-5 w-5" />
                      <span className="font-medium">{t(orderInfo.status)}</span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">معلومات العميل</h3>
                      <p className="text-muted-foreground">{orderInfo.customerName}</p>
                      <p className="text-muted-foreground">{orderInfo.phone}</p>
                      <p className="text-muted-foreground">{orderInfo.address}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">تفاصيل التوصيل</h3>
                      {orderInfo.status === 'delivered' ? (
                        <p className="text-green-600">تم التوصيل في: {orderInfo.deliveredDate}</p>
                      ) : (
                        <p className="text-muted-foreground">
                          التوصيل المتوقع: {orderInfo.estimatedDelivery}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">المنتجات</h3>
                    <div className="space-y-3">
                      {orderInfo.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-primary">{item.price} {t('jod')}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-foreground">المجموع:</span>
                        <span className="text-2xl font-bold text-primary">{orderInfo.total} {t('jod')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* No Results */}
            {trackingNumber && !orderInfo && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-card rounded-xl p-6 shadow-lg text-center"
              >
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  لم يتم العثور على الطلب
                </h3>
                <p className="text-muted-foreground">
                  تأكدوا من رقم التتبع وحاولوا مرة أخرى
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TrackingPage;
