// Database utility for Dream Boutique
// يدير جميع البيانات في localStorage بطريقة منظمة

class DreamBoutiqueDB {
  constructor() {
    this.prefix = 'dream-boutique-';
    this.initializeDB();
  }

  // تهيئة قاعدة البيانات مع البيانات الافتراضية
  initializeDB() {
    this.ensureTable('products', []);
    this.ensureTable('orders', []);
    this.ensureTable('customers', []);
    this.ensureTable('favorites', []);
    this.ensureTable('featured', this.getDefaultFeatured());
    this.ensureTable('users', this.getDefaultUsers());
    this.ensureTable('settings', this.getDefaultSettings());
    this.ensureTable('brands', this.getDefaultBrands());
    this.ensureTable('discounts', []);
    this.ensureTable('attendance', {});
    this.ensureTable('notifications', []);
  }

  // التأكد من وجود جدول، وإنشاؤه مع البيانات الافتراضية إذا لم يكن موجود
  ensureTable(tableName, defaultData) {
    const key = this.prefix + tableName;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(defaultData));
    }
  }

  // قراءة البيانات من جدول
  get(tableName) {
    const key = this.prefix + tableName;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // كتابة البيانات إلى جدول
  set(tableName, data) {
    const key = this.prefix + tableName;
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }

  // إضافة عنصر جديد إلى جدول
  add(tableName, item) {
    const data = this.get(tableName) || [];
    const newItem = { ...item, id: item.id || Date.now() };
    data.push(newItem);
    this.set(tableName, data);
    return newItem;
  }

  // تحديث عنصر في جدول
  update(tableName, id, updates) {
    const data = this.get(tableName) || [];
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates };
      this.set(tableName, data);
      return data[index];
    }
    return null;
  }

  // حذف عنصر من جدول
  delete(tableName, id) {
    const data = this.get(tableName) || [];
    const filteredData = data.filter(item => item.id !== id);
    this.set(tableName, filteredData);
    return filteredData;
  }

  // البحث في جدول
  search(tableName, query, fields = ['name']) {
    const data = this.get(tableName) || [];
    return data.filter(item => 
      fields.some(field => 
        item[field] && item[field].toString().toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  // فلترة البيانات في جدول
  filter(tableName, filterFn) {
    const data = this.get(tableName) || [];
    return data.filter(filterFn);
  }

  // إحصائيات المشروع
  getStats() {
    return {
      products: (this.get('products') || []).length,
      orders: (this.get('orders') || []).length,
      customers: (this.get('customers') || []).length,
      totalRevenue: (this.get('orders') || [])
        .filter(order => order.status === 'delivered')
        .reduce((total, order) => total + (order.total || 0), 0),
      pendingOrders: (this.get('orders') || [])
        .filter(order => order.status === 'pending').length,
      featuredProducts: (this.get('featured') || []).length
    };
  }

  // البيانات الافتراضية للمستخدمين
  getDefaultUsers() {
    return [
      {
        id: 1,
        username: 'admin',
        email: 'admin@dreamboutique.com',
        password: 'admin123',
        role: 'admin',
        name: 'مدير النظام',
        phone: '0791234567',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        username: 'employee',
        email: 'employee@dreamboutique.com',
        password: 'emp123',
        role: 'employee',
        name: 'موظف المبيعات',
        phone: '0797654321',
        salary: 500,
        status: 'نشط',
        createdAt: new Date().toISOString()
      }
    ];
  }

  // البيانات الافتراضية للبراندات
  getDefaultBrands() {
    return [
      {
        id: 'classic.color.shop',
        name: 'Classic Color Shop',
        instagramUrl: 'https://instagram.com/classic.color.shop',
        logoUrl: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/fbb2966d7e2e39d32840d58ba2d56c94.jpg',
        description: 'متجر الألوان الكلاسيكية للأزياء العصرية'
      },
      {
        id: 'ghyma68',
        name: 'Ghyma68',
        instagramUrl: 'https://instagram.com/ghyma68',
        logoUrl: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/652f740e3a30ea89413bcfee1ead3fe4.jpg',
        description: 'أزياء عصرية ومميزة للجميع'
      },
      {
        id: 'designerr.mix',
        name: 'Designer Mix',
        instagramUrl: 'https://instagram.com/designerr.mix',
        logoUrl: 'https://storage.googleapis.com/hostinger-horizons-assets-prod/9e7c6965-5d7f-4551-9915-dd4bdd37eb3b/9011a125f34487b6e4f3719fcea6f031.jpg',
        description: 'خليط من التصاميم المبتكرة والمتميزة'
      }
    ];
  }

  // البيانات الافتراضية للمنتجات المميزة
  getDefaultFeatured() {
    return [
      {
        id: 1,
        name: 'فستان أنيق للمناسبات الخاصة',
        price: 85,
        brand: 'classic.color.shop',
        inStock: true,
        images: ['https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=1887'],
        colors: ['أسود', 'أزرق داكن'],
        sizes: ['S', 'M', 'L'],
        description: 'فستان أنيق ومميز مناسب للمناسبات الخاصة'
      },
      {
        id: 2,
        name: 'حقيبة يد عصرية وأنيقة',
        price: 120,
        brand: 'ghyma68',
        inStock: true,
        images: ['https://images.unsplash.com/photo-1590739242442-369ce0a3cc4a?q=80&w=1887'],
        colors: ['بني', 'أسود', 'بيج'],
        sizes: ['واحد'],
        description: 'حقيبة يد عصرية مصنوعة من مواد عالية الجودة'
      },
      {
        id: 3,
        name: 'إكسسوارات مميزة للإطلالة المثالية',
        price: 45,
        brand: 'designerr.mix',
        inStock: true,
        images: ['https://images.unsplash.com/photo-1611652022417-a55339f97233?q=80&w=1887'],
        colors: ['ذهبي', 'فضي'],
        sizes: ['واحد'],
        description: 'مجموعة إكسسوارات متنوعة لإطلالة مثالية'
      },
      {
        id: 4,
        name: 'مجموعة مكياج احترافية',
        price: 95,
        brand: 'classic.color.shop',
        inStock: false,
        images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080'],
        colors: ['متعدد الألوان'],
        sizes: ['مجموعة كاملة'],
        description: 'مجموعة مكياج احترافية شاملة'
      }
    ];
  }

  // الإعدادات الافتراضية
  getDefaultSettings() {
    return {
      siteName: 'Dream Boutique',
      currency: 'JOD',
      language: 'ar',
      theme: 'light',
      notifications: {
        orders: true,
        promotions: true,
        updates: true
      },
      shipping: {
        freeShippingThreshold: 50,
        defaultShippingCost: 5
      },
      social: {
        instagram: 'https://instagram.com/dreamboutique',
        whatsapp: '+962791234567',
        email: 'info@dreamboutique.com'
      }
    };
  }

  // تصدير البيانات لنسخة احتياطية
  exportData() {
    const data = {};
    const tables = ['products', 'orders', 'customers', 'favorites', 'featured', 'users', 'settings', 'brands', 'discounts', 'attendance', 'notifications'];
    
    tables.forEach(table => {
      data[table] = this.get(table);
    });

    return {
      data,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }

  // استيراد البيانات من نسخة احتياطية
  importData(backupData) {
    try {
      if (backupData.data) {
        Object.keys(backupData.data).forEach(table => {
          this.set(table, backupData.data[table]);
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('خطأ في استيراد البيانات:', error);
      return false;
    }
  }

  // مسح جميع البيانات
  clearAll() {
    const tables = ['products', 'orders', 'customers', 'favorites', 'featured', 'users', 'settings', 'brands', 'discounts', 'attendance', 'notifications'];
    tables.forEach(table => {
      localStorage.removeItem(this.prefix + table);
    });
    this.initializeDB();
  }

  // فحص سلامة البيانات
  validateData() {
    const issues = [];
    const tables = ['products', 'orders', 'customers', 'users'];
    
    tables.forEach(table => {
      const data = this.get(table);
      if (!Array.isArray(data)) {
        issues.push(`جدول ${table} غير صحيح`);
      }
    });

    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

// إنشاء instance واحد للاستخدام في التطبيق
const db = new DreamBoutiqueDB();

export default db;