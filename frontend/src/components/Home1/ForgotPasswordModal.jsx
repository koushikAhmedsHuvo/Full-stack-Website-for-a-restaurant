// ForgotPasswordModal.js
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState(''); // State for storing email input
  const [message, setMessage] = useState(''); // State for success message
  const [error, setError] = useState(''); // State for error message
  const [code, setCode] = useState(''); // State for storing verification code
  const [newPassword, setNewPassword] = useState(''); // State for storing new password
  const [step, setStep] = useState(1); // Step state for tracking progress

  const handleEmailSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage(''); // Reset message state
    setError(''); // Reset error state

    try {
      const response = await axios.post(
        'http://localhost:5000/forgot_password',
        { email }
      );
      if (response.data.success) {
        setMessage('Verification code sent! Please check your email.'); // Set success message
        setStep(2); // Move to the next step
      } else {
        setError('Failed to send verification code. Please try again.'); // Set error message if response is not successful
      }
    } catch (err) {
      setError('An error occurred. Please try again.'); // Set error message on catch
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setMessage(''); // Reset message state
    setError(''); // Reset error state

    // Validate inputs
    if (!email || !code || !newPassword) {
      setError('All fields are required.'); // Set error message if fields are empty
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/reset_password',
        { email, code, new_password: newPassword } // Include email in the payload
      );
      if (response.data.success) {
        setMessage('Password has been reset successfully!'); // Set success message
        setStep(1); // Go back to the first step or close modal
      } else {
        setError(
          'Failed to reset password. Please check your verification code.' // Set error message
        );
      }
    } catch (err) {
      setError('An error occurred. Please try again.'); // Set error message on catch
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {step === 1 ? 'Forgot Password' : 'Verify Code'}
        </h2>
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="example@example.com"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Send Verification Code
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            {message && <p className="text-green-500">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Enter verification code:
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                Enter new password:
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              Reset Password
            </button>
            <button
              type="button"
              onClick={() => setStep(1)} // Go back to the first step
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
