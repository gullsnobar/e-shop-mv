import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { getAllProducts } from "../../../redux/actions/products";

const FeaturedProduct = () => {
  const {allProducts} = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);
   
  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Featured Products</h1>
        </div>
        <div className="w-full grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {allProducts && allProducts.length > 0 ? (
            allProducts.map((i, index) => <ProductCard data={i} key={i._id || i.id || index} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No products available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;