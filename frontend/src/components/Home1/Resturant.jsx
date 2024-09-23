import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import data from '../../data.json'; // Import the JSON data

const Resturant = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
    });
  }, []);

  const { backgroundImage, title, description, buttons, image } =
    data.Resturant;

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-between p-4 md:p-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        overflow: 'hidden',
      }}
    >
      <div className="w-full md:w-1/2   mt-7 md:text-left px-4 md:px-0">
        <h1 className=" text-2xl  md:w-[90%] mt-7 md:text-5xl font-bold text-white md:leading-normal mb-4 md:mb-6">
          {title}
        </h1>
        <p className="text-white w-[80%] text-lg md:text-xl mb-8 md:mb-8">
          {description}
        </p>
        <div className="flex  flex-row  w-full justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
          {buttons.map((button, index) => (
            <button
              key={index}
              className={`${button.backgroundColor} flex items-center justify-center w-40 h-12 md:w-56 md:h-16 rounded-full shadow-lg`}
            >
              <img
                src={button.icon}
                alt={button.text}
                className="mr-3 w-6 h-6"
              />
              <span>{button.text}</span>
            </button>
          ))}
        </div>
      </div>
      <div
        className="hidden md:flex w-full md:w-1/2 mt-8 md:mt-0 justify-center md:justify-end"
        data-aos="fade-left"
      >
        <img
          src={image.src}
          alt={image.alt}
          className="w-full max-w-md md:max-w-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Resturant;
