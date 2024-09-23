import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import { FaStar } from 'react-icons/fa';
import data from '../../data.json'; // Import your JSON data

const CustomerSay = () => {
  const { customerSay } = data; // Extract customer review data from JSON

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
    });
  }, []);

  return (
    <div className="bg-dark-black text-white p-4 md:p-10 relative w-full">
      <h1 className="text-2xl mt-10 md:text-3xl font-bold mb-4 md:mb-8 text-center">
        {customerSay.title}
      </h1>
      {/* content div */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7"
        data-aos="fade-up" // AOS animation type for the content div
      >
        {customerSay.reviews.map((review, index) => (
          <div key={index} className="p-4 md:p-6 rounded-lg relative">
            <div className="border border-gray-600 p-4 md:py-6 md:px-6 rounded-lg">
              <img
                src={customerSay.bgImage}
                alt="icon"
                className="absolute w-12 h-12 ml-5 md:w-20 md:h-20 top-2 left-2 md:left-6 z-10"
              />
              <div className="pl-6 mt-4 md:pl-6">
                <p className="text-lg">{review.reviewText}</p>
              </div>
            </div>
            <div className="flex items-center mt-4 ml-5 md:mt-6">
              <img
                src={review.image}
                alt="customer"
                className="w-20 h-20 md:w-24 md:h-24 mr-4 "
              />
              <div className="ml-3">
                <div className="flex flex-row text-yellow-500">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <h1 className="text-lg md:text-xl font-bold mt-2">
                  {review.author}
                </h1>
                <p className="text-gray-400">{review.occupation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerSay;
