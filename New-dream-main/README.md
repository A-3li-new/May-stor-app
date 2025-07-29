# 🌟 Dream Boutique - متجر أحلام

![Dream Boutique Logo](https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/910249c9f1ce9578f1c98ada7b5b2bff.png)

## 📋 نظرة عامة

**Dream Boutique** هو متجر إلكتروني متطور يجمع ثلاثة براندات متميزة تحت مظلة واحدة، مبني بتقنيات حديثة ويوفر تجربة تسوق مميزة للعملاء ونظام إدارة شامل لأصحاب المتجر.

### 🏷️ البراندات المميزة
- **Classic Color Shop** - متجر الألوان الكلاسيكية للأزياء العصرية
- **Ghyma68** - أزياء عصرية ومميزة للجميع  
- **Designer Mix** - خليط من التصاميم المبتكرة والمتميزة

## ✨ المميزات الرئيسية

### 🛍️ للعملاء
- **تصفح سهل وسريع** للمنتجات مع صور عالية الجودة
- **البحث والفلترة** المتقدمة حسب البراند والفئة
- **سلة تسوق ذكية** مع حفظ المنتجات
- **نظام المفضلة** ❤️ لحفظ المنتجات المحببة
- **تتبع الطلبات** بأرقام مرجعية فريدة
- **خيار الضيف** للشراء السريع دون تسجيل
- **الدفع عند الاستلام** آمن ومضمون

### 👨‍💼 للإدارة
- **لوحة تحكم شاملة** مع واجهة سهلة الاستخدام
- **إدارة المنتجات** مع صور متعددة وتفاصيل كاملة
- **متابعة الطلبات** وتحديث حالاتها فوريًا
- **إدارة الموظفين** مع نظام صلاحيات متقدم
- **المنتجات المميزة** لعرض أفضل المنتجات
- **تقارير وإحصائيات** مفصلة للمبيعات والأداء
- **نظام إشعارات** للطلبات الجديدة والتحديثات

## 🚀 التقنيات المستخدمة

- **React 18.2.0** - إطار العمل الأساسي
- **Vite 4.4.5** - أداة البناء السريعة
- **Tailwind CSS 3.3.3** - للتصميم المتجاوب
- **Framer Motion** - للانيميشن والحركة
- **Radix UI** - مكونات واجهة المستخدم
- **React Router** - للتنقل بين الصفحات
- **Lucide React** - مكتبة الأيقونات

## 📥 التثبيت والتشغيل

### المتطلبات الأساسية
```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### خطوات التثبيت
```bash
# 1. استنساخ المشروع
git clone https://github.com/your-username/dream-boutique.git
cd dream-boutique

# 2. تثبيت المتطلبات
npm install

# 3. تشغيل المشروع في بيئة التطوير
npm run dev

# 4. بناء المشروع للإنتاج
npm run build

