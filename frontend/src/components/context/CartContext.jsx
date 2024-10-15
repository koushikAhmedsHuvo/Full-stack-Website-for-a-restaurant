import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create Context
export const CartContext = createContext();

// Create Provider Component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null); // This will be the id from your 'users' table
  const [loading, setLoading] = useState(true);

  // Fetch the user ID from the server when the component mounts (or after login)
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        console.log('Fetching user ID...'); // Debug: Log before fetching
        const response = await axios.get(
          'http://localhost:5000/check-session',
          {
            withCredentials: true, // Ensure the session is being used correctly
          }
        );
        console.log('Response from server:', response.data); // Debug: Log the full response
        const fetchedUserId = response.data.userId;

        if (fetchedUserId) {
          console.log('User ID fetched:', fetchedUserId); // Debug: Log the fetched userId
          setUserId(fetchedUserId);
        } else {
          console.error('No user ID returned from the server.'); // Debug: Log if no user ID is returned
        }
      } catch (error) {
        console.error('Error fetching user ID:', error); // Debug: Log the error if fetching fails
      } finally {
        setLoading(false);
      }
    };

    fetchUserId();
  }, []);

  // Load cart from localStorage once userId is available
  useEffect(() => {
    if (!loading && userId) {
      console.log(`Loading cart for user ID: ${userId}`); // Debug: Log which user's cart is being loaded
      const savedCart =
        JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      setCart(savedCart);
    }
  }, [loading, userId]);

  // Save cart to localStorage whenever the cart changes, for the specific user
  useEffect(() => {
    if (userId) {
      console.log(`Saving cart for user ID: ${userId}`); // Debug: Log when cart is saved
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    }
  }, [cart, userId]);

  // Clear cart after placing an order (also remove from localStorage)
  const clearCart = () => {
    setCart([]);
    if (userId) {
      console.log(`Clearing cart for user ID: ${userId}`); // Debug: Log when cart is cleared
      localStorage.removeItem(`cart_${userId}`);
    }
  };

  // Add item to cart
  const addToCart = (product) => {
    console.log(`Adding product to cart for user ID: ${userId}`, product); // Debug: Log product being added
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    console.log(`Removing product from cart for user ID: ${userId}`, productId); // Debug: Log product being removed
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Update item quantity in cart
  const updateQuantity = (productId, quantity) => {
    console.log(
      `Updating quantity for product ID: ${productId}, quantity: ${quantity} for user ID: ${userId}`
    ); // Debug: Log quantity update
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // Get total quantity of items in cart
  const getCartCount = () =>
    cart.reduce((total, item) => total + (item.quantity || 0), 0);

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while user info is being fetched
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
