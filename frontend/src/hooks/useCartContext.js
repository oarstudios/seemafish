import { useAuthContext } from "./useAuthContext";
import React, { useContext, useEffect, useState } from "react";

const CartContext = React.createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useAuthContext();

  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:4001/users/${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setCart(data.cart || []);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  return (
    <CartContext.Provider value={{ cart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
