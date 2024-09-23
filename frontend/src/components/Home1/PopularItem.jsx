import React, { useEffect, useContext } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import data from '../../data.json'; // Import JSON data
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../css/buttonStyle1.css';
import { CartContext } from '../context/CartContext'; // Import the Cart Context

const PopularItem = () => {
  const popularItems = data.Popular.items; // Get popular items from JSON
  const { addToCart } = useContext(CartContext); // Get the addToCart function from context

  useEffect(() => {
    AOS.init({
      duration: 1000, // Duration of the animation
      once: true, // Animation will only occur once
      offset: 200, // Change this value based on your needs
    });
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item); // Add the selected item to the cart using context
  };

  return (
    <div>
      <h1 className="text-bold text-3xl ml-7 md:text-6xl mt-16 md:ml-16">
        {data.Popular.title}
      </h1>
      {/* food item */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg overflow-hidden mt-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
          {popularItems.map((item) => (
            <div
              key={item.id} // Use the id as the unique key
              data-aos="fade-up"
              className="flex flex-col md:flex-row shadow-lg"
            >
              <div className="md:w-1/2">
                <img
                  src={item.image}
                  className="object-cover w-full h-64 md:h-auto transform transition-transform duration-300 hover:scale-110"
                  alt={item.title} // Use the title as the alt text
                />
              </div>
              <div className="md:w-1/2">
                <div className="p-4">
                  <h5 className="text-2xl font-semibold">{item.title}</h5>
                  <p className="text-gray-700 mt-3 text-xl">
                    {item.description1}
                  </p>
                  <p className="text-gray-700 mt-3 text-xl">
                    {item.description2}
                  </p>
                  <div className="flex flex-row justify-between mt-4">
                    {/* Ensure `item.price` is correctly accessed */}
                    <p className="text-bold text-3xl mt-5">${item.price}</p>
                    <div className="border border-gray-500 text-gray-500 flex flex-row py-3 px-3 justify-around transition duration-500 ease-in-out btn btn2 hover:bg-red-600 hover:border-red-600">
                      <div className="text-2xl">
                        <IoCartOutline />
                      </div>
                      <button
                        className=""
                        onClick={() => handleAddToCart(item)} // Add item to cart on click
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularItem;
