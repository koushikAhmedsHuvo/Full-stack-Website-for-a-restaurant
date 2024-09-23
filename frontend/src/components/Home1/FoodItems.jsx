import React, { useEffect, useState, useRef, useContext } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import foodData from '../../data.json';
import '../../css/buttonStyle.css';
import '../../css/buttonStyle1.css';
import { BsCartPlus } from 'react-icons/bs';
import { CartContext } from '../context/CartContext'; // Import the Cart Context

const FoodItems = () => {
  const { heading5, foodItems, buttons3 } = foodData;
  const { addToCart } = useContext(CartContext); // Get the addToCart function from context

  const [buttonState, setButtonState] = useState(buttons3);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);
  const foodItemsRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { root: null, rootMargin: '0px', threshold: 0.5 }
    );

    if (foodItemsRef.current) {
      observer.observe(foodItemsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleButtonClick = (index) => {
    const updatedButtons = buttonState.map((button, i) =>
      i === index ? { ...button, value: true } : { ...button, value: false }
    );
    setButtonState(updatedButtons);
  };

  const handleAddToCart = (item) => {
    addToCart(item); // Add the selected item to the cart using context
  };

  return (
    <div className="banner relative h-full w-full bg-cover bg-center bg-no-repeat flex flex-col lg:justify-center lg:items-center">
      <h1 className="text-3xl text-center w-11/12 ml-1 mt-10 lg:text-center lg:text-4xl lg:mt-16 lg:w-2/6">
        {heading5}
      </h1>
      {/* button div */}
      <div className="grid grid-cols-4 w-11/12 lg:w-auto lg:grid-flow-col gap-1 lg:gap-3 border rounded-xl ml-1 p-1 mt-5 lg:p-3 lg:mt-10">
        {buttonState.map((button, index) => (
          <div key={index}>
            <button
              className={`${
                button.value ? 'bg-red-500' : 'bg-transparent'
              } px-2 py-2 rounded-lg`}
              onClick={() => handleButtonClick(index)}
            >
              {button.text}
            </button>
          </div>
        ))}
      </div>
      {/* food item */}
      <div
        className="flex flex-wrap lg:justify-center mt-10"
        ref={foodItemsRef}
      >
        {foodItems.map((item) => (
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
              src={item.image}
              alt={item.title}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{item.title}</div>
              <p className="text-gray-700 text-base">{item.description}</p>
              <p className="text-gray-900 text-base font-semibold mt-2">
                ${item.Price} {/* Check if item.Price is correct */}
              </p>
            </div>
            <div className="px-6 py-4">
              <div className="mb-5">
                <button
                  className="bg-transparent border border-gray-500 text-gray-500 font-bold py-3 px-10 rounded-lg flex items-center justify-start transition duration-500 ease-in-out btn btn2 hover:bg-red-600 hover:border-red-600"
                  onClick={() => handleAddToCart(item)} // Add item to cart on click
                >
                  <BsCartPlus className="mr-2 text-2xl" />
                  <span>{item.button}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-10 mx-auto bg-primary-color border text-black border-red-500 w-48 p-3 rounded-lg btn btn1 transition duration-500 ease-in-out hover:bg-white hover:text-red-600 block">
        Browse All
      </button>

      <div className="mb-32"></div>
    </div>
  );
};

export default FoodItems;
