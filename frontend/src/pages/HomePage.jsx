import React from 'react'
import Header from "../components/Layout/Header"
import Hero from "../components/Route/Hero/Hero"
import Categories from "../components/Route/Categories/Categories.jsx"
import BestDeals from "../components/Route/BestDeals/BestDeals"
import FeaturedProduct from '../components/Route/FeaturedProduct/FeaturedProduct.jsx'
import Events from "../components/Events/Events.jsx"
import Sponsored from "../components/Events/Sponsored"
import Footer from "../components/Layout/Footer"

const HomePage = () => {
  return (
    <div>
      <Header activeHeader={true} />
      <Hero/>
      <Categories/>
      <BestDeals/>
      <Events/>
      <FeaturedProduct/>
      <Sponsored/>
      <Footer/>
    </div>
  )
}

export default HomePage
