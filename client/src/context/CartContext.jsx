import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total price when cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    setTotalAmount(total);
  }, [cart]);

  // Add item to cart (only if not already present)
  const addToCart = (animal) => {
    const exists = cart.some((item) => item.id === animal.id);
    if (!exists) {
      setCart([...cart, animal]);
    }
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Clear all items
  const clearCart = () => {
    setCart([]);
  };

  // Checkout: Send order to backend
  const checkout = async () => {
    try {
      const response = await fetch("https://farmart-server-dcd6.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: cart.map((item) => ({
            animal_id: item.id,
          })),
        }),
      });

      if (!response.ok) throw new Error("Checkout failed");

      const data = await response.json();
      clearCart();
      return data;
    } catch (error) {
      console.error("Checkout Error:", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        totalAmount,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
