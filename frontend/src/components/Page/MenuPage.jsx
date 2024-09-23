import React from 'react';
import Navbar from '../Home1/Navbar';
import Menu1 from '../Home1/Menu1';
import Faq from '../Home1/Faq';
import Resturant from '../Home1/Resturant';
import Footer from '../Home1/Footer';
import CopyRight from '../Home1/CopyRight';
import PopularItem from '../Home1/PopularItem';

const MenuPage = () => {
  return (
    <div>
      <Navbar />
      <Menu1 />
      <PopularItem />
      <Faq />
      <Resturant />
      <Footer />
      <CopyRight />
    </div>
  );
};

export default MenuPage;
