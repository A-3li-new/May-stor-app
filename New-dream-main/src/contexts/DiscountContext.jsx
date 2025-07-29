// src/contexts/DiscountContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const DiscountContext = createContext();

export const useDiscount = () => {
  const context = useContext(DiscountContext);
  if (!context) {
    throw new Error('useDiscount must be used within a DiscountProvider');
  }
  return context;
};

export const DiscountProvider = ({ children }) => {
  const [discounts, setDiscounts] = useState([]);

  // Load discounts from localStorage when the component mounts
  useEffect(() => {
    const savedDiscounts = localStorage.getItem('dream-boutique-discounts');
    if (savedDiscounts) {
      setDiscounts(JSON.parse(savedDiscounts));
    }
  }, []);

  // Save discounts to localStorage whenever they change
  const saveDiscounts = (updatedDiscounts) => {
    setDiscounts(updatedDiscounts);
    localStorage.setItem('dream-boutique-discounts', JSON.stringify(updatedDiscounts));
  };

  // Add a new discount
  const addDiscount = (discount) => {
    const newDiscount = { ...discount, id: Date.now(), isActive: true }; // Add unique ID and active status
    const updatedDiscounts = [...discounts, newDiscount];
    saveDiscounts(updatedDiscounts);
  };

  // Update an existing discount
  const updateDiscount = (updatedDiscount) => {
    const updatedDiscounts = discounts.map(d =>
      d.id === updatedDiscount.id ? { ...updatedDiscount } : d
    );
    saveDiscounts(updatedDiscounts);
  };

  // Delete a discount by ID
  const deleteDiscount = (discountId) => {
    const updatedDiscounts = discounts.filter(d => d.id !== discountId);
    saveDiscounts(updatedDiscounts);
  };

  // Toggle active status of a discount
  const toggleDiscountStatus = (discountId) => {
    const updatedDiscounts = discounts.map(d =>
      d.id === discountId ? { ...d, isActive: !d.isActive } : d
    );
    saveDiscounts(updatedDiscounts);
  };

  // Function to apply discounts to a given total.
  // This will be called in CartContext
  const applyDiscounts = (total, couponCode = null) => {
    let finalTotal = total;
    let appliedDiscount = null;

    // First, check for a specific coupon code if provided
    if (couponCode) {
      const coupon = discounts.find(d => 
        d.code && d.code.toLowerCase() === couponCode.toLowerCase() && d.isActive
      );
      if (coupon) {
        if (coupon.type === 'percentage') {
          finalTotal = total * (1 - coupon.value / 100);
        } else if (coupon.type === 'fixed') {
          finalTotal = Math.max(0, total - coupon.value); // Ensure total doesn't go below 0
        }
        appliedDiscount = coupon;
        // For simplicity, we assume only one coupon can be applied for now
        return { finalTotal, appliedDiscount };
      }
    }

    // If no coupon code provided or not found, apply automatic discounts (if any)
    // For now, we'll only apply the first active automatic discount found
    // You might want to implement more complex logic (e.g., best discount) later
    const automaticDiscount = discounts.find(d => !d.code && d.isActive);
    if (automaticDiscount) {
      if (automaticDiscount.type === 'percentage') {
        finalTotal = total * (1 - automaticDiscount.value / 100);
      } else if (automaticDiscount.type === 'fixed') {
        finalTotal = Math.max(0, total - automaticDiscount.value);
      }
      appliedDiscount = automaticDiscount;
    }

    return { finalTotal, appliedDiscount };
  };

  return (
    <DiscountContext.Provider value={{
      discounts,
      addDiscount,
      updateDiscount,
      deleteDiscount,
      toggleDiscountStatus,
      applyDiscounts // This function will be used by CartContext
    }}>
      {children}
    </DiscountContext.Provider>
  );
};