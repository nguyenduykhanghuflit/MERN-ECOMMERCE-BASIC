import React from 'react';
import Categories from '../components/Categories';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

import Products from '../components/Products';
import Slider from '../components/Slider';

const Home = () => {
  const queryKey = '/product?limit=8';
  return (
    <div>
      <Navbar />
      <Slider />
      <Categories />
      <Products home queryKey={queryKey} />

      <Footer />
    </div>
  );
};

export default Home;
