import React, { useContext, useEffect, useState } from 'react';
import { FiMinus } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import axios from 'axios';
import { CartContext } from '../context/CartContext'; // Adjust the path if needed
import MessageModal from '../Home1/MessageModal'; // Import the MessageModal component

const OrderDetails = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } =
    useContext(CartContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for the message
  const [modalType, setModalType] = useState('success'); // State for modal type (success/error)

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = item.quantity || 1;
      return total + price * quantity;
    }, 0);
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

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

  const handleCheckIn = async () => {
    if (!isAuthenticated) {
      setModalMessage('You need to be logged in to place an order.');
      setModalType('error');
      setModalVisible(true);
      return;
    }

    const orderData = {
      cart: cart.map((item) => ({
        item_id: item.id,
        quantity: item.quantity || 1,
      })),
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/order',
        orderData,
        {
          withCredentials: true,
        }
      );
      setModalMessage(response.data.message);
      setModalType('success');
      clearCart();
    } catch (error) {
      setModalMessage(error.response?.data?.error || 'Failed to place order');
      setModalType('error');
    } finally {
      setModalVisible(true); // Show the modal regardless of success or failure
    }
  };

  const closeModal = () => {
    setModalVisible(false); // Hide the modal
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
                onClick={handleCheckIn}
              >
                Check in
              </button>
            </div>
          </>
        ) : (
          <p className="text-lg text-gray-600">No items in the cart</p>
        )}
      </div>

      {/* Render the MessageModal */}
      {modalVisible && (
        <MessageModal
          message={modalMessage}
          onClose={closeModal}
          type={modalType}
        />
      )}
    </div>
  );
};

export default OrderDetails;
