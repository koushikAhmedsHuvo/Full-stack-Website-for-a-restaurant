import React, { useEffect, useState, useContext } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../css/buttonStyle1.css';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MessageModal from '../Home1/MessageModal'; // Importing MessageModal

const Pickup = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [pickupDateTime, setPickupDateTime] = useState({ date: '', time: '' });
  const [userId, setUserId] = useState(null);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState(null); // State to hold success messages
  const [messageType, setMessageType] = useState('success'); // Type of the message

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 200 });

    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/menu');
        setMenuItems(response.data || []);
      } catch (error) {
        setError('Error fetching menu items. Please try again later.');
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/check-session',
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.isLoggedIn);
        if (response.data.isLoggedIn) {
          setUserId(response.data.user_id);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    fetchMenuItems();
    checkAuthentication();

    return () => {
      AOS.refresh();
    };
  }, []);

  const handleAddToCartClick = (item) => {
    if (!isAuthenticated) {
      console.log('User is not authenticated, redirecting to login.');
      navigate('/login');
      return;
    }
    setSelectedItem(item);
    setShowModal(true);
  };

  const handlePickupSubmit = async () => {
    if (pickupDateTime.date && pickupDateTime.time && selectedItem) {
      const pickupInfo = {
        item_id: selectedItem.id,
        pickup_date: pickupDateTime.date,
        pickup_time: pickupDateTime.time,
      };

      try {
        const response = await axios.post(
          'http://localhost:5000/pickup',
          pickupInfo,
          { withCredentials: true }
        );
        setMessage(response.data.message); // Set success message
        setMessageType('success'); // Set message type to success
        addToCart({
          ...selectedItem,
          pickupDate: pickupDateTime.date,
          pickupTime: pickupDateTime.time,
        });
        setShowModal(false);
      } catch (error) {
        console.error('Error storing pickup information:', error);
        setMessage('Failed to store pickup information. Please try again.'); // Set error message
        setMessageType('error'); // Set message type to error
      }
    } else {
      setMessage('Please select both date and time for pickup.'); // Set error message
      setMessageType('error'); // Set message type to error
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleMessageModalClose = () => {
    setMessage(null); // Reset message state
  };

  if (loading) {
    return <p className="text-center text-3xl mt-16">Loading menu items...</p>;
  }

  return (
    <div>
      <h1 className="font-bold text-3xl ml-7 md:text-6xl mt-16 md:ml-16">
        Pickup
      </h1>
      <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden mt-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div
                key={item.id}
                data-aos="fade-up"
                className="shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              >
                <div className="relative">
                  <img
                    src={item.image_link}
                    className="object-cover w-full h-64 md:h-72 transform transition-transform duration-300 hover:scale-105"
                    alt={item.title}
                  />
                </div>
                <div className="p-5">
                  <h5 className="text-lg font-semibold mb-2">{item.title}</h5>
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-bold text-xl">${item.price}</p>
                    <div className="flex items-center">
                      <button
                        className="flex items-center border border-gray-500 text-gray-500 py-2 px-4 rounded-lg transition duration-300 ease-in-out btn btn2 hover:bg-red-600 hover:border-red-600"
                        onClick={() => handleAddToCartClick(item)}
                      >
                        <IoCartOutline className="text-2xl mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xl">No menu items available.</p>
          )}
        </div>
      </div>

      {/* Modal for Pickup Time and Date */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-2xl mb-4">Select Pickup Date and Time</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Pickup Date</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={pickupDateTime.date}
                onChange={(e) =>
                  setPickupDateTime({ ...pickupDateTime, date: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Pickup Time</label>
              <input
                type="time"
                className="w-full border rounded-lg px-3 py-2"
                value={pickupDateTime.time}
                onChange={(e) =>
                  setPickupDateTime({ ...pickupDateTime, time: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={handlePickupSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {message && (
        <MessageModal
          message={message}
          onClose={handleMessageModalClose}
          type={messageType} // Pass the type for styling
        />
      )}
    </div>
  );
};

export default Pickup;
