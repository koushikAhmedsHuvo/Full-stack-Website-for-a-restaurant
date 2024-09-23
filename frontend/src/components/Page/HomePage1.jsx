import React from 'react';
import Navbar from '../Home1/Navbar';
import Banner from '../Home1/Banner';
import Categories from '../Home1/Categories';
import FoodItems from '../Home1/FoodItems';
import Crafting from '../Home1/Crafting';
import PopularItem from '../Home1/PopularItem';
import CustomerSay from '../Home1/CustomerSay';
import Faq from '../Home1/Faq';
import Resturant from '../Home1/Resturant';
import Footer from '../Home1/Footer';
import CopyRight from '../Home1/CopyRight';

const HomePage1 = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <Categories />
      <FoodItems />
      <Crafting />
      <PopularItem />
      <CustomerSay />
      <Faq />
      <Resturant />
      <Footer />
      <CopyRight />
    </div>
  );
};

export default HomePage1;
