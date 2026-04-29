import React from 'react'
import Header from "../components/Layout/Header"
import Hero from "../components/Route/Hero/Hero"
import Categories from "../components/Route/Categories/Categories.jsx"
import BestDeals from "../components/Route/BestDeals/BestDeals"

const HomePage = () => {
  return (
    <div>
      <Header activeHeader={true} />
      <Hero/>
      <Categories/>
      <BestDeals/>
    </div>
  )
}

export default HomePage
