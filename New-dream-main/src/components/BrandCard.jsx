import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const BrandCard = ({ brand, index }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleInstagramClick = () => {
    window.open(brand.instagramUrl, '_blank');
  };

  const handleProductsClick = () => {
    navigate(`/brand/${brand.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="brand-card rounded-2xl shadow-lg"
    >
      <div className="flex-grow h-80 relative">
        <img
          src={brand.logoUrl}
          alt={`${brand.name} logo`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 bg-card/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleInstagramClick}
            variant="outline"
            className="flex-1 flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Instagram className="h-4 w-4" />
            {t('visitInstagram')}
          </Button>

          <Button
            onClick={handleProductsClick}
            className="flex-1 flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <ShoppingBag className="h-4 w-4" />
            {t('viewProducts')}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BrandCard;
