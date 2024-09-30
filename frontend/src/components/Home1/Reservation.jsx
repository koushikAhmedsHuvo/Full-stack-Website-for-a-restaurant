import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaChair } from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import axios from 'axios';
import ErrorModal from '../Home1/ErrorModal'; // Import the ErrorModal component

const initialTables = Array(20).fill(false);

const Reservation = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTables, setSelectedTables] = useState([]);
  const [tables, setTables] = useState(initialTables);
  const [reservationConfirmed, setReservationConfirmed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // State to handle error message
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/check-session',
          { withCredentials: true }
        );
        setIsAuthenticated(response.data.isLoggedIn);
        if (response.data.isLoggedIn) setUserEmail(response.data.email);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleTableSelection = (tableIndex) => {
    setSelectedTables((prevSelected) =>
      prevSelected.includes(tableIndex)
        ? prevSelected.filter((index) => index !== tableIndex)
        : [...prevSelected, tableIndex]
    );
  };

  const handleReservation = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Please log in to make a reservation.');
      navigate('/login');
      return;
    }

    if (selectedTables.length === 0) {
      setErrorMessage(
        'Please select at least one table before confirming the reservation.'
      );
      return;
    }

    const reservationData = {
      reservation_date: selectedDate.toISOString().split('T')[0], // Extract the date part
      reservation_time: selectedDate.toTimeString().split(' ')[0], // Extract the time part
      tables_reserved: selectedTables.map((table) => table + 1), // Convert to 1-based table IDs
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/reservations',
        reservationData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        setTables((prevTables) =>
          prevTables.map((reserved, index) =>
            selectedTables.includes(index) ? true : reserved
          )
        );
        setReservationConfirmed(true);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage('You must be logged in to make a reservation.');
          navigate('/login');
        } else if (error.response.status === 409) {
          setErrorMessage(
            'Some of the selected tables are already reserved for the chosen time.'
          );
        } else {
          setErrorMessage('An error occurred while making the reservation.');
        }
      } else {
        setErrorMessage('An error occurred while making the reservation.');
      }
    }
  };

  const closeModal = () => {
    setErrorMessage(null); // Close the modal by clearing the error message
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg mt-10 mb-16">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Table Reservation
      </h2>

      <div className="space-y-6">
        {/* Date and Time Picker */}
        <div className="flex justify-between items-center">
          <div className="w-1/2 p-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date and Time
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              dateFormat="Pp"
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="w-1/2 text-center">
            <p className="text-gray-600 font-medium">
              Selected: {selectedDate.toLocaleDateString()} at{' '}
              {selectedDate.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Table Selection */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Select Tables
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {tables.map((isReserved, index) => (
              <div
                key={index}
                onClick={() => !isReserved && handleTableSelection(index)}
                className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer ${
                  isReserved
                    ? 'bg-red-500 text-white cursor-not-allowed'
                    : selectedTables.includes(index)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                <FaChair className="text-xl" />
                <span className="ml-2">Table {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Reservation */}
        <div className="text-center mt-6">
          {reservationConfirmed ? (
            <div className="flex flex-col items-center space-y-4">
              <IoMdCheckmarkCircle className="text-green-500 text-6xl" />
              <p className="text-lg font-semibold text-gray-800">
                Reservation Confirmed for Tables{' '}
                {selectedTables.map((table) => table + 1).join(', ')}
              </p>
              <p className="text-gray-600">
                {selectedDate.toLocaleDateString()} at{' '}
                {selectedDate.toLocaleTimeString()}
              </p>
            </div>
          ) : (
            <button
              onClick={handleReservation}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Confirm Reservation
            </button>
          )}
        </div>
      </div>

      {/* Display the error modal if there's an error message */}
      {errorMessage && (
        <ErrorModal message={errorMessage} onClose={closeModal} />
      )}
    </div>
  );
};

export default Reservation;
