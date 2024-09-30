import React from 'react';

const ErrorModal = ({ message, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose} // Close the modal when clicking the backdrop
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside it
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Reservation Error
        </h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
