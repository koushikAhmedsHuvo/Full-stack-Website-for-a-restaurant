import React, { useState, useEffect } from 'react';
import loginData from '../../data1.json';
import Logo from '../../assets/logo2.svg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ForgotPasswordModal from './ForgotPasswordModal'; // Import the modal

const Login = () => {
  const { leftSection, rightSection } = loginData;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // State to control modal visibility

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/check_session',
          {
            withCredentials: true, // Ensure cookies are included
          }
        );
        if (response.data.logged_in) {
          navigate('/'); // Redirect to home if already logged in
        }
      } catch (err) {
        console.log('Session check failed', err);
      }
    };

    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(
        'http://localhost:5000/login',
        {
          email,
          password,
        },
        { withCredentials: true } // Ensure cookies are included
      );

      if (response.data.message === 'Login successful!') {
        setSuccessMessage('Login successful!');
        setTimeout(() => {
          navigate('/'); // Redirect to home page
        }, 1000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-row bg-white w-full">
        {/* Left Section */}
        <div className="relative w-1/2 bg-gradient-to-br from-blue-500 to-purple-600">
          <img
            src={leftSection.backgroundImage}
            alt="Illustration"
            className="w-full h-full object-cover"
          />
          <Link to="/">
            {/* Adjust the 'to' prop as needed */}
            <img
              src={Logo}
              alt="logo"
              className="absolute top-8 left-8 h-16 w-auto"
            />
          </Link>
          <div className="absolute bottom-4 left-4 right-4 text-xl text-black p-2 rounded-lg">
            <p className="leading-tight">
              {leftSection.termsText}{' '}
              <span className="text-primary-color underline">
                <a href={leftSection.termsLink.url}>
                  {leftSection.termsLink.text}
                </a>
              </span>
            </p>
          </div>
        </div>
        {/* Right Section */}
        <div className="w-1/2 pt-14 px-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {rightSection.welcomeText}
          </h1>
          <p className="text-gray-600 mb-8">{rightSection.subText}</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {successMessage && (
              <p className="text-green-500 text-center">{successMessage}</p>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {rightSection.emailLabel}
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={rightSection.emailPlaceholder}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {rightSection.passwordLabel}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={rightSection.passwordPlaceholder}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2">
                  {rightSection.rememberMeLabel}
                </label>
              </div>
              <button
                type="button"
                onClick={openForgotPasswordModal}
                className="text-primary-color hover:underline"
              >
                {rightSection.forgotPasswordText}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary-color text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {rightSection.loginButtonText}
            </button>

            <button className="w-full py-3 px-4 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
              {rightSection.googleButtonText}
            </button>
            <p className="text-sm text-gray-600 mt-6 text-center">
              {rightSection.signupText}{' '}
              <Link
                to={rightSection.signupUrl}
                className="text-blue-600 hover:underline"
              >
                {rightSection.signupLinkText}
              </Link>
            </p>
          </form>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <ForgotPasswordModal onClose={closeForgotPasswordModal} />
      )}
    </div>
  );
};

export default Login;
