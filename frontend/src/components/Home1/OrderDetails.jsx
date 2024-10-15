import React, { useContext, useEffect, useState } from 'react';
import { FiMinus } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import axios from 'axios';
import { CartContext } from '../context/CartContext'; // Adjust the path if needed

const OrderDetails = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Add state to track authentication

  // Function to calculate the total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0; // Ensure the price is a number
      const quantity = item.quantity || 1; // Default to 1 if quantity is not available
      return total + price * quantity;
    }, 0);
  };

  // Handle item removal
  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  // Handle quantity changes
  const handleQuantityChange = (itemId, increment) => {
    const item = cart.find((item) => item.id === itemId);
    const newQuantity = increment
      ? (item.quantity || 1) + 1
      : (item.quantity || 1) - 1;
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/check-session',
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.isLoggedIn);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  // Handle "Check in" button click
  const handleCheckIn = async () => {
    if (!isAuthenticated) {
      alert('You need to be logged in to place an order.');
      return;
    }

    // Prepare the order data based on what your backend expects
    const orderData = {
      cart: cart.map((item) => ({
        item_id: item.id, // Ensure this matches your backend's expected key
        quantity: item.quantity || 1, // Ensure quantity is provided
      })),
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/order',
        orderData,
        {
          withCredentials: true, // Include credentials with the request
        }
      );
      alert(response.data.message); // Notify success
      clearCart(); // Clear the cart after successful order
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to place order');
    }
  };

  return (
    <div className="w-full mx-auto p-8 font-Barlow mb-28 mt-14">
      <h1 className="text-2xl font-semibold mb-6">An Overview of Your Data</h1>

      <div className="flex flex-row space-x-8">
        {cart.length > 0 ? (
          <>
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-300">
              <div className="flex flex-col space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-4"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image_link}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="ml-4">
                        <h2 className="text-lg font-bold">{item.title}</h2>
                        <p className="text-gray-600">
                          $
                          {parseFloat(item.price).toFixed(2) ||
                            'Price not available'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="text-gray-600 hover:text-gray-800 transition"
                        onClick={() => handleQuantityChange(item.id, false)}
                      >
                        <FiMinus />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="text-gray-600 hover:text-gray-800 transition"
                        onClick={() => handleQuantityChange(item.id, true)}
                      >
                        <FaPlus />
                      </button>
                      <button
                        className="text-red-600 ml-4 hover:text-red-800 transition"
                        onClick={() => handleRemove(item.id)}
                      >
                        <RxCross1 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-80 bg-white p-6 rounded-lg shadow-md border border-gray-300 mb-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-700">Total Items:</span>
                  <span className="font-bold">{cart.length}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-700">Total Price:</span>
                  <span className="font-bold">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                className="w-80 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                onClick={handleCheckIn} // Call the function to handle the check-in
              >
                Check in
              </button>
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-600">No items in the cart</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
