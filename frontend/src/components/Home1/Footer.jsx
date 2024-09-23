import React, { useEffect } from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';
import { HiOutlineSearch } from 'react-icons/hi';
import Logo from '../../assets/logo.svg';
import jsonData from '../../data.json';
import 'aos/dist/aos.css';
import AOS from 'aos';
import '../../css/buttonStyle.css';

const iconComponents = {
  FaFacebookF: FaFacebookF,
  FaTwitter: FaTwitter,
  FaInstagram: FaInstagram,
  FaLinkedin: FaLinkedin,
};

const Footer = () => {
  const data = jsonData.Footer;

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div
      className="text-white py-16"
      style={{
        backgroundImage: `url(${data.backgroundImage})`,
        overflowX: 'hidden',
      }}
    >
      <div className="container mx-auto grid grid-cols-1 md:mt-16 md:grid-cols-4 gap-8 px-5 md:px-10">
        <div data-aos="fade-left">
          <img
            src={Logo}
            alt={data.logo.alt}
            className={`mb-6 ${data.logo.width}`}
          />
          <p className="mb-6 w-[75%] md:w-auto text-lg">{data.description}</p>
          <div className="flex space-x-6 text-2xl">
            {data.socialMedia.map((social, index) => {
              const IconComponent = iconComponents[social.icon];
              return (
                <a
                  key={index}
                  href={social.url}
                  className="border p-3 rounded-xl hover:bg-primary-color"
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>
        <div data-aos="fade-left" data-aos-delay="150">
          <h1 className="text-xl font-semibold mb-6">
            {data.quickLinks.title}
          </h1>
          <ul className="space-y-3">
            {data.quickLinks.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  className={`text-lg hover:text-primary-color ${link.hoverColor}`}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div data-aos="fade-left" data-aos-delay="300">
          <h1 className="text-xl font-semibold mb-6">
            {data.termsPrivacy.title}
          </h1>
          <ul className="space-y-3">
            {data.termsPrivacy.links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  className={`text-lg hover:text-primary-color ${link.hoverColor}`}
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div data-aos="fade-left" data-aos-delay="450">
          <h1 className="text-xl font-semibold mb-6">
            {data.newsletter.title}
          </h1>
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-grow">
              <input
                type="email"
                placeholder={data.newsletter.placeholder}
                className="w-48 px-4 py-3 rounded-lg text-gray-900"
              />
              <HiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
            </div>
            <button className="bg-primary-color  text-white py-3 px-3 md:px-4 rounded-lg">
              {data.newsletter.buttonText}
            </button>
          </div>
          <p className="mt-6 text-lg">{data.newsletter.paymentMethods.text}</p>
          <div className="flex space-x-6 mt-4">
            {data.newsletter.paymentMethods.images.map((payment, index) => (
              <img
                key={index}
                src={payment.src}
                alt={payment.alt}
                className={payment.width}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
