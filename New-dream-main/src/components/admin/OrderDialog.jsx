import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

const OrderDialog = ({ isOpen, onClose, onSave, onDelete, order }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    model: '',
    size: '',
    color: '',
    price: '',
    notes: '',
    brand: '',
    status: 'pending',
  });

  const brands = [
    { id: 'classic.color.shop', name: t('classicColorShop') },
    { id: 'ghyma68', name: t('ghyma68') },
    { id: 'designerr.mix', name: t('designerrMix') }
  ];

  const statusOptions = [
    { value: 'pending', label: t('pending') },
    { value: 'shipped', label: t('shipped') },
    { value: 'delivered', label: t('delivered') },
    { value: 'returned', label: 'مرتجع' },
    { value: 'cancelled', label: 'ملغي من العميل' },
  ];

  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName,
        phone: order.phone,
        address: order.address,
        model: order.model || '',
        size: order.size || '',
        color: order.color || '',
        price: order.price ? order.price.toString() : '',
        notes: order.notes || '',
        brand: order.brand,
        status: order.status,
      });
    } else {
      setFormData({
        customerName: '',
        phone: '',
        address: '',
        model: '',
        size: '',
        color: '',
        price: '',
        notes: '',
        brand: '',
        status: 'pending',
      });
    }
  }, [order, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleShare = () => {
    toast({
      title: t('featureNotImplemented'),
      description: t('featureNotImplementedDesc'),
      duration: 3000,
    });
  };

  const handleDelete = () => {
    if(order && onDelete) {
        onDelete(order.id);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-card rounded-xl p-6 w-full max-w-2xl shadow-xl border max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                {order ? t('editOrder') : t('addOrder')}
              </h2>
              <div>
                {order && (
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={handleDelete}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* الحقول الأساسية - الحالة والبراند في الأعلى */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">إعدادات الطلب الأساسية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField 
                    label="حالة الطلب *" 
                    value={formData.status} 
                    onChange={(e) => handleChange('status', e.target.value)} 
                    options={[{ value: '', label: 'اختر الحالة' }, ...statusOptions]} 
                    required 
                  />
                  <SelectField 
                    label="البراند *" 
                    value={formData.brand} 
                    onChange={(e) => handleChange('brand', e.target.value)} 
                    options={[{ value: '', label: 'اختر البراند' }, ...brands.map(b => ({value: b.id, label: b.name}))]} 
                    required 
                  />
                </div>
              </div>

              {/* بيانات العميل */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">بيانات العميل</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField 
                    label="اسم العميل *" 
                    value={formData.customerName} 
                    onChange={(e) => handleChange('customerName', e.target.value)} 
                    placeholder="أدخل اسم العميل"
                    required 
                  />
                  <InputField 
                    label="رقم الهاتف *" 
                    value={formData.phone} 
                    onChange={(e) => handleChange('phone', e.target.value)} 
                    placeholder="مثال: 0791234567"
                    required 
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-1">العنوان *</label>
                  <textarea 
                    value={formData.address} 
                    onChange={(e) => handleChange('address', e.target.value)} 
                    placeholder="عنوان التوصيل الكامل..."
                    className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                    rows="2" 
                    required 
                  />
                </div>
              </div>

              {/* تفاصيل المنتج */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">تفاصيل المنتج</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField 
                    label="نوع المنتج" 
                    value={formData.model} 
                    onChange={(e) => handleChange('model', e.target.value)} 
                    placeholder="مثال: فستان سهرة"
                  />
                  <InputField 
                    label="المقاس" 
                    value={formData.size} 
                    onChange={(e) => handleChange('size', e.target.value)} 
                    placeholder="مثال: M, L, XL"
                  />
                  <InputField 
                    label="اللون" 
                    value={formData.color} 
                    onChange={(e) => handleChange('color', e.target.value)} 
                    placeholder="مثال: أزرق، أحمر"
                  />
                  <InputField 
                    label="السعر *" 
                    type="number" 
                    step="0.01"
                    value={formData.price} 
                    onChange={(e) => handleChange('price', e.target.value)} 
                    placeholder="0.00"
                    required 
                  />
                </div>
              </div>

              {/* ملاحظات إضافية */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">ملاحظات إضافية</label>
                <textarea 
                  value={formData.notes} 
                  onChange={(e) => handleChange('notes', e.target.value)} 
                  placeholder="أي ملاحظات خاصة بالطلب..."
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
                  rows="3" 
                />
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1">
                  {order ? 'حفظ التغييرات' : 'إضافة الطلب'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
    <input {...props} className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
    <select {...props} className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
      <option value="">{label}</option>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

export default OrderDialog;