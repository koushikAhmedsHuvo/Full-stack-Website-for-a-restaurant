import React, { useState } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import { FaAngleDown } from 'react-icons/fa';
import { IoCallOutline } from 'react-icons/io5';
import { MdOutlineEmail } from 'react-icons/md';
import jsonData from '../data.json'; // Assuming your JSON file is in the same directory

const Slogan = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { dropdownData, sloganText, sloganLink, phoneNumber, email } =
    jsonData.slogan;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hidden lg:block">
      <div className="flex items-center justify-center w-full h-14 bg-primary-color">
        <div className="flex flex-row justify-between items-center w-full">
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="inline-flex items-center justify-center w-full ml-10 px-4 py-2 text-base font-medium text-white"
              onClick={toggleDropdown}
            >
              <CiLocationOn className="text-white text-xl mr-2" />
              {dropdownData.title}
              <FaAngleDown />
            </button>

            {isOpen && (
              <div
                className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 ml-10 w-56 rounded-md shadow-lg bg-gray-800 text-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex="-1"
              >
                <div className="py-1" role="none">
                  {dropdownData.items.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-white"
                      role="menuitem"
                      tabIndex="-1"
                      id={`menu-item-${index}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-white ml-15">
            <p className="text-center text-lg">
              {sloganText}{' '}
              <a href={sloganLink.url} className="text-white underline">
                {sloganLink.text}
              </a>
            </p>
          </div>

          <div className="flex flex-row space-x-2 mr-10 items-center">
            <IoCallOutline className="text-white text-xl" />
            <p className="text-white text-lg ml-2">{phoneNumber}</p>
            <MdOutlineEmail className="text-white text-xl" />
            <p className="text-white text-lg">{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slogan;
