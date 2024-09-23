import React, { useEffect, useState } from 'react';
import bannerImage from '../../assets/banner.png';
import '../../css/buttonStyle.css';
import jsonData from '../../data.json';

const Banner = () => {
  const [techs, setTechs] = useState({});

  useEffect(() => {
    setTechs(jsonData);
  }, []);

  return (
    <div
      className="banner relative h-full w-full lg:h-full bg-cover bg-center bg-no-repeat flex "
      style={{
        backgroundImage: `url(${bannerImage})`,
      }}
    >
      <div className="text-white w-full ml-5   mt-16  p-2 lg:ml-14 lg:mt-32">
        {Object.keys(techs).length > 0 && (
          <div className="flex flex-col justify-center ">
            <h1 className="text-4xl lg:text-6xl ">{techs.heading1}</h1>
            <h1 className="text-4xl lg:text-6xl lg:mt-5 ">{techs.heading2}</h1>
            <h1 className="text-4xl lg:text-6xl lg:mt-5 ">{techs.heading3}</h1>
            <h1 className="text-4xl mt-2 text-primary-color lg:text-6xl lg:mt-7 ">
              {techs.heading4}
            </h1>
          </div>
        )}
        <div className="w-11/12 lg:w-1/2">
          <p className="text-lg mt-2 lg:text-xl lg:mt-5">{techs.paragraph}</p>
        </div>
        <div className="flex flex-col mt-8 border border-solid border-black bg-white w-11/12  mb-10  rounded-lg items-center lg:mt-14 lg:flex lg:flex-row lg:w-1/2">
          {techs.buttons1 &&
            techs.buttons1.map((button, index) => (
              <div key={index} className="w-48 lg:p-2 lg:mt-0 mt-2">
                <button
                  className={`flex items-center justify-center w-full text-black px-3 py-4 rounded-lg border border-primary-color btn btn2 transition duration-500 ease-in-out  hover:bg-red-600 hover:border-red-600 ${
                    button.value
                      ? 'bg-primary-color hover:bg-white hover:text-black'
                      : 'bg-white'
                  }`}
                >
                  {button.text}
                </button>
              </div>
            ))}
        </div>
        <div className="lg:mb-32"></div>
      </div>
    </div>
  );
};

export default Banner;
