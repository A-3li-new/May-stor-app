
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const TermsPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('termsAndConditions')} - Dream Boutique</title>
        <meta name="description" content="الشروط والأحكام الخاصة باستخدام موقع Dream Boutique." />
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-8">
                {t('termsAndConditions')}
              </h1>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-3">1. مقدمة</h2>
                  <p>
                    مرحبًا بكم في Dream Boutique. هذه الشروط والأحكام تحكم استخدامك لموقعنا. من خلال الوصول إلى الموقع، فإنك توافق على الالتزام بهذه الشروط.
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-3">2. سياسة الشراء</h2>
                  <p>
                    جميع الأسعار معروضة بالدينار الأردني (JOD). نحن نبذل قصارى جهدنا لضمان دقة معلومات المنتج والأسعار، ولكن قد تحدث أخطاء. نحتفظ بالحق في تصحيح أي أخطاء وتحديث المعلومات في أي وقت.
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-3">3. الشحن والتوصيل</h2>
                  <p>
                    نحن نقدم خدمة الشحن داخل الأردن. سيتم توفير رقم تتبع لكل طلب. تختلف أوقات التسليم حسب الموقع.
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-3">4. سياسة الإرجاع والاستبدال</h2>
                  <p>
                    يمكن إرجاع المنتجات أو استبدالها في غضون 7 أيام من تاريخ الاستلام، بشرط أن تكون في حالتها الأصلية وغير مستخدمة ومع جميع العلامات المرفقة. يتحمل العميل تكاليف شحن الإرجاع ما لم يكن المنتج معيبًا.
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-foreground mb-3">5. الخصوصية</h2>
                  <p>
                    نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. لن تتم مشاركة معلوماتك مع أي طرف ثالث دون موافقتك.
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TermsPage;
