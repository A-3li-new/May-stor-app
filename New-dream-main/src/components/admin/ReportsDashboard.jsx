import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const ReportsDashboard = ({ products, orders, users }) => {
  const { t } = useLanguage();

  // إحصائيات مبسطة
  const totalSales = useMemo(() => orders.reduce((sum, o) => sum + (o.total || 0), 0), [orders]);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalCustomers = users ? users.length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{totalSales.toFixed(2)} {t('jod')}</div>
          <div className="text-muted-foreground mt-2">{t('totalSales')}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{totalOrders}</div>
          <div className="text-muted-foreground mt-2">{t('totalOrders')}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{totalProducts}</div>
          <div className="text-muted-foreground mt-2">{t('totalProducts')}</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-2xl font-bold text-primary">{totalCustomers}</div>
          <div className="text-muted-foreground mt-2">{t('totalCustomers')}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsDashboard;
