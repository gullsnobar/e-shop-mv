import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";
import { productData } from "../../static/data";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch, id]);

  const [active, setActive] = useState(1);

  const staticProducts =
    products && products.length > 0
      ? products
      : productData.filter((p) => p.shop?._id === id);

  const allReviews =
    staticProducts && staticProducts.map((product) => product.reviews || []).flat();

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6">
      <div className="flex w-full items-center justify-between border-b border-gray-100 pb-4">
        <div className="w-full flex gap-6">
          <div
            className="flex flex-col items-center cursor-pointer relative pb-2"
            onClick={() => setActive(1)}
          >
            <h5
              className={`font-[600] text-[16px] transition-colors ${
                active === 1 ? "text-red-500" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Shop Products
            </h5>
            {active === 1 && (
              <div className="absolute bottom-[-9px] left-0 h-[3px] w-full bg-red-500 rounded-full" />
            )}
          </div>
          <div
            className="flex flex-col items-center cursor-pointer relative pb-2"
            onClick={() => setActive(2)}
          >
            <h5
              className={`font-[600] text-[16px] transition-colors ${
                active === 2 ? "text-red-500" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Running Events
            </h5>
            {active === 2 && (
              <div className="absolute bottom-[-9px] left-0 h-[3px] w-full bg-red-500 rounded-full" />
            )}
          </div>
          <div
            className="flex flex-col items-center cursor-pointer relative pb-2"
            onClick={() => setActive(3)}
          >
            <h5
              className={`font-[600] text-[16px] transition-colors ${
                active === 3 ? "text-red-500" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Shop Reviews
            </h5>
            {active === 3 && (
              <div className="absolute bottom-[-9px] left-0 h-[3px] w-full bg-red-500 rounded-full" />
            )}
          </div>
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to="/dashboard">
                <div className={`${styles.button} !rounded-xl !h-[40px] hover:bg-gray-800 transition-colors`}>
                  <span className="text-[#fff] text-[14px] font-medium">Go Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6">
        {active === 1 && (
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
            {staticProducts && staticProducts.length > 0 ? (
              staticProducts.map((i, index) => (
                <ProductCard data={i} key={index} isShop={true} />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                <span className="text-4xl mb-3">📦</span>
                <h5 className="text-[18px] font-medium">No Products Available</h5>
                <p className="text-sm mt-1">This shop hasn't listed any products yet.</p>
              </div>
            )}
          </div>
        )}

        {active === 2 && (
          <div className="w-full">
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
              {events && events.length > 0 ? (
                events.map((i, index) => (
                  <ProductCard data={i} key={index} isShop={true} isEvent={true} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                  <span className="text-4xl mb-3">🎉</span>
                  <h5 className="text-[18px] font-medium">No Events Available</h5>
                  <p className="text-sm mt-1">This shop hasn't posted any events yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {active === 3 && (
          <div className="w-full">
            {allReviews && allReviews.length > 0 ? (
              <div className="space-y-4">
                {allReviews.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <img
                      src={item.user?.avatar?.url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%239ca3af'%3E👤%3C/text%3E%3C/svg%3E"}
                      className="w-[50px] h-[50px] rounded-full object-cover flex-shrink-0"
                      alt=""
                    />
                    <div className="flex-1">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h1 className="font-[600] text-gray-800">{item.user?.name || "Anonymous"}</h1>
                          <Ratings rating={item.rating} />
                        </div>
                        <span className="text-gray-400 text-[12px]">2 days ago</span>
                      </div>
                      <p className="font-[400] text-gray-600 mt-1 text-[14px]">{item?.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <span className="text-4xl mb-3">💬</span>
                <h5 className="text-[18px] font-medium">No Reviews Yet</h5>
                <p className="text-sm mt-1">Be the first to review this shop!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProfileData;