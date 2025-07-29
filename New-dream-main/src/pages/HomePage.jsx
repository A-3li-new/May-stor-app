
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BrandCard from '@/components/BrandCard';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';

const HomePage = () => {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const brands = [
    {
      id: 'classic.color.shop',
      name: t('classicColorShop'),
      instagramUrl: 'https://instagram.com/classic.color.shop',
      logoUrl: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/fbb2966d7e2e39d32840d58ba2d56c94.jpg'
    },
    {
      id: 'ghyma68',
      name: t('ghyma68'),
      instagramUrl: 'https://instagram.com/ghyma68',
      logoUrl: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/652f740e3a30ea89413bcfee1ead3fe4.jpg'
    },
    {
      id: 'designerr.mix',
      name: t('designerrMix'),
      instagramUrl: 'https://instagram.com/designerr.mix',
      logoUrl: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/9011a125f34487b6e4f3719fcea6f031.jpg'
    }
  ];

  useEffect(() => {
    const savedFeatured = localStorage.getItem('dream-boutique-featured');
    if (savedFeatured) {
      setFeaturedProducts(JSON.parse(savedFeatured));
    } else {
      const defaultFeatured = [
        { id: 1, name: 'فستان أنيق للمناسبات الخاصة', price: 85, brand: 'classic.color.shop', inStock: true, image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1887' },
        { id: 2, name: 'حقيبة يد عصرية وأنيقة', price: 120, brand: 'ghyma68', inStock: true, image: 'https://images.unsplash.com/photo-1590739242442-369ce0a3cc4a?q=80&w=1887' },
        { id: 3, name: 'إكسسوارات مميزة للإطلالة المثالية', price: 45, brand: 'designerr.mix', inStock: true, image: 'https://images.unsplash.com/photo-1611652022417-a55339f97233?q=80&w=1887' },
        { id: 4, name: 'مجموعة مكياج احترافية', price: 95, brand: 'classic.color.shop', inStock: false, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080' }
      ];
      setFeaturedProducts(defaultFeatured);
      localStorage.setItem('dream-boutique-featured', JSON.stringify(defaultFeatured));
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Dream Boutique - {t('welcomeSubtitle')}</title>
        <meta name="description" content={`${t('welcomeTitle')}. ${t('classicColorShop')}, ${t('ghyma68')}, & ${t('designerrMix')}.`} />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow relative">
          <div className="watermark">
            <img
              src="https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/910249c9f1ce9578f1c98ada7b5b2bff.png"
              alt="Dream Boutique Watermark"
              className="w-[300px] md:w-[500px] h-auto opacity-5"
            />
          </div>

          <section className="relative py-20 px-4 gradient-bg">
            <div className="container mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                  {t('welcomeTitle')}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                  {t('welcomeSubtitle')}
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-16 px-4">
            <div className="container mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
              >
                {t('ourBrands')}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {brands.map((brand, index) => (
                  <BrandCard key={brand.id} brand={brand} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12"
              >
                {t('featuredProducts')}
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
