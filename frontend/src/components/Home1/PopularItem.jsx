import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { BsCartPlus } from 'react-icons/bs';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../css/buttonStyle1.css';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const PopularItem = () => {
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { addToCart } = useContext(CartContext);
  const [visible, setVisible] = useState(true);
  const foodItemsRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchPopularItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setPopularItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular items:', error);
        setLoading(false);
      }
    };

    fetchPopularItems();

    // Initialize AOS animation
    AOS.init({
      duration: 1000,
      once: true,
      offset: 200,
    });
  }, []);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/check-session', // Update with your session check endpoint
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.isLoggedIn);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleAddToCart = async (item) => {
    if (!isAuthenticated) {
      console.log('User is not authenticated, redirecting to login.');
      navigate('/login'); // Redirect to login page if not authenticated
      return;
    }

    try {
      console.log('Adding item to cart:', item);
      await addToCart(item); // Add item to cart in context
      console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-3xl mt-16">Loading popular items...</p>
    );
  }

  return (
    <div>
      <h1 className="text-bold text-4xl ml-7 md:text-6xl mt-16 md:ml-16">
        Popular Food Items
      </h1>
      {/* food items */}
      <div
        className="flex flex-wrap lg:justify-center mt-10 mb-16"
        ref={foodItemsRef}
      >
        {popularItems.length > 0 ? (
          popularItems.map((item) => (
            <div
              key={item.id} // Use item.id as the unique key
              className={`group w-11/12 lg:max-w-xs rounded overflow-hidden shadow-lg mx-3 my-2 relative ${
                visible ? 'fade-in' : 'fade-out'
              }`}
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
            >
              <div className="absolute top-0 flex justify-between w-full z-10">
                <div className="flex items-center">
                  <FaRegHeart className="text-4xl text-red-500 rounded-full border border-white bg-white p-1 mt-5 ml-3" />
                </div>
                <div className="flex items-center">
                  <p className="text-xl border border-black bg-black text-white rounded-lg p-1 mr-3 mt-5">
                    20% off
                  </p>
                </div>
              </div>

              <img
                className="w-full transition-transform duration-300 transform group-hover:scale-105"
                src={item.image_link}
                alt={item.title}
              />
              <div className="px-6 py-4">
                <div className="font-bold text-lg mb-2">{item.title}</div>
                <p className="text-gray-700 text-base">{item.description}</p>
                <p className="text-gray-900 text-base font-semibold mt-2">
                  ${item.price}
                </p>
              </div>
              <div className="px-6 py-4">
                <div className="mb-5">
                  <button
                    className="bg-transparent border border-gray-500 text-gray-500 font-bold py-3 px-10 rounded-lg flex items-center justify-start transition duration-500 ease-in-out btn btn2 hover:bg-red-600 hover:border-red-600"
                    onClick={() => handleAddToCart(item)}
                  >
                    <BsCartPlus className="mr-2 text-2xl" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No food items available.</p>
        )}
      </div>
    </div>
  );
};

export default PopularItem;