# 5. معاينة البناء
npm run preview
```

## 🔐 الدخول للوحة التحكم

### الطرق السرية للوصول
1. **اختصار لوحة المفاتيح:** اضغط `Ctrl + Alt + D`
2. **النقر السري:** انقر 5 مرات سريعة على شعار الموقع
3. **الرابط المباشر:** `/admin` (يتطلب تسجيل دخول)

### حسابات افتراضية

**مدير النظام:**
- البريد الإلكتروني: `admin@dreamboutique.com`
- كلمة المرور: `admin123`

**الموظف:**  
- البريد الإلكتروني: `employee@dreamboutique.com`
- كلمة المرور: `emp123`

## 📁 هيكل المشروع

```
src/
├── components/          # المكونات القابلة للإعادة الاستخدام
│   ├── ui/             # مكونات الواجهة الأساسية
│   ├── admin/          # مكونات لوحة التحكم
│   ├── Header.jsx      # شريط التنقل العلوي
│   ├── Footer.jsx      # ذيل الصفحة
│   ├── ProductCard.jsx # بطاقة عرض المنتج
│   └── BrandCard.jsx   # بطاقة عرض البراند
├── contexts/           # إدارة الحالة العامة
│   ├── AuthContext.jsx     # إدارة المصادقة
│   ├── CartContext.jsx     # إدارة سلة التسوق
│   ├── FavoritesContext.jsx # إدارة المفضلة
│   ├── LanguageContext.jsx  # إدارة اللغة
│   └── ThemeContext.jsx     # إدارة المظهر
├── pages/              # صفحات التطبيق
│   ├── HomePage.jsx         # الصفحة الرئيسية
│   ├── AdminDashboard.jsx   # لوحة التحكم
│   ├── BrandPage.jsx        # صفحة البراند
│   ├── CartPage.jsx         # صفحة السلة
│   ├── CheckoutPage.jsx     # صفحة الدفع
│   └── LoginPage.jsx        # صفحة تسجيل الدخول
├── utils/              # أدوات مساعدة
│   └── database.js     # إدارة قاعدة البيانات
└── lib/                # مكتبات مساعدة
```

## 🎯 الصفحات والواجهات

### 🏠 الصفحة الرئيسية `/`
- عرض البراندات الثلاثة مع لوجوهاتها
- قسم المنتجات المميزة
- روابط التنقل السريع

### 🏪 صفحة البراند `/brand/:brandId`
- عرض منتجات براند محدد
- فلترة وبحث متقدم
- إضافة سريعة للسلة والمفضلة

### 🛒 صفحة السلة `/cart`
- عرض المنتجات المضافة
- تعديل الكميات
- حساب المجموع التلقائي

### 💳 صفحة الدفع `/checkout`
- نموذج معلومات العميل
- خيار الضيف أو إنشاء حساب
- ملخص الطلب وتأكيد الشراء

### 📦 تتبع الطلبات `/tracking`
- البحث برقم الطلب
- عرض حالة الشحن
- تفاصيل الطلب الكاملة

### ⚙️ لوحة التحكم `/admin`
- إدارة شاملة للمنتجات والطلبات
- نظام صلاحيات متقدم
- تقارير وإحصائيات مفصلة

## 🎨 التخصيص والإعدادات

### تغيير البراندات
```javascript
// في src/pages/HomePage.jsx
const brands = [
  {
    id: 'your-brand-id',
    name: 'اسم البراند',
    instagramUrl: 'https://instagram.com/your-brand',
    logoUrl: 'رابط-اللوجو'
  }
  // إضافة المزيد...
];
```

### تخصيص الألوان
```css
/* في tailwind.config.js */
theme: {
  extend: {
    colors: {
      primary: 'your-primary-color',
      secondary: 'your-secondary-color'
    }
  }
}
```

## 🛡️ الأمان والحماية

- **مصادقة متقدمة** مع تشفير كلمات المرور
- **نظام صلاحيات** متعدد المستويات
- **حماية من XSS** و CSRF
- **تشفير البيانات الحساسة**
- **نسخ احتياطية** آلية للبيانات

## 📊 قاعدة البيانات

يستخدم المشروع localStorage كقاعدة بيانات مؤقتة مع إمكانية الترقية لقواعد بيانات حقيقية:

### الجداول المتاحة
- `products` - المنتجات والتفاصيل
- `orders` - الطلبات وحالاتها
- `customers` - بيانات العملاء
- `users` - المستخدمين والصلاحيات
- `favorites` - المنتجات المفضلة
- `featured` - المنتجات المميزة

### استخدام قاعدة البيانات
```javascript
import db from './utils/database.js';

// إضافة منتج جديد
const newProduct = db.add('products', {
  name: 'اسم المنتج',
  price: 100,
  brand: 'اسم البراند'
});

// الحصول على جميع المنتجات
const products = db.get('products');

// البحث في المنتجات
const results = db.search('products', 'كلمة البحث');
```

## 🚀 النشر والإنتاج

### خيارات الاستضافة المقترحة
- **Vercel** - نشر مجاني وسريع
- **Netlify** - واجهة سهلة وخدمات متقدمة
- **GitHub Pages** - استضافة مجانية من GitHub

### خطوات النشر

#### Vercel
```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel --prod
```

#### Netlify
```bash
# بناء المشروع
npm run build

# رفع مجلد dist إلى Netlify
```

## 🤝 المساهمة في المشروع

نرحب بمساهماتكم! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. إنشاء branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للـ branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📝 التراخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 🐛 الإبلاغ عن الأخطاء

إذا وجدت خطأ أو لديك اقتراح، يرجى:
- فتح [Issue جديد](https://github.com/your-username/dream-boutique/issues)
- وصف المشكلة بالتفصيل
- إرفاق صور أو أكواد إن أمكن

## 📞 التواصل والدعم

- **البريد الإلكتروني:** support@dreamboutique.com
- **واتساب:** +962 79 123 4567
- **إنستغرام:** [@dreamboutique](https://instagram.com/dreamboutique)

## 🔮 الخطط المستقبلية

- [ ] تطوير API Backend
- [ ] دمج بوابات دفع إلكتروني
- [ ] تطبيق موبايل
- [ ] إشعارات فورية
- [ ] دردشة مباشرة
- [ ] تحليلات متقدمة
- [ ] دعم متعدد اللغات كامل

## 🙏 شكر وتقدير

شكر خاص لجميع المساهمين والمطورين الذين ساعدوا في إنجاز هذا المشروع.

---

## 📈 إحصائيات المشروع

![GitHub stars](https://img.shields.io/github/stars/your-username/dream-boutique?style=social)
![GitHub forks](https://img.shields.io/github/forks/your-username/dream-boutique?style=social)
![GitHub issues](https://img.shields.io/github/issues/your-username/dream-boutique)
![GitHub license](https://img.shields.io/github/license/your-username/dream-boutique)

---

**مطور بـ ❤️ في الأردن** 🇯🇴

[⬆️ العودة للأعلى](#-dream-boutique---متجر-أحلام)