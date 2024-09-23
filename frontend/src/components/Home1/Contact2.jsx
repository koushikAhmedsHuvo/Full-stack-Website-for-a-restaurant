import React from 'react';
import { FiPhoneCall } from 'react-icons/fi';
import { TiMessages } from 'react-icons/ti';
import data from '../../data1.json'; // Assuming your JSON data is in data.json

const Contact2 = () => {
  const contactSection = data.contactSection;
  const contactInfo = contactSection.contactInfo;
  const formLabels = contactSection.formLabels;
  const backgroundImage = contactSection.backgroundImage;

  return (
    <div className="min-h-screen p-8 bg-grey-scale-50">
      <div className="flex flex-col md:flex-row overflow-hidden">
        {/* Left Side */}
        <div className="w-full md:w-2/5 p-8">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {contactSection.title}
          </h1>
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="flex flex-row justify-around p-4 border bg-white rounded-2xl shadow-sm"
              >
                <div className="text-blue-500 text-6xl mr-4">
                  {info.icon === 'FiPhoneCall' ? (
                    <FiPhoneCall className="mt-5" />
                  ) : (
                    <TiMessages className="mt-5" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{info.title}</h2>
                  <p className="text-gray-700 mb-2">{info.description}</p>
                  {Array.isArray(info.contactDetail) ? (
                    info.contactDetail.map((email, idx) => (
                      <p key={idx} className="text-blue-600 font-medium">
                        {email}
                      </p>
                    ))
                  ) : (
                    <p className="text-blue-600 font-medium">
                      {info.contactDetail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right Side */}
        <div className="w-full md:w-3/5 p-0 bg-cover bg-center ml-5">
          <div className="w-full h-full p-6">
            <form
              className="space-y-6 w-full"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:w-3/4">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-black"
                  >
                    {formLabels.firstName}
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    name="first-name"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="John"
                  />
                </div>
                <div className="md:w-3/4">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-black"
                  >
                    {formLabels.lastName}
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    name="last-name"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:w-3/4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                  >
                    {formLabels.email}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="example@example.com"
                  />
                </div>
                <div className="md:w-3/4">
                  <label
                    htmlFor="telephone"
                    className="block text-sm font-medium text-black"
                  >
                    {formLabels.telephone}
                  </label>
                  <input
                    type="text"
                    id="telephone"
                    name="telephone"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="+1 234 567 8901"
                  />
                </div>
              </div>
              <div className="w-3/4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-black"
                >
                  {formLabels.description}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your message here..."
                />
              </div>
              <button
                type="submit"
                className="w-1/3 py-3 px-4 bg-blue-500 text-black font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {formLabels.submitButton}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact2;
