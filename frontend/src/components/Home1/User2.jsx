import React, { useState, useEffect } from 'react';
import axios from 'axios';
import User from '../../assets/user.png';
import { CgProfile } from 'react-icons/cg';
import { FaLocationPin } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';

const User2 = () => {
  const [user, setUser] = useState(null);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    city: '',
    address: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/check-session',
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.isLoggedIn); // Update authentication status
        if (response.data.isLoggedIn) {
          fetchUserData(); // Fetch user data if authenticated
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        // Handle the case where authentication check fails
        setIsAuthenticated(false);
        // Optionally show default user information if not authenticated
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user', {
          withCredentials: true,
        });
        setUser(response.data);
        setFormValues({
          firstName: response.data.first_name || '',
          lastName: response.data.last_name || '',
          email: response.data.email || '',
          telephone: response.data.telephone || '',
          city: response.data.city || '',
          address: response.data.address || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    checkAuthentication();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/user/update', formValues, {
        withCredentials: true,
      });
      alert('User information updated successfully.');
    } catch (error) {
      console.error('Error updating user information:', error);
      alert('Error updating user information.');
    }
  };

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
            <p className="text-xl font-semibold text-gray-800">
              {isAuthenticated
                ? `${formValues.firstName} ${formValues.lastName}`
                : 'Guest'}
            </p>
            <p className="text-sm text-gray-600">
              Username: {user?.username || 'Username'}
            </p>
          </div>
          <div className="space-y-4">
            <Link
              to={isAuthenticated ? '/edit-profile' : '#'}
              className={`flex items-center text-gray-700 ${
                isAuthenticated ? 'hover:text-blue-600' : 'cursor-not-allowed'
              }`}
            >
              <CgProfile className="text-xl mr-2 p-1 border border-gray-300 rounded-full" />
              <span>Edit Profile</span>
            </Link>
            <Link
              to={isAuthenticated ? '/address' : '#'}
              className={`flex items-center text-gray-700 ${
                isAuthenticated ? 'hover:text-blue-600' : 'cursor-not-allowed'
              }`}
            >
              <FaLocationPin className="text-xl mr-2 p-1 border border-gray-300 rounded-full" />
              <span>{formValues.city || 'City'}</span>
            </Link>
            <Link
              to={isAuthenticated ? '/orders' : '#'}
              className={`flex items-center text-gray-700 ${
                isAuthenticated ? 'hover:text-blue-600' : 'cursor-not-allowed'
              }`}
            >
              <FaLocationPin className="text-xl mr-2 p-1 border border-gray-300 rounded-full" />
              <span>{formValues.telephone || 'Telephone'}</span>
            </Link>
            <Link
              to={isAuthenticated ? '/reviews' : '#'}
              className={`flex items-center text-gray-700 ${
                isAuthenticated ? 'hover:text-blue-600' : 'cursor-not-allowed'
              }`}
            >
              <FaLocationPin className="text-xl mr-2 p-1 border border-gray-300 rounded-full" />
              <span>{formValues.email || 'Email'}</span>
            </Link>
            <Link
              to={isAuthenticated ? '/logout' : '#'}
              className={`flex items-center text-gray-700 ${
                isAuthenticated ? 'hover:text-blue-600' : 'cursor-not-allowed'
              }`}
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
          {isAuthenticated ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleInputChange}
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
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleInputChange}
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
                    value={formValues.email}
                    onChange={handleInputChange}
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
                    value={formValues.telephone}
                    onChange={handleInputChange}
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
                    value={formValues.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="New York"
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
                    value={formValues.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                    placeholder="1234 Main St"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Profile
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                You are not logged in. Please log in to view or edit your
                profile.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User2;
