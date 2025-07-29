
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

const BrandPage = () => {
  const { brandId } = useParams();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [brandInfo, setBrandInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('default');

  const brandData = useMemo(() => ({
    'classic.color.shop': { name: t('classicColorShop'), logo: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/fbb2966d7e2e39d32840d58ba2d56c94.jpg' },
    'ghyma68': { name: t('ghyma68'), logo: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/652f740e3a30ea89413bcfee1ead3fe4.jpg' },
    'designerr.mix': { name: t('designerrMix'), logo: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/9011a125f34487b6e4f3719fcea6f031.jpg' }
  }), [t]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('dream-boutique-products');
    if (savedProducts) {
      const allProducts = JSON.parse(savedProducts);
      const brandProducts = allProducts.filter(product => product.brand === brandId);
      setProducts(brandProducts);
    }
    setBrandInfo({
      name: brandData[brandId]?.name || brandId,
      logo: brandData[brandId]?.logo,
      id: brandId
    });
  }, [brandId, t, brandData]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortOrder) {
      case 'price-asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return filtered.sort((a, b) => b.price - a.price);
      default:
        return filtered;
    }
  }, [products, searchTerm, sortOrder]);

  if (!brandInfo) return <div>Loading...</div>;

  return (
    <>
      <Helmet>
        <title>{brandInfo.name} - Dream Boutique</title>
        <meta name="description" content={`تسوقوا من مجموعة ${brandInfo.name} الحصرية في Dream Boutique.`} />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <section className="py-16 px-4 gradient-bg">
            <div className="container mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                {brandInfo.logo && (
                  <div className="flex justify-center mb-4">
                    <motion.div whileHover={{ scale: 1.05 }} className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                      <img src={brandInfo.logo} alt={`${brandInfo.name} logo`} className="w-full h-full object-cover" />
                    </motion.div>
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">{brandInfo.name}</h1>
                <p className="text-xl text-muted-foreground">{t('products')} - {filteredAndSortedProducts.length}</p>
              </motion.div>
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/50 rounded-xl border">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={t('searchProducts')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full md:w-auto appearance-none pl-4 pr-10 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="default">{t('sortBy')}</option>
                    <option value="price-asc">{t('priceLowToHigh')}</option>
                    <option value="price-desc">{t('priceHighToLow')}</option>
                  </select>
                  <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-muted-foreground">{t('noProductsFound')}</p>
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BrandPage;
