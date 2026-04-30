import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  // Get cart key based on user ID to isolate carts per user
  const getCartKey = () => {
    return user?.id ? `cart_${user.id}` : 'cart_guest';
  };

  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem(getCartKey());
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error('Could not parse cart data from localStorage', error);
      return [];
    }
  });

  // Save cart to user-specific localStorage key
  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cartItems));
  }, [cartItems, user]);

  // Clear cart when user changes (login/logout)
  useEffect(() => {
    try {
      const localData = localStorage.getItem(getCartKey());
      setCartItems(localData ? JSON.parse(localData) : []);
    } catch (error) {
      console.error('Could not load cart for user', error);
      setCartItems([]);
    }
  }, [user?.id]);

  const addToCart = (product, quantity = 1) => {
    const qty = product.quantity || quantity;
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: qty }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item => (item.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
