import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import OrderDialog from './OrderDialog';

const OrdersTable = ({ orders, setOrders }) => {
  const { addNotification } = useNotifications();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'جميع الحالات' },
    { value: 'pending', label: t('pending') },
    { value: 'shipped', label: t('shipped') },
    { value: 'delivered', label: t('delivered') },
    { value: 'returned', label: 'مرتجع' },
    { value: 'cancelled', label: 'ملغي من العميل' },
  ];

  const statusColors = {
    pending: 'status-pending',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    returned: 'status-cancelled',
    cancelled: 'status-cancelled'
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveOrder = (orderData) => {
    let updatedOrders;
    if (editingOrder) {
      updatedOrders = orders.map(o => o.id === editingOrder.id ? { ...editingOrder, ...orderData } : o);
      toast({ title: t('orderUpdated'), duration: 3000 });
      // إرسال إشعار للعميل عند تحديث حالة الطلب
      addNotification({
        userId: editingOrder.userId,
        type: 'order',
        message: t('orderStatusUpdatedNotification') || `تم تحديث حالة طلبك (${orderData.status})`,
        time: new Date().toLocaleString('ar-EG')
      });
    } else {
      const newOrder = {
        ...orderData,
        id: Date.now(),
        trackingNumber: `DB${Date.now()}`,
        orderDate: new Date().toLocaleDateString('ar-EG'),
        total: parseFloat(orderData.price)
      };
      updatedOrders = [newOrder, ...orders];
      toast({ title: t('orderAdded'), duration: 3000 });
    }
    setOrders(updatedOrders);
    localStorage.setItem('dream-boutique-orders', JSON.stringify(updatedOrders));
    setIsOrderDialogOpen(false);
    setEditingOrder(null);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsOrderDialogOpen(true);
  };
  const handleShareOrderData = (order) => {
    const orderData = `\n--- بيانات الطلب ---\nرقم الطلب: ${order.trackingNumber}\nاسم العميل: ${order.customerName}\nالهاتف: ${order.phone}\nتاريخ الطلب: ${order.orderDate}\nالحالة: ${t(order.status)}\nالمجموع: ${order.total} ${t('jod')}\n`;
    if (navigator.share) {
      navigator.share({
        title: 'بيانات الطلب',
        text: orderData
      });
    } else {
      navigator.clipboard.writeText(orderData);
      toast({ title: 'تم نسخ بيانات الطلب', duration: 2000 });
    }
  };

  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter(o => o.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('dream-boutique-orders', JSON.stringify(updatedOrders));
    toast({ title: t('orderDeleted'), duration: 3000 });
    setIsOrderDialogOpen(false);
    setEditingOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="البحث..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            {statusOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
          </select>
        </div>
        <Button onClick={() => { setEditingOrder(null); setIsOrderDialogOpen(true); }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />{t('addOrder')}
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-4 text-right text-sm font-medium text-foreground">{t('trackingNumber')}</th>
                <th className="p-4 text-right text-sm font-medium text-foreground">{t('customerName')}</th>
                <th className="p-4 text-right text-sm font-medium text-foreground">{t('phone')}</th>
                <th className="p-4 text-right text-sm font-medium text-foreground">{t('total')}</th>
                <th className="p-4 text-right text-sm font-medium text-foreground">{t('status')}</th>
                <th className="p-4 text-right text-sm font-medium text-foreground">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order, index) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="hover:bg-muted/50">
                  <td className="p-4 text-sm font-medium text-foreground">{order.trackingNumber}</td>
                  <td className="p-4 text-sm text-foreground">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.orderDate}</p>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-foreground">{order.phone}</td>
                  <td className="p-4 text-sm font-bold text-primary">{order.total} {t('jod')}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{statusOptions.find(s => s.value === order.status)?.label}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditOrder(order)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">تعديل</span>
                      </Button>
                      <Button size="sm" variant="default" onClick={() => handleShareOrderData(order)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25l9-6v19.5l-9-6" /></svg>
                        مشاركة بيانات الطلب
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => {
                        const url = window.location.origin + '/tracking?order=' + order.trackingNumber;
                        navigator.clipboard.writeText(url);
                        toast({ title: 'تم نسخ رابط الطلب للعميل', duration: 2000 });
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 8.25V6a3.75 3.75 0 10-7.5 0v2.25m7.5 0A2.25 2.25 0 0118 10.5v7.25a2.25 2.25 0 01-2.25 2.25H8.25A2.25 2.25 0 016 17.75V10.5a2.25 2.25 0 012.25-2.25m7.5 0h-7.5" /></svg>
                        نسخ رابط التتبع
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-16"><p className="text-xl text-muted-foreground">لا توجد طلبات</p></div>
        )}
      </div>
      <OrderDialog isOpen={isOrderDialogOpen} onClose={() => setIsOrderDialogOpen(false)} onSave={handleSaveOrder} onDelete={handleDeleteOrder} order={editingOrder} />
    </div>
  );
};

export default OrdersTable;