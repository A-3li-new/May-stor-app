// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Package, ShoppingBag, Star, Plus, Edit, Trash2, Search,
  Users, BarChart2, Tag, Bell
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import ProductDialog from '@/components/admin/ProductDialog';
import OrdersTable from '@/components/admin/OrdersTable';
import FeaturedManager from '@/components/admin/FeaturedManager';
import DiscountManager from '@/components/admin/DiscountManager';
import ReportsDashboard from '@/components/admin/ReportsDashboard';

const AdminDashboard = () => {
  const navigate = window.location ? (path => window.location.replace(path)) : () => {};
  const { user, loading } = useAuth();

  // شرط حماية: إذا لم يكن هناك مستخدم أو الصلاحية غير مناسبة، إعادة التوجيه
  if (!loading && (!user || !(user.role === 'admin' || user.role === 'employee'))) {
    navigate('/login');
    return null;
  }
  // إعداد الصورة الافتراضية للمنتج
  const [defaultImage, setDefaultImage] = useState(() => {
    return localStorage.getItem('dream-boutique-default-image');
  });
  const defaultImageInputRef = React.useRef(null);

  const handleDefaultImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDefaultImage(reader.result);
        localStorage.setItem('dream-boutique-default-image', reader.result);
        toast({ title: 'تم تغيير الصورة الافتراضية للمنتج', duration: 2000 });
      };
      reader.readAsDataURL(file);
    }
  };
  const { t } = useLanguage();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [notifText, setNotifText] = useState('');
  const [notifType, setNotifType] = useState('info');
  const [activeTab, setActiveTab] = useState('products');
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('dream-boutique-users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  // سجل الحضور والانصراف لكل موظف
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('dream-boutique-attendance');
    return saved ? JSON.parse(saved) : {};
  });
  // تحديث سجل الحضور في localStorage
  const saveAttendance = (newAttendance) => {
    setAttendance(newAttendance);
    localStorage.setItem('dream-boutique-attendance', JSON.stringify(newAttendance));
  };
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userSearch, setUserSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  // حالة إظهار نموذج تغيير كلمة المرور
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const brands = [
    { id: 'classic.color.shop', name: t('classicColorShop') },
    { id: 'ghyma68', name: t('ghyma68') },
    { id: 'designerr.mix', name: t('designerrMix') }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedProducts = localStorage.getItem('dream-boutique-products');
    setProducts(savedProducts ? JSON.parse(savedProducts) : []);
    const savedOrders = localStorage.getItem('dream-boutique-orders');
    setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    const savedFeatured = localStorage.getItem('dream-boutique-featured');
    setFeaturedProducts(savedFeatured ? JSON.parse(savedFeatured) : []);
    const savedUsers = localStorage.getItem('dream-boutique-users');
    setUsers(savedUsers ? JSON.parse(savedUsers) : []);
  };
  // إضافة أو تعديل موظف
  const handleSaveUser = (userData) => {
    let updatedUsers;
    if (editingUser) {
      updatedUsers = users.map(u => u.id === editingUser.id ? { ...userData, id: editingUser.id } : u);
      toast({ title: 'تم تحديث بيانات الموظف', duration: 2000 });
    } else {
      const newUser = { ...userData, id: Date.now() };
      updatedUsers = [newUser, ...users];
      toast({ title: 'تم إضافة موظف جديد', duration: 2000 });
    }
    setUsers(updatedUsers);
    localStorage.setItem('dream-boutique-users', JSON.stringify(updatedUsers));
    setIsUserDialogOpen(false);
    setEditingUser(null);
  };

  // تسجيل حضور أو انصراف
  const handleAttendance = (userId, type) => {
    const today = new Date().toISOString().slice(0, 10);
    const userAttendance = attendance[userId] || [];
    userAttendance.push({ date: today, type });
    const newAttendance = { ...attendance, [userId]: userAttendance };
    saveAttendance(newAttendance);
    toast({ title: `تم تسجيل ${type === 'in' ? 'حضور' : 'انصراف'} للموظف`, duration: 2000 });
  };

  // احتساب الحضور الأسبوعي والراتب
  const getWeeklyStats = (userId, salary) => {
    const userAttendance = attendance[userId] || [];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekRecords = userAttendance.filter(a => new Date(a.date) >= weekAgo);
    const daysPresent = weekRecords.filter(a => a.type === 'in').length;
    const weeklySalary = salary ? Math.round((salary / 30) * daysPresent) : 0;
    return { daysPresent, weeklySalary };
  };

  // حذف موظف
  const handleDeleteUser = (userId) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('dream-boutique-users', JSON.stringify(updatedUsers));
    toast({ title: 'تم حذف الموظف', duration: 2000 });
  };

  // تعديل موظف
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };

  // بحث الموظفين
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSaveProduct = (productData) => {
    let updatedProducts;
    if (editingProduct) {
      updatedProducts = products.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p);
      toast({ title: t('productUpdated'), duration: 3000 });
    } else {
      const newProduct = { ...productData, id: Date.now() };
      updatedProducts = [newProduct, ...products];
      toast({ title: t('productAdded'), duration: 3000 });
    }
    setProducts(updatedProducts);
    localStorage.setItem('dream-boutique-products', JSON.stringify(updatedProducts));
    setIsProductDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('dream-boutique-products', JSON.stringify(updatedProducts));
    toast({ title: t('productDeleted'), duration: 3000 });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filterBrand === 'all' || product.brand === filterBrand; // <--- تأكد من إصلاح هذه النقطة: كان || product.brand === filterBrand;
    return matchesSearch && matchesBrand;
  });

  const handleFeatureClick = () => {
    setActiveTab('users');
  };

  // تقسيم التبويبات حسب الدور
  const adminTabs = [
    { id: 'products', label: t('productManagement'), icon: Package },
    { id: 'orders', label: t('orderManagement'), icon: ShoppingBag },
    { id: 'featured', label: t('featuredManagement'), icon: Star },
    { id: 'discounts', label: t('discountManagement'), icon: Tag },
    { id: 'users', label: t('userManagement'), icon: Users, action: handleFeatureClick },
    { id: 'admin-settings', label: 'مدير النظام', icon: Bell },
    { id: 'reports', label: t('reportsAndSales'), icon: BarChart2 },
  ];
  const employeeTabs = [
    { id: 'products', label: t('productManagement'), icon: Package },
    { id: 'orders', label: t('orderManagement'), icon: ShoppingBag },
  ];
  const availableTabs = user?.role === 'admin' ? adminTabs : employeeTabs;

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <span className="text-lg text-muted-foreground">جاري تحميل بيانات المستخدم...</span>
        </div>
      ) : (
        <div>
          <Helmet>
            <title>{t('dashboard')} - Dream Boutique</title>
            <meta name="description" content="لوحة التحكم الإدارية لإدارة المنتجات والطلبات في Dream Boutique." />
          </Helmet>
          <div className="flex flex-col min-h-screen">
            {/* الهيدر بدون زر إدارة كلمة المرور */}
            <Header />
            <main className="flex-grow">
              <div className="container mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <h1 className="text-4xl font-bold text-foreground mb-8 text-center">{t('dashboard')}</h1>
                  <div className="flex flex-wrap justify-center mb-8 gap-2">
                    {availableTabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'default' : 'outline'}
                        onClick={tab.action ? tab.action : () => setActiveTab(tab.id)}
                        className="flex items-center gap-2"
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </Button>
                    ))}
                    <div className="max-w-md mx-auto mt-8">
                      <h2 className="text-xl font-bold mb-4 text-center">إعدادات مدير النظام</h2>
                      <Button variant="outline" size="sm" onClick={() => setShowPasswordDialog(true)} className="flex gap-2 mb-4 mx-auto">
                        <span>إدارة كلمة المرور</span>
                      </Button>
                      {/* نموذج تغيير كلمة المرور */}
                      {showPasswordDialog && (
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                          <div className="bg-white dark:bg-background rounded-lg shadow-lg p-6 w-full max-w-md border">
                            <h2 className="text-xl font-bold mb-4 text-center">تغيير كلمة المرور</h2>
                            <div className="space-y-3">
                              <input
                                type="password"
                                placeholder="كلمة المرور الحالية"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded border bg-background text-foreground"
                              />
                              <input
                                type="password"
                                placeholder="كلمة المرور الجديدة"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded border bg-background text-foreground"
                              />
                              <input
                                type="password"
                                placeholder="تأكيد كلمة المرور الجديدة"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded border bg-background text-foreground"
                              />
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button variant="default" className="flex-1" onClick={() => {
                                if (!oldPassword || !newPassword || !confirmPassword) {
                                  toast({ title: 'يرجى ملء جميع الحقول', duration: 2000 });
                                  return;
                                }
                                if (newPassword !== confirmPassword) {
                                  toast({ title: 'كلمة المرور الجديدة غير متطابقة', duration: 2000 });
                                  return;
                                }
                                // هنا يتم تنفيذ تغيير كلمة المرور فعليًا (مثال: تحديث في قاعدة البيانات أو localStorage)
                                // في هذا المثال سنعرض رسالة نجاح فقط
                                toast({ title: 'تم تغيير كلمة المرور بنجاح', duration: 2000 });
                                setShowPasswordDialog(false);
                                setOldPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                              }}>تغيير</Button>
                              <Button variant="outline" className="flex-1" onClick={() => {
                                setShowPasswordDialog(false);
                                setOldPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                              }}>إلغاء</Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* زر إرسال إشعار */}
                    <div className="flex items-center gap-2 border rounded-lg p-2 bg-muted/30">
                      <input
                        type="text"
                        value={notifText}
                        onChange={e => setNotifText(e.target.value)}
                        placeholder={t('notificationText') || 'نص الإشعار'}
                        className="px-2 py-1 rounded border bg-background text-foreground text-sm"
                      />
                      <select value={notifType} onChange={e => setNotifType(e.target.value)} className="px-2 py-1 rounded border text-sm">
                        <option value="info">معلومة</option>
                        <option value="offer">عرض</option>
                        <option value="order">طلب</option>
                        <option value="update">تحديث</option>
                      </select>
                      <Button size="sm" onClick={() => {
                        if (notifText.trim()) {
                          addNotification({
                            message: notifText,
                            type: notifType,
                            time: new Date().toLocaleString('ar-EG')
                          });
                          setNotifText('');
                          toast({ title: 'تم إرسال الإشعار', duration: 2000 });
                        }
                      }}>إرسال إشعار</Button>
                    </div>
                  </div>

                  {activeTab === 'products' && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
                        <div className="flex gap-4">
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="البحث عن منتج..."
                            className="px-3 py-2 rounded border bg-background text-foreground"
                          />
                          <select 
                            value={filterBrand} 
                            onChange={(e) => setFilterBrand(e.target.value)}
                            className="px-3 py-2 rounded border bg-background text-foreground"
                          >
                            <option value="all">جميع البراندات</option>
                            {brands.map(brand => (
                              <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                          </select>
                        </div>
                        <Button 
                          onClick={() => { setEditingProduct(null); setIsProductDialogOpen(true); }} 
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" /> إضافة منتج
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                          <div key={product.id} className="border rounded-lg p-4 bg-card shadow-sm">
                            <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package className="h-12 w-12" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                            <div className="space-y-1 text-sm text-muted-foreground mb-4">
                              <p>السعر: {product.price} {t('jod')}</p>
                              <p>البراند: {brands.find(b => b.id === product.brand)?.name}</p>
                              <p>الكمية: {product.quantity || 0}</p>
                              {product.color && <p>اللون: {product.color}</p>}
                              {product.size && <p>المقاس: {product.size}</p>}
                              <p className={`${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {product.inStock ? 'متوفر' : 'غير متوفر'}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleEditProduct(product)}
                                className="flex-1"
                              >
                                <Edit className="h-4 w-4" />
                                تعديل
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="flex-1"
                              >
                                <Trash2 className="h-4 w-4" />
                                حذف
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {filteredProducts.length === 0 && (
                        <div className="text-center py-12">
                          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <p className="text-lg text-muted-foreground">لا توجد منتجات</p>
                          <p className="text-sm text-muted-foreground">ابدأ بإضافة منتج جديد</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'users' && (
                    <div className="space-y-6">
                      {/* زر إدارة كلمة المرور يظهر فقط للمدير داخل قسم المستخدمين */}
                      {user?.role === 'admin' && (
                        <div className="flex justify-end mb-4">
                          <Button variant="outline" size="sm" onClick={() => setShowPasswordDialog(true)} className="flex gap-2">
                            <span>إدارة كلمة المرور</span>
                          </Button>
                        </div>
                      )}
                      {/* نموذج تغيير كلمة المرور */}
                      {showPasswordDialog && (
                        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                          <div className="bg-white dark:bg-background rounded-lg shadow-lg p-6 w-full max-w-md border">
                            <h2 className="text-xl font-bold mb-4 text-center">تغيير كلمة المرور</h2>
                            <div className="space-y-3">
                              <input
                                type="password"
                                placeholder="كلمة المرور الحالية"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded border bg-background text-foreground"
                              />
                              <input
                                type="password"
                                placeholder="كلمة المرور الجديدة"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded border bg-background text-foreground"
                              />
                              <input
                                type="password"
                                placeholder="تأكيد كلمة المرور الجديدة"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded border bg-background text-foreground"
                              />
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button variant="default" className="flex-1" onClick={() => {
                                if (!oldPassword || !newPassword || !confirmPassword) {
                                  toast({ title: 'يرجى ملء جميع الحقول', duration: 2000 });
                                  return;
                                }
                                if (newPassword !== confirmPassword) {
                                  toast({ title: 'كلمة المرور الجديدة غير متطابقة', duration: 2000 });
                                  return;
                                }
                                // هنا يتم تنفيذ تغيير كلمة المرور فعليًا (مثال: تحديث في قاعدة البيانات أو localStorage)
                                // في هذا المثال سنعرض رسالة نجاح فقط
                                toast({ title: 'تم تغيير كلمة المرور بنجاح', duration: 2000 });
                                setShowPasswordDialog(false);
                                setOldPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                              }}>تغيير</Button>
                              <Button variant="outline" className="flex-1" onClick={() => {
                                setShowPasswordDialog(false);
                                setOldPassword('');
                                setNewPassword('');
                                setConfirmPassword('');
                              }}>إلغاء</Button>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-4">
                        <input
                          type="text"
                          value={userSearch}
                          onChange={e => setUserSearch(e.target.value)}
                          placeholder="بحث باسم أو بريد الموظف أو رقم الهاتف"
                          className="px-3 py-2 rounded border bg-background text-foreground max-w-xs"
                        />
                        <Button onClick={() => { setEditingUser(null); setIsUserDialogOpen(true); }} className="flex items-center gap-2">
                          <Plus className="h-4 w-4" /> إضافة موظف
                        </Button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border rounded-lg bg-card">
                          <thead>
                            <tr className="bg-muted/30">
                              <th className="p-2 border">الاسم</th>
                              <th className="p-2 border">رقم الهاتف</th>
                              <th className="p-2 border">البريد الإلكتروني</th>
                              <th className="p-2 border">الدور</th>
                              <th className="p-2 border">الراتب</th>
                              <th className="p-2 border">الحالة</th>
                              <th className="p-2 border">حضور الأسبوع</th>
                              <th className="p-2 border">راتب الأسبوع</th>
                              <th className="p-2 border">إجراءات</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.length > 0 ? filteredUsers.map(user => {
                              const stats = getWeeklyStats(user.id, user.salary);
                              return (
                                <tr key={user.id} className="border-b">
                                  <td className="p-2 border">{user.name}</td>
                                  <td className="p-2 border">{user.phone}</td>
                                  <td className="p-2 border">{user.email || '-'}</td>
                                  <td className="p-2 border">{user.role === 'admin' ? 'مدير' : 'موظف'}</td>
                                  <td className="p-2 border">{user.salary || '-'}</td>
                                  <td className="p-2 border">{user.status || 'نشط'}</td>
                                  <td className="p-2 border">{stats.daysPresent} يوم</td>
                                  <td className="p-2 border">{stats.weeklySalary} {t('jod')}</td>
                                  <td className="p-2 border flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>تعديل</Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(user.id)}>حذف</Button>
                                    <Button size="sm" variant="default" onClick={() => handleAttendance(user.id, 'in')}>حضور</Button>
                                    <Button size="sm" variant="outline" onClick={() => handleAttendance(user.id, 'out')}>انصراف</Button>
                                  </td>
                                </tr>
                              );
                            }) : (
                              <tr><td colSpan={9} className="text-center p-4 text-muted-foreground">لا يوجد موظفين</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {/* نموذج إضافة/تعديل موظف */}
                  {isUserDialogOpen && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-background rounded-lg shadow-lg p-6 w-full max-w-md border">
                        <h2 className="text-xl font-bold mb-4 text-center">{editingUser ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}</h2>
                        <form onSubmit={e => {
                          e.preventDefault();
                          const name = e.target.name.value.trim();
                          const phone = e.target.phone.value.trim();
                          const email = e.target.email.value.trim();
                          const password = e.target.password.value.trim();
                          const role = e.target.role.value;
                          const salary = e.target.salary.value;
                          const status = e.target.status.value;
                          if (!name || !phone || !role || !password) {
                            toast({ title: 'يرجى ملء جميع الحقول الإلزامية', duration: 2000 });
                            return;
                          }
                          handleSaveUser({
                            name,
                            phone,
                            email: email || undefined,
                            password,
                            role,
                            salary,
                            status,
                            id: editingUser?.id || undefined
                          });
                        }} className="space-y-3">
                          <input name="name" type="text" defaultValue={editingUser?.name || ''} placeholder="اسم الموظف (إجباري)" className="w-full px-3 py-2 rounded border bg-background text-foreground" required />
                          <input name="phone" type="text" defaultValue={editingUser?.phone || ''} placeholder="رقم الهاتف (إجباري)" className="w-full px-3 py-2 rounded border bg-background text-foreground" required />
                          <input name="email" type="email" defaultValue={editingUser?.email || ''} placeholder="البريد الإلكتروني (اختياري)" className="w-full px-3 py-2 rounded border bg-background text-foreground" />
                          <input name="password" type="password" defaultValue={editingUser?.password || ''} placeholder="كلمة المرور (إجباري)" className="w-full px-3 py-2 rounded border bg-background text-foreground" required />
                          <select name="role" defaultValue={editingUser?.role || 'employee'} className="w-full px-3 py-2 rounded border bg-background text-foreground" required>
                            <option value="employee">موظف</option>
                            <option value="admin">مدير</option>
                          </select>
                          <input name="salary" type="number" defaultValue={editingUser?.salary || ''} placeholder="الراتب الشهري (اختياري)" className="w-full px-3 py-2 rounded border bg-background text-foreground" />
                          <select name="status" defaultValue={editingUser?.status || 'نشط'} className="w-full px-3 py-2 rounded border bg-background text-foreground">
                            <option value="نشط">نشط</option>
                            <option value="موقوف">موقوف</option>
                          </select>
                          <div className="flex gap-2 mt-4">
                            <Button type="submit" variant="default" className="flex-1">{editingUser ? 'تحديث' : 'إضافة'}</Button>
                            <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsUserDialogOpen(false); setEditingUser(null); }}>إلغاء</Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )
                }
                {activeTab === 'orders' && (<OrdersTable orders={orders} setOrders={setOrders} />)}
                  {activeTab === 'featured' && (
                    <div>
                      <FeaturedManager
                        products={products}
                        featuredProducts={featuredProducts}
                        setFeaturedProducts={setFeaturedProducts}
                      />
                      <div className="mt-8 text-center">
                        <Button variant="outline" onClick={() => setActiveTab('products')}>
                          العودة لقائمة المنتجات
                        </Button>
                      </div>
                    </div>
                  )}
                  {activeTab === 'discounts' && (<DiscountManager />)}
                  {activeTab === 'reports' && (<ReportsDashboard products={products} orders={orders} users={users} />)}
                </motion.div>
              </div>
            </main>
            <Footer />
            <ProductDialog isOpen={isProductDialogOpen} onClose={() => { setIsProductDialogOpen(false); setEditingProduct(null); }} onSave={handleSaveProduct} product={editingProduct} brands={brands} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
