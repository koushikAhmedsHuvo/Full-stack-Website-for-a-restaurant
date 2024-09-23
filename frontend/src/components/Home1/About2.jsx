import React from 'react';
import data from '../../data1.json'; // Import the JSON data

const About2 = () => {
  const aboutData = data.aboutSection;
  const images = data.images;

  return (
    <div className="flex flex-col md:flex-row items-center bg-gray-100 p-8 rounded-lg shadow-lg space-y-8 md:space-y-0 md:space-x-8">
      {/* Left Section */}
      <div className="relative w-full md:w-1/2 mt-10">
        <img
          src={images.aboutImage}
          alt="About"
          className="w-full h-auto rounded-lg shadow-md"
        />

        {/* Spinning Button with Years */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <img
            src={images.buttonImage}
            alt="Button"
            className="w-24 h-24 animate-spin-slow"
          />
          <div className="absolute flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-white">{aboutData.years}</h1>
            <p className="text-lg text-white">{aboutData.yearsLabel}</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 text-gray-800">
        <h1 className="text-5xl font-bold mb-4 ml-10">{aboutData.title}</h1>
        <p className="text-lg mb-4 ml-10">{aboutData.description1}</p>
        <p className="text-lg mb-14 ml-10">{aboutData.description2}</p>

        {/* Team Stats */}
        <div className="flex flex-row space-x-8">
          {aboutData.teamStats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <img
                src={stat.image}
                alt={`Team Member ${index + 1}`}
                className="w-20 h-20 rounded-full shadow-md"
              />
              <p className="text-xl font-semibold mt-4">{stat.stat}</p>
              <p className="text-gray-600 ml-12">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About2;
