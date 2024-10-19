import React from 'react';
import Navbar from '../Home1/Navbar';
import OrderHistory from '../Home1/OrderHistory';
import Faq from '../Home1/Faq';
import Resturant from '../Home1/Resturant';
import Footer from '../Home1/Footer';
import CopyRight from '../Home1/CopyRight';

const OrderHistoryPage = () => {
  return (
    <div>
      <Navbar />
      <OrderHistory />
      <Faq />
      <Resturant />
      <Footer />
      <CopyRight />
    </div>
  );
};

export default OrderHistoryPage;
