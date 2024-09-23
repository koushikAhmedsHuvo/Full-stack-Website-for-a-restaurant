import React from 'react';
import Contact1 from '../Home1/Contact1';
import Navbar from '../Home1/Navbar';
import Contact2 from '../Home1/Contact2';
import Faq from '../Home1/Faq';
import Resturant from '../Home1/Resturant';
import Footer from '../Home1/Footer';
import CopyRight from '../Home1/CopyRight';

const ContactPage = () => {
  return (
    <div>
      <Navbar />
      <Contact1 />
      <Contact2 />
      <Faq />
      <Resturant />
      <Footer />
      <CopyRight />
    </div>
  );
};

export default ContactPage;
