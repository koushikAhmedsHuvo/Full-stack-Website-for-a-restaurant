import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage1 from './components/Page/HomePage1';
import Login from './components/Home1/Login';
import Signup from './components/Home1/Signup';
import AboutUs from './components/Page/AboutUs';
import ContactPage from './components/Page/ContactPage';
import PrivacyPage from './components/Page/PrivacyPage';
import MenuPage from './components/Page/MenuPage';
import UserPage from './components/Page/UserPage';
import Cart from './components/Page/Cart';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage1 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
