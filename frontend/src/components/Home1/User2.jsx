import React from 'react';
import User from '../../assets/user.png';
import { CgProfile } from 'react-icons/cg';
import { FaLocationPin } from 'react-icons/fa6';
import { Link } from 'react-router-dom'; // Import Link for routing

const User2 = () => {
  return (
    <div className="flex">
      {/* Left Side */}
      <div className="w-2/5 bg-gray-100 p-6 rounded-lg shadow-lg">
        <div className="bg-white p-4 w-4/5 rounded-lg shadow-md mb-6 ml-10 mt-10">
          <div className="flex flex-col items-center mb-6">
            <img
              src={User}
              alt="User"
              className="w-24 h-24 rounded-full mb-4"
            />
            <p className="text-xl font-semibold text-gray-800">David Warrior</p>
            <p className="text-sm text-gray-600">User ID #05450</p>
          </div>
          <div className="space-y-4">
            <Link
              to="/edit-profile"
              className="flex items-center text-gray-700 hover:text-blue-600 transition duration-200"
            >
              <CgProfile className="text-xl mr-2 p-1 border border-gray-300 rounded-full" />
              <span>Edit Profile</span>
            </Link>
            <Link
              to="/address"
              className="flex items-center text-gray-700 hover:text-blue-600 transition duration-200"
            >
              <FaLocationPin className="text-xl mr-2 p-1 border border-gray-300 rounded-full" />
              <span>Address</span>
            </Link>
            <Link
              to="/orders"
              className="flex items-center text-gray-700 hover:text-blue-600 transition duration-200"
            >
              <FaLocationPin className="text-xl mr-2 p-1 border border-gray-300 rounded-full" />
              <span>Orders</span>
            </Link>
            <Link
              to="/reviews"
              className="flex items-center text-gray-700 hover:text-blue-600 transition duration-200"
            >
              <FaLocationPin className="text-xl mr-2 p-1 border border-gray-300 rounded-full" />
              <span>Reviews</span>
            </Link>
            <Link
              to="/logout"
              className="flex items-center text-gray-700 hover:text-blue-600 transition duration-200"
            >
              <FaLocationPin className="text-xl mr-2 p-1 border border-gray-300 rounded-full" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="w-3/5 p-6 bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg mt-12">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:w-3/4">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  name="first-name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="John"
                />
              </div>
              <div className="md:w-3/4">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  name="last-name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:w-3/4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="example@example.com"
                />
              </div>
              <div className="md:w-3/4">
                <label
                  htmlFor="telephone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Telephone
                </label>
                <input
                  type="text"
                  id="telephone"
                  name="telephone"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="+1 234 567 8901"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:w-3/4">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="City"
                />
              </div>
              <div className="md:w-3/4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                  placeholder="Address"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-1/5 py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Save Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default User2;
