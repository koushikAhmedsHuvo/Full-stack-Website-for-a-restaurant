import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import backgroundImage from '../../assets/categories-bg.png';
import faqData from '../../data.json';

const Faq = () => {
  const [visibleFaq, setVisibleFaq] = useState(null);

  const toggleVisibility = (faqIndex) => {
    setVisibleFaq(visibleFaq === faqIndex ? null : faqIndex);
  };

  return (
    <div
      className="p-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl w-full md:text-5xl leading-tight font-bold md:w-1/3 ml-5 mt-10 mb-8">
          Foodie FAQ: Your Culinary Queries Answered
        </h1>
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="w-full ml-5 md:w-1/2">
            {faqData.faqs.map((faq, index) => (
              <div className="mb-6 w-[95%]" key={index}>
                <div
                  className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4 cursor-pointer"
                  onClick={() => toggleVisibility(index)}
                >
                  <h1 className="text-xl font-semibold text-gray-800">
                    {faq.question}
                  </h1>
                  <FaChevronDown
                    className={`text-gray-600 transform transition-transform duration-300 ${
                      visibleFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {visibleFaq === index && (
                  <p className="text-gray-700 ml-2">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-1/2 md:-mt-32">
            {faqData.images.map((image, index) => (
              <div className="flex items-center justify-center" key={index}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className={`rounded-lg object-cover shadow-lg ${image.style} w-full h-full`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
