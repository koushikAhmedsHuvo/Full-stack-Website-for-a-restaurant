// MessageModal.js
import React from 'react';

const MessageModal = ({ message, onClose, type }) => {
  const isError = type === 'error';

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg p-8 w-96 ${
          isError ? 'border border-red-500' : 'border border-green-500'
        }`}
      >
        <h2
          className={`text-2xl mb-4 ${
            isError ? 'text-red-500' : 'text-green-500'
          }`}
        >
          {isError ? 'Error' : 'Success'}
        </h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className={`bg-${
              isError ? 'red' : 'green'
            }-500 text-white px-4 py-2 rounded-lg`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
