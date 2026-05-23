import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import Footer from "../components/Layout/Footer"
import Header from "../components/Layout/Header"
import ProductDetails from "../components/Products/ProductDetails"
import { productData } from "../static/data"

const ProductDetailsPage = () => {
  const {name} = useParams();
  const [data, setData] = useState(null);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    // Match by URL slug so dashes inside product names are preserved correctly
    const found = allProducts?.find((i) => i.name?.replace(/\s+/g, '-') === name)
      || productData.find((i) => i.name?.replace(/\s+/g, '-') === name);
    setData(found || null);
  }, [name, allProducts]);

  return (
    <div>
      <Header />
      {data ? (
        <ProductDetails data={data} />
      ) : (
        <div className="w-full h-[60vh] flex items-center justify-center text-gray-500 text-lg">
          Product not found
        </div>
      )}
      <Footer />
    </div>
  )
}

export default ProductDetailsPage;