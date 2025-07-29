// src/components/admin/DiscountManager.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleRight, ToggleLeft, Tag, Percent, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext'; // تأكد من وجود هذا الاستيراد
import { useToast } from '@/components/ui/use-toast';
import { useDiscount } from '@/contexts/DiscountContext';

const DiscountManager = () => {
  const { t } = useLanguage(); // <--- استخدام دالة t للترجمة
  const { toast } = useToast();
  const { discounts, addDiscount, updateDiscount, deleteDiscount, toggleDiscountStatus } = useDiscount();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  const handleOpenForm = (discount = null) => {
    setEditingDiscount(discount);
    setDiscountType(discount ? discount.type : 'percentage');
    setDiscountValue(discount ? discount.value : '');
    setDiscountCode(discount ? discount.code || '' : '');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDiscount(null);
    setDiscountType('percentage');
    setDiscountValue('');
    setDiscountCode('');
  };

  const handleSaveDiscount = (e) => {
    e.preventDefault();
    if (!discountValue || isNaN(discountValue) || parseFloat(discountValue) <= 0) {
      toast({
        title: t('error'), // استخدام المفتاح المترجم
        description: t('invalidDiscountValue'), // استخدام المفتاح المترجم
        variant: 'destructive',
        duration: 3000,
      });
      return;
    }

    const value = parseFloat(discountValue);

    const discountData = {
      type: discountType,
      value: value,
      code: discountCode.trim() === '' ? undefined : discountCode.trim().toUpperCase(),
      isActive: editingDiscount ? editingDiscount.isActive : true,
    };

    if (editingDiscount) {
      updateDiscount({ ...editingDiscount, ...discountData });
      toast({ title: t('discountUpdated'), duration: 3000 }); // استخدام المفتاح المترجم
    } else {
      if (discountCode.trim() !== '' && discounts.some(d => d.code && d.code.toLowerCase() === discountCode.trim().toLowerCase())) {
        toast({
          title: t('error'), // استخدام المفتاح المترجم
          description: t('duplicateCouponCode'), // استخدام المفتاح المترجم
          variant: 'destructive',
          duration: 3000,
        });
        return;
      }
      addDiscount(discountData);
      toast({ title: t('discountAdded'), duration: 3000 }); // استخدام المفتاح المترجم
    }
    handleCloseForm();
  };

  const handleDelete = (id) => {
    deleteDiscount(id);
    toast({ title: t('discountDeleted'), duration: 3000 }); // استخدام المفتاح المترجم
  };

  const handleToggleStatus = (id) => {
    toggleDiscountStatus(id);
    toast({ title: t('discountStatusChanged'), duration: 3000 }); // استخدام المفتاح المترجم
  };

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">{t('discountManagement')}</h2>

      <Button onClick={() => handleOpenForm()} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />{t('addDiscount')}
      </Button>

      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-card p-6 rounded-lg shadow-lg border relative"
        >
          <button onClick={handleCloseForm} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
          <h3 className="text-xl font-semibold mb-4">{editingDiscount ? t('editDiscount') : t('addNewDiscount')}</h3>
          <form onSubmit={handleSaveDiscount} className="space-y-4">
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-muted-foreground mb-1">{t('discountType')}</label>
              <select
                id="discountType"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="percentage">{t('percentage')}</option>
                <option value="fixed">{t('fixedAmount')}</option>
              </select>
            </div>
            <div>
              <label htmlFor="discountValue" className="block text-sm font-medium text-muted-foreground mb-1">{t('discountValue')}</label>
              <div className="relative">
                <input
                  type="number"
                  id="discountValue"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('enterDiscountValue')}
                  min="0.01"
                  step="0.01"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {discountType === 'percentage' ? '%' : t('jodShort')}
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="discountCode" className="block text-sm font-medium text-muted-foreground mb-1">{t('couponCodeOptional')}</label>
              <input
                type="text"
                id="discountCode"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t('enterCouponCodeOptional')}
              />
              <p className="text-xs text-muted-foreground mt-1">{t('leaveEmptyForAutomaticDiscount')}</p>
            </div>
            <Button type="submit" className="w-full flex items-center gap-2">
              {editingDiscount ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingDiscount ? t('saveChanges') : t('addDiscount')}
            </Button>
          </form>
        </motion.div>
      )}

      <div className="bg-card rounded-lg shadow-lg border p-4">
        <h3 className="text-xl font-semibold mb-4">{t('currentDiscounts')}</h3>
        {discounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-3" />
            <p>{t('noDiscountsAddedYet')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('type')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('value')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('couponCode')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('status')}</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-muted-foreground/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-foreground">
                      <span className="flex items-center gap-1">
                        {discount.type === 'percentage' ? <Percent className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
                        {discount.type === 'percentage' ? t('percentage') : t('fixedAmount')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground">
                      {discount.type === 'percentage' ? `${discount.value}%` : `${discount.value} ${t('jodShort')}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-foreground font-mono">
                      {discount.code ? discount.code : t('none')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${discount.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                        {discount.isActive ? t('active') : t('inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenForm(discount)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleToggleStatus(discount.id)}>
                          {discount.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(discount.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DiscountManager;
