
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutUsPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('aboutUs')} - Dream Boutique</title>
        <meta name="description" content={`تعرف على قصة Dream Boutique ورؤيتنا.`} />
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
                {t('ourStory')}
              </h1>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  بدأت قصة Dream Boutique بحلم بسيط: جمع أرقى وأجمل البراندات العالمية والمحلية تحت سقف واحد، لتقديم تجربة تسوق فريدة من نوعها لعملائنا في الأردن والشرق الأوسط. نحن نؤمن بأن الأناقة هي لغة عالمية، ونسعى لنكون الجسر الذي يربط بين أحدث صيحات الموضة وذوقكم الرفيع.
                </p>
                <p>
                  في Dream Boutique، كل قطعة نختارها تحمل قصة، وكل براند نتعاون معه يشاركنا نفس الشغف بالجودة والإبداع. من Classic Color Shop بألوانه الكلاسيكية، إلى Ghyma68 بتصاميمه العصرية، وDesignerr Mix بلمساته الفنية، نحن نقدم لكم مزيجًا متناغمًا يلبي جميع الأذواق والمناسبات.
                </p>
                <p>
                  رؤيتنا هي أن نكون أكثر من مجرد متجر، بل وجهة لكل من يبحث عن التميز والتفرد. نحن ملتزمون بتقديم خدمة عملاء استثنائية، وتجربة تسوق سهلة وممتعة، مع ضمان وصول منتجاتكم بأسرع وقت وبأفضل حالة.
                </p>
                <p>
                  شكرًا لكونكم جزءًا من حلمنا.
                </p>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutUsPage;
