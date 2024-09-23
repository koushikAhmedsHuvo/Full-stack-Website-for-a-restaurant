import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import { CiLocationOn } from 'react-icons/ci';
import { PiHandCoins } from 'react-icons/pi';
import { HiOutlineDevicePhoneMobile } from 'react-icons/hi2';
import { FaCaravan } from 'react-icons/fa';
import data from '../../data.json'; // Adjust the path as needed
import '../../css/buttonStyle.css';

const iconMapping = {
  CiLocationOn: CiLocationOn,
  PiHandCoins: PiHandCoins,
  HiOutlineDevicePhoneMobile: HiOutlineDevicePhoneMobile,
  FaCaravan: FaCaravan,
};

const Crafting = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
    });
  }, []);

  const craftingData = data.Crafting;

  return (
    <div className="banner relative h-full w-full lg:h-full bg-cover bg-center bg-no-repeat flex">
      {/* Background Image */}
      <img
        src={craftingData.banner.src}
        alt={craftingData.banner.alt}
        className="absolute inset-0 h-full w-full object-cover z-0"
      />
      <div className="flex flex-col relative z-10 w-full lg:flex-row">
        {/* Left Part - Image */}
        <div
          className="w-full lg:w-1/2"
          data-aos="fade-right" // New AOS animation for the hero image
        >
          <img
            src={craftingData.heroImage.src}
            alt={craftingData.heroImage.alt}
            className="h-10/12 w-10/12 lg:mt-20 ml-10 mt-10 lg:ml-20"
          />
        </div>
        {/* Right Part - Text and Boxes */}
        <div className="lg:w-1/2 flex flex-col justify-center lg:p-10 lg:mt-10">
          <h1 className="text-white text-3xl w-11/12 ml-5 lg:text-5xl mb-8 mt-5 lg:w-full">
            {craftingData.heading.text}
          </h1>
          {/* Render Boxes */}
          {craftingData.boxes.map((box, index) => {
            const IconComponent = iconMapping[box.icon];

            return (
              <div
                key={index}
                data-aos="fade-up" // AOS animation type for the boxes
                className="flex flex-row bg-light-black-color rounded-3xl py-4 px-6 mb-4 w-full hover:transition hover:duration-1000 hover:ease-in-out hover:bg-red-600"
              >
                <div className="text-white mr-4 text-5xl">
                  {IconComponent && <IconComponent />}
                </div>
                <div>
                  <h1 className="text-white text-xl font-bold mb-2">
                    {box.heading}
                  </h1>
                  <p className="text-white">{box.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Crafting;
