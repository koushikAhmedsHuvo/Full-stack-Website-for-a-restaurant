import React from 'react';
import backgroundImage from '../../assets/inner-bg.png';

const Pickup2 = () => {
  return (
    <div
      className="min-h-[75vh] bg-cover bg-center flex flex-col justify-center items-center -mt-24" // Adjust the -mt value as needed
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Content Section */}
      <div className="text-center text-white p-8 bg-opacity-70 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">All Food Menu </h1>
        <p className="text-lg mb-4">Home &gt; Pickup</p>
      </div>
    </div>
  );
};

export default Pickup2;
