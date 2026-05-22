import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Footer from "../components/Layout/Footer"
import Header from "../components/Layout/Header"
import ProductDetails from "../components/Products/ProductDetails"
import { productData } from "../static/data"

const ProductDetailsPage = () => {
  const {name} = useParams(); 
  const [data, setData] = useState(null);
  const productsName = name.replace(/-/g, ' ');


  useEffect (() => {
    const data = productData.find((i) => i.name === productsName);
    setData(data);
  }, []);

  return (
    <div>
      <Header />
      {data && <ProductDetails product={data} />}

      <Footer />
    </div>
  )
}

export default ProductDetailsPage;