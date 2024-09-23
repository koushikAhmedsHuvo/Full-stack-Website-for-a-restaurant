import React, { useContext } from 'react';
import { FiMinus } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { RxCross1 } from 'react-icons/rx';
import { CartContext } from '../context/CartContext'; // Adjust the path if needed

const OrderDetails = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      return total + (item.Price || 0) * (item.quantity || 1); // Ensure correct price field
    }, 0);
  };

  const handleRemove = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <div className="w-full mx-auto p-8 font-Barlow mb-28 mt-14">
      <h1 className="text-2xl font-semibold mb-6">An Overview of Your Data</h1>

      <div className="flex flex-row space-x-8">
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-gray-300">
          <div className="flex flex-col space-y-6">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center mb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="ml-4">
                      <h2 className="text-lg font-bold">{item.title}</h2>
                      <p className="text-gray-600">
                        ${item.Price || 'Price not available'}
                      </p>{' '}
                      {/* Handle missing price */}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="text-gray-600"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <FiMinus />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="text-gray-600"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="text-red-600 ml-4"
                      onClick={() => handleRemove(item.id)}
                    >
                      <RxCross1 />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>
        </div>

        <div className="w-80 bg-white p-6 rounded-lg shadow-md border border-gray-300">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-4">
            <span className="text-gray-700">Total Items:</span>
            <span className="font-bold">{cart.length}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-700">Total Price:</span>
            <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
