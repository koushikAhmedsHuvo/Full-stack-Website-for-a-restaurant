import React, { useEffect, useState, useContext } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../css/buttonStyle1.css'; // Assuming you have button styles here
import { CartContext } from '../context/CartContext'; // Importing Cart Context
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]); // State for storing menu items
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication status
  const { addToCart } = useContext(CartContext); // Get the addToCart function from Cart Context
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Ensure animation only occurs once
      offset: 200, // Offset for animation trigger
    });

    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/menu'); // Fetch menu items from the backend
        setMenuItems(response.data); // Set fetched menu items into state
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setLoading(false);
      }
    };

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

    fetchMenuItems();
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
    return <p className="text-center text-3xl mt-16">Loading menu items...</p>; // Show loading state
  }

  return (
    <div>
      <h1 className="text-bold text-3xl ml-7 md:text-6xl mt-16 md:ml-16">
        Menu
      </h1>
      {/* Food Items */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden mt-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div
                key={item.id} // Use the id as the unique key
                data-aos="fade-up"
                className="shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out"
              >
                <div className="relative">
                  <img
                    src={item.image_link} // Assuming your backend provides an 'image_link' field
                    className="object-cover w-full h-64 md:h-72 transform transition-transform duration-300 hover:scale-105"
                    alt={item.title} // Use the title as the alt text
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
                        onClick={() => handleAddToCart(item)} // Add item to cart on click
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
    </div>
  );
};

export default Menu;
