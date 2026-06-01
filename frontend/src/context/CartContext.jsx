import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from local storage
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to local storage
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = (product, qty = 1, size = 'M', color = 'Default') => {
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.product === product._id &&
        item.size === size &&
        item.color === color
    );

    let newCartItems = [...cartItems];

    if (existingItemIndex > -1) {
      const newQty = newCartItems[existingItemIndex].qty + qty;
      // Cap at count in stock
      newCartItems[existingItemIndex].qty = Math.min(
        newQty,
        product.countInStock
      );
    } else {
      newCartItems.push({
        product: product._id,
        name: product.name,
        image: product.images && product.images[0] ? product.images[0] : '',
        price: product.price,
        countInStock: product.countInStock,
        qty,
        size,
        color,
      });
    }

    saveCart(newCartItems);
    setIsCartOpen(true); // Open the premium cart drawer on add
  };

  const removeFromCart = (productId, size, color) => {
    const newCartItems = cartItems.filter(
      (item) =>
        !(
          item.product === productId &&
          item.size === size &&
          item.color === color
        )
    );
    saveCart(newCartItems);
  };

  const updateQty = (productId, size, color, qty) => {
    const newCartItems = cartItems.map((item) => {
      if (
        item.product === productId &&
        item.size === size &&
        item.color === color
      ) {
        return { ...item, qty: Math.min(qty, item.countInStock) };
      }
      return item;
    });
    saveCart(newCartItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 150 || itemsPrice === 0 ? 0 : 15; // Free shipping over $150
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2)); // 8% sales tax
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
