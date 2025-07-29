
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Footer = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast({
      title: t('featureNotImplemented'),
      description: t('featureNotImplementedDesc'),
      duration: 3000,
    });
  };

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <p className="font-bold text-lg text-foreground mb-2">{t('subscribeNewsletter')}</p>
            <p className="text-muted-foreground mb-4">{t('subscribeDescription')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="flex-grow px-4 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit">{t('subscribe')}</Button>
            </form>
          </div>
          <div>
            <p className="font-bold text-lg text-foreground mb-4">{t('aboutDreamBoutique')}</p>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="text-muted-foreground hover:text-primary transition-colors">{t('ourStory')}</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">{t('termsAndConditions')}</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-lg text-foreground mb-4">{t('ourBrands')}</p>
            <ul className="space-y-2">
              <li><Link to="/brand/classic.color.shop" className="text-muted-foreground hover:text-primary transition-colors">{t('classicColorShop')}</Link></li>
              <li><Link to="/brand/ghyma68" className="text-muted-foreground hover:text-primary transition-colors">{t('ghyma68')}</Link></li>
              <li><Link to="/brand/designerr.mix" className="text-muted-foreground hover:text-primary transition-colors">{t('designerrMix')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Dream Boutique. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
