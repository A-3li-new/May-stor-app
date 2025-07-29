
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

const FeaturedManager = ({ products, featuredProducts, setFeaturedProducts }) => {
  const [featuredImages, setFeaturedImages] = useState([]);
  const featuredImageInputRef = React.useRef(null);
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const availableProducts = products.filter(
    product => !featuredProducts.some(featured => featured.id === product.id)
  );

  const addToFeatured = (product) => {
    let productToAdd = { ...product };
    if (featuredImages.length > 0) {
      productToAdd.images = featuredImages;
    }
    const updatedFeatured = [...featuredProducts, productToAdd];
    setFeaturedProducts(updatedFeatured);
    localStorage.setItem('dream-boutique-featured', JSON.stringify(updatedFeatured));
    setShowAddDialog(false);
    setFeaturedImages([]);
    toast({
      title: 'تم إضافة المنتج للمنتجات المميزة',
      duration: 3000,
    });
  };

  const removeFromFeatured = (productId) => {
    const updatedFeatured = featuredProducts.filter(product => product.id !== productId);
    setFeaturedProducts(updatedFeatured);
    localStorage.setItem('dream-boutique-featured', JSON.stringify(updatedFeatured));
    toast({
      title: 'تم إزالة المنتج من المنتجات المميزة',
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">
          المنتجات المميزة ({featuredProducts.length}/4)
        </h2>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة منتج مميز
            </Button>
      </div>

      {/* Featured Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-4 shadow-lg border relative"
          >
            <div className="absolute top-2 left-2 bg-yellow-500 text-white rounded-full p-1">
              <Star className="h-4 w-4 fill-current" />
            </div>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={() => removeFromFeatured(product.id)}
              className="absolute top-2 right-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="space-y-3 mt-8">
              <img  
              alt={product.name}
              className="w-full h-32 object-cover rounded-lg"
              src={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : (product.image || "https://images.unsplash.com/photo-1646193186132-7976c1670e81")
              }
            />
              
              <div>
                <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-primary">
                  {product.price} {t('jod')}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Empty Slots */}
        {/* لم تعد هناك فتحات فارغة */}
      </div>

      {/* Add Product Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setShowAddDialog(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-card rounded-xl p-6 w-full max-w-2xl shadow-xl border max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">
                اختر منتج لإضافته للمنتجات المميزة
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAddDialog(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-muted/30 rounded-lg p-4 border hover:border-primary transition-colors"
                >
                  <img  
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                    src={
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : (product.image || "https://images.unsplash.com/photo-1646193186132-7976c1670e81")
                    }
                  />
                  
                  <h4 className="font-semibold text-foreground line-clamp-2 mb-2">
                    {product.name}
                  </h4>
                  <p className="text-primary font-bold mb-3">
                    {product.price} {t('jod')}
                  </p>
                  
                  <div className="space-y-2">
                    <input 
                      type="file" 
                      ref={featuredImageInputRef} 
                      onChange={e => {
                        const files = Array.from(e.target.files);
                        files.forEach(file => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFeaturedImages(prev => [...prev, reader.result]);
                          };
                          reader.readAsDataURL(file);
                        });
                      }} 
                      className="hidden" 
                      accept="image/*" 
                      multiple 
                    />
                    
                    <Button 
                      variant="outline" 
                      onClick={() => featuredImageInputRef.current.click()} 
                      className="w-full text-sm"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      رفع صور إضافية (اختياري)
                    </Button>
                    
                    {featuredImages.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {featuredImages.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img 
                              src={img} 
                              alt={`صورة مميزة ${idx}`} 
                              className="w-12 h-12 object-cover rounded-lg border" 
                            />
                            <button
                              type="button"
                              onClick={() => setFeaturedImages(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Button 
                      variant="default" 
                      onClick={() => addToFeatured(product)} 
                      className="w-full"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      إضافة للمنتجات المميزة
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {availableProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  جميع المنتجات مضافة بالفعل أو لا توجد منتجات متاحة
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default FeaturedManager;
