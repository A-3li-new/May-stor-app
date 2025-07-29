
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/components/ui/use-toast';

const ProductCard = ({ product, index }) => {
  // حذف الصورة الافتراضية القديمة نهائياً
  const [mainImage, setMainImage] = useState(
    product.images && product.images.length > 0
      ? product.images[0]
      : product.image
  );
  const [imageError, setImageError] = useState(false);
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const isProductFavorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: t('productAddedToCart'),
      description: `${product.name} ${t('hasBeenAdded')}`,
      duration: 3000,
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
    toast({
      title: isProductFavorite ? 'تم إزالة المنتج من المفضلة' : 'تم إضافة المنتج للمفضلة',
      description: `${product.name}`,
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="product-card rounded-xl overflow-hidden shadow-lg group"
    >
      <div className="relative overflow-hidden">
        <img
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          src={mainImage}
          onError={() => setImageError(true)}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 rounded-full transition-colors ${
            isProductFavorite 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-white/80 hover:bg-white text-gray-700'
          }`}
        >
          <Heart className={`h-4 w-4 ${isProductFavorite ? 'fill-current' : ''}`} />
        </Button>
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.inStock 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {product.inStock ? t('inStock') : t('outOfStock')}
          </span>
        </div>
        {/* صور مصغرة للمنتج */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 rounded-lg p-1">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                className={`w-10 h-10 object-cover rounded cursor-pointer border ${mainImage === img ? 'border-primary' : 'border-muted'}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg text-foreground line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {product.price} {t('jod')}
          </span>
          
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {t('addToCart')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
