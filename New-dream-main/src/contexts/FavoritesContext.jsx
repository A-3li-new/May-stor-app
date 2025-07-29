import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // تحميل المفضلة من localStorage عند بداية التطبيق
  useEffect(() => {
    const savedFavorites = localStorage.getItem('dream-boutique-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // حفظ المفضلة في localStorage عند تغييرها
  useEffect(() => {
    localStorage.setItem('dream-boutique-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // إضافة منتج للمفضلة
  const addToFavorites = (product) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(item => item.id === product.id);
      if (!isAlreadyFavorite) {
        return [...prev, product];
      }
      return prev;
    });
  };

  // إزالة منتج من المفضلة
  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  // تبديل حالة المفضلة (إضافة أو إزالة)
  const toggleFavorite = (product) => {
    const isAlreadyFavorite = favorites.some(item => item.id === product.id);
    if (isAlreadyFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // فحص ما إذا كان المنتج في المفضلة
  const isFavorite = (productId) => {
    return favorites.some(item => item.id === productId);
  };

  // مسح جميع المفضلة
  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};