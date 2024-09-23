import React from 'react';
import Navbar from '../Home1/Navbar';
import User1 from '../Home1/User1';
import User2 from '../Home1/User2';
import Faq from '../Home1/Faq';
import Resturant from '../Home1/Resturant';
import Footer from '../Home1/Footer';
import CopyRight from '../Home1/CopyRight';

const UserPage = () => {
  return (
    <div>
      <Navbar />
      <User1 />
      <User2 />
      <Faq />
      <Resturant />
      <Footer />
      <CopyRight />
    </div>
  );
};

export default UserPage;
