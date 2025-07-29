import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const ProductDialog = ({ isOpen, onClose, onSave, product, brands }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    colors: [''], // قائمة الألوان المتوفرة
    sizes: [''], // قائمة المقاسات المتوفرة
    price: '',
    brand: '',
    quantity: '',
    description: '', // وصف المنتج
    images: [],
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        colors: product.colors || (product.color ? [product.color] : ['']),
        sizes: product.sizes || (product.size ? [product.size] : ['']),
        price: product.price ? product.price.toString() : '',
        brand: product.brand || '',
        quantity: product.quantity ? product.quantity.toString() : '0',
        description: product.description || '',
        images: product.images || (product.image ? [product.image] : []),
      });
    } else {
      setFormData({
        name: '', 
        colors: [''], 
        sizes: [''], 
        price: '', 
        brand: '', 
        quantity: '0', 
        description: '',
        images: [],
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // التحقق من الحقول المطلوبة
    if (!formData.name.trim()) {
      alert('يرجى إدخال اسم المنتج');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('يرجى إدخال سعر صحيح');
      return;
    }
    if (!formData.brand) {
      alert('يرجى اختيار البراند');
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      alert('يرجى إدخال كمية صحيحة');
      return;
    }

    // تنظيف البيانات
    const cleanedData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      inStock: parseInt(formData.quantity, 10) > 0,
      colors: formData.colors.filter(color => color.trim() !== ''),
      sizes: formData.sizes.filter(size => size.trim() !== ''),
      images: formData.images,
    };

    onSave(cleanedData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // إدارة الألوان
  const addColor = () => {
    setFormData(prev => ({ ...prev, colors: [...prev.colors, ''] }));
  };

  const removeColor = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      colors: prev.colors.filter((_, i) => i !== index) 
    }));
  };

  const updateColor = (index, value) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) => i === index ? value : color)
    }));
  };

  // إدارة المقاسات
  const addSize = () => {
    setFormData(prev => ({ ...prev, sizes: [...prev.sizes, ''] }));
  };

  const removeSize = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      sizes: prev.sizes.filter((_, i) => i !== index) 
    }));
  };

  const updateSize = (index, value) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((size, i) => i === index ? value : size)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
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
                {product ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* رفع الصور */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  صور المنتج *
                </label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                />
                <div 
                  className="w-full min-h-32 bg-muted/50 rounded-lg flex flex-wrap gap-2 items-center justify-center border-2 border-dashed cursor-pointer p-4" 
                  onClick={() => fileInputRef.current.click()}
                >
                  {formData.images.length > 0 ? (
                    formData.images.map((img, idx) => (
                      <div key={idx} className="relative w-24 h-24">
                        <img 
                          src={img} 
                          alt={`Preview ${idx}`} 
                          className="w-full h-full object-cover rounded-lg border" 
                        />
                        <button 
                          type="button" 
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600" 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleRemoveImage(idx);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Upload className="h-12 w-12 mx-auto mb-2" />
                      <p>انقر لرفع صور المنتج</p>
                      <p className="text-xs">يمكن رفع عدة صور</p>
                    </div>
                  )}
                </div>
              </div>

              {/* الحقول الأساسية */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  label="اسم المنتج *" 
                  value={formData.name} 
                  onChange={(e) => handleChange('name', e.target.value)} 
                  placeholder="أدخل اسم المنتج"
                  required 
                />
                <SelectField 
                  label="البراند *" 
                  value={formData.brand} 
                  onChange={(e) => handleChange('brand', e.target.value)} 
                  options={[
                    { value: '', label: 'اختر البراند' },
                    ...brands.map(b => ({value: b.id, label: b.name}))
                  ]} 
                  required 
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
                <InputField 
                  label="الكمية *" 
                  type="number" 
                  min="0"
                  value={formData.quantity} 
                  onChange={(e) => handleChange('quantity', e.target.value)} 
                  placeholder="0"
                  required 
                />
              </div>

              {/* وصف المنتج */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  وصف المنتج
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="اكتب وصفاً للمنتج..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* الألوان المتوفرة */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">
                    الألوان المتوفرة
                  </label>
                  <Button type="button" size="sm" variant="outline" onClick={addColor}>
                    <Plus className="h-4 w-4" /> إضافة لون
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => updateColor(index, e.target.value)}
                        placeholder="أدخل اللون"
                        className="flex-1 px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {formData.colors.length > 1 && (
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => removeColor(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* المقاسات المتوفرة */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">
                    المقاسات المتوفرة
                  </label>
                  <Button type="button" size="sm" variant="outline" onClick={addSize}>
                    <Plus className="h-4 w-4" /> إضافة مقاس
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={size}
                        onChange={(e) => updateSize(index, e.target.value)}
                        placeholder="أدخل المقاس"
                        className="flex-1 px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {formData.sizes.length > 1 && (
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => removeSize(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* أزرار الحفظ والإلغاء */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1">
                  {product ? 'حفظ التغييرات' : 'إضافة المنتج'}
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
    <input 
      {...props} 
      className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
    />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1">{label}</label>
    <select 
      {...props} 
      className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default ProductDialog;