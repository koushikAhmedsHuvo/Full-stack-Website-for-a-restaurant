import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronDown, HiOutlineSearch, HiX } from 'react-icons/hi';
import { FaRegHeart, FaAngleDown } from 'react-icons/fa';
import { CiShoppingCart, CiLocationOn } from 'react-icons/ci';
import { IoMenuOutline, IoCallOutline } from 'react-icons/io5';
import { MdOutlineEmail } from 'react-icons/md';
import Logo from '../../assets/logo.svg';
import jsonData from '../../data.json';
import '../../css/buttonStyle.css';
import '../../css/buttonStyle1.css';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { getCartCount } = useContext(CartContext);

  const { logo, menu, buttons, slogan } = jsonData;
  const { dropdownData, sloganText, sloganLink, phoneNumber, email } = slogan;

  // Toggle Menu visibility for mobile devices
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // Toggle Dropdown visibility for menus with dropdown items
  const toggleDropdown = (index) => {
    setDropdownVisible((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  // Handle click outside the dropdown and menu
  const handleClickOutside = (event) => {
    if (menuVisible && !event.target.closest('.menu-container')) {
      setMenuVisible(false);
    }
    if (
      Object.values(dropdownVisible).some((visible) => visible) &&
      !event.target.closest('.dropdown-container')
    ) {
      setDropdownVisible({});
    }
    if (isOpen && !event.target.closest('.slogan-dropdown')) {
      setIsOpen(false);
    }
  };

  // Check if user is logged in by calling an API
  const checkLoginStatus = async () => {
    try {
      const response = await fetch('/check_session?_=' + new Date().getTime(), {
        credentials: 'include',
      });

      const contentType = response.headers.get('Content-Type');
      const text = await response.text(); // Read response as text

      if (contentType && contentType.includes('application/json')) {
        const data = JSON.parse(text); // Parse text as JSON
        setIsLoggedIn(data.isLoggedIn);
        setUserEmail(data.email || '');
      } else {
        console.error('Received non-JSON response:', text);
        throw new Error('Not JSON response');
      }
    } catch (error) {
      console.error('Failed to check login status:', error);
    }
  };

  // Run the session check on component mount
  useEffect(() => {
    checkLoginStatus();

    // Event listener for click outside
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuVisible, dropdownVisible, isOpen]);

  // Handle scrolling effect
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  // Track window scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setUserEmail('');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div
      className={`navbar-container ${
        isScrolled ? 'fixed top-0 left-0 right-0 z-50 bg-heading-color' : ''
      } transition-all duration-500`}
    >
      {/* Slogan Section */}
      <div className={`slogan-container ${isScrolled ? 'hidden' : 'block'}`}>
        <div className="hidden lg:flex items-center justify-center w-full h-14 bg-primary-color transition-all duration-500">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="relative inline-block text-left slogan-dropdown">
              <button
                type="button"
                className="inline-flex items-center justify-center w-full ml-10 px-4 py-2 text-base font-medium text-white"
                onClick={() => setIsOpen(!isOpen)}
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

      {/* Navbar Section */}
      <div
        className={`bg-heading-color p-4 flex justify-between items-center relative z-10 max-w-screen transition-all duration-500 ${
          isScrolled ? 'fixed top-0 left-0 right-0' : ''
        }`}
      >
        {/* Left Part - Logo */}
        <div className="flex items-center ml-3">
          <img src={Logo} alt={logo.alt} className="h-12 w-auto ml-2" />
        </div>

        {/* Right Part - Menu Icon */}
        <div className="flex items-center ml-auto mr-3.5 p-2 relative menu-container">
          <IoMenuOutline
            className="text-gray-500 text-3xl cursor-pointer block md:hidden"
            onClick={toggleMenu}
          />

          {menuVisible && (
            <div className="fixed top-0 left-0 w-full h-full bg-black text-white flex flex-col z-50">
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-white text-xl">Menu</span>
                <HiX
                  className="text-white text-xl cursor-pointer"
                  onClick={toggleMenu}
                />
              </div>
              <ul className="w-full text-left px-4">
                {menu.map((item, index) => (
                  <li
                    key={index}
                    className="py-4 text-xl cursor-pointer border-b border-gray-700"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Menu for Large Devices */}
        <ul className="hidden md:flex space-x-2 align-middle">
          {menu.map((item, index) => (
            <li
              key={index}
              className="relative dropdown-container"
              onMouseEnter={() => toggleDropdown(index)}
              onMouseLeave={() => toggleDropdown(index)}
            >
              <Link
                to={item.link}
                className={`px-4 py-2 text-base font-medium ${
                  dropdownVisible[index] ? 'text-white' : 'text-gray-500'
                }`}
              >
                {item.name}
                {item.submenu && <HiChevronDown className="inline" />}
              </Link>
              {dropdownVisible[index] && item.submenu && (
                <div className="absolute z-50 w-48 mt-2 bg-gray-800 text-white rounded-md shadow-lg">
                  <div className="py-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.link}
                        className="block px-4 py-2 text-sm hover:bg-gray-700"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Right Part - Icons and User */}
        <div className="flex items-center space-x-2 ml-auto mr-3">
          <CiShoppingCart className="text-white text-xl cursor-pointer" />
          <p className="text-white text-sm">{getCartCount()}</p>

          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <FaRegHeart className="text-white text-xl cursor-pointer" />
              <button
                onClick={handleLogout}
                className="text-white text-base bg-red-500 hover:bg-red-600 py-1 px-3 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-white text-base bg-blue-500 hover:bg-blue-600 py-1 px-3 rounded"
            >
              Login
            </Link>
          )}

          <HiOutlineSearch className="text-white text-xl cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
