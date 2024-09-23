import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import { PiHamburger } from 'react-icons/pi';
import backgroundImage from '../../assets/categories-bg.png';
import data from '../../data.json';
import '../../css/buttonStyle.css';
import '../../css/crafting.css';

const Categories = () => {
  const [scrollDirection, setScrollDirection] = useState('down');

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      offset: 200, // Offset from the original trigger point
      once: false, // Whether animation should happen only once - while scrolling down
    });

    let lastScrollTop = 0;
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollTop > lastScrollTop) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
      AOS.refresh(); // Refresh AOS to apply new animations
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { title, categories, promoBanners } = data.Categories;

  return (
    <div
      className="p-6 overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="max-w-screen-xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 mt-16">
          <h1 className="text-3xl lg:text-5xl font-bold">{title}</h1>
          <button className="mt-10 bg-transparent border text-black border-black w-32 p-3 rounded-lg btn btn2 transition duration-500 ease-in-out hover:bg-primary-color hover:text-white">
            Browse All
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 md:gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              data-aos={scrollDirection === 'down' ? 'fade-left' : 'fade-right'}
              className="flex flex-row items-center justify-center bg-grey-scale-100 p-8 rounded-xl shadow-md mt-8 categoryCard"
            >
              <div className="text-6xl mr-4 border rounded-full p-2 bg-white text-black">
                <PiHamburger />
              </div>
              <div>
                <h1 className="text-xl font-semibold">{category.title}</h1>
                <p className="text-gray-500">{category.itemCount} items</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row mt-20 gap-6 mb-8">
          {promoBanners.map((banner, index) => (
            <div key={index} className="flex-1">
              <img
                src={banner.image}
                alt={banner.alt}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
