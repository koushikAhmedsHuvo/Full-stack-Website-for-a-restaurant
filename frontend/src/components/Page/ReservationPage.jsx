import React from 'react';
import Navbar from '../Home1/Navbar';
import Reservation2 from '../Home1/Reservation2';
import Reservation from '../Home1/Reservation';
import Faq from '../Home1/Faq';
import Resturant from '../Home1/Resturant';
import Footer from '../Home1/Footer';
import CopyRight from '../Home1/CopyRight';

const ReservationPage = () => {
  return (
    <div>
      <Navbar />
      <Reservation2 />
      <Reservation />
      <Faq />
      <Resturant />
      <Footer />
      <CopyRight />
    </div>
  );
};

export default ReservationPage;
