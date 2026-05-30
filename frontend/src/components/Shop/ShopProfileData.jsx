import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";
import { productData } from "../../static/data";
import {
  AiOutlineInbox,
  AiOutlineCalendar,
  AiOutlineMessage,
} from "react-icons/ai";

const EmptyState = ({ icon, title, subtitle }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
    <div className="text-gray-300 mb-3">{icon}</div>
    <h5 className="text-[16px] font-[600] text-gray-500">{title}</h5>
    <p className="text-[13px] mt-1 text-gray-400">{subtitle}</p>
  </div>
);

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
    staticProducts &&
    staticProducts.map((product) => product.reviews || []).flat();

  const tabs = [
    { id: 1, label: "Shop Products" },
    { id: 2, label: "Running Events" },
    { id: 3, label: "Shop Reviews" },
  ];

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-6">
      {/* Tabs Row */}
      <div className="flex w-full items-center justify-between border-b border-gray-100 pb-3 mb-6">
        <div className="flex gap-7">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="relative pb-3 cursor-pointer"
              onClick={() => setActive(tab.id)}
            >
              <h5
                className={`font-[600] text-[15px] transition-colors ${
                  active === tab.id
                    ? "text-[#f44336]"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </h5>
              {active === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#f44336] rounded-full" />
              )}
            </div>
          ))}
        </div>

        {isOwner && (
          <Link to="/dashboard">
            <div
              className={`${styles.button} !rounded-lg !h-[38px] !px-5`}
            >
              <span className="text-white text-[13px] font-[600]">
                Go Dashboard
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Tab: Shop Products */}
      {active === 1 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
          {staticProducts && staticProducts.length > 0 ? (
            staticProducts.map((item, index) => (
              <ProductCard data={item} key={index} isShop={true} />
            ))
          ) : (
            <EmptyState
              icon={<AiOutlineInbox size={52} />}
              title="No Products Available"
              subtitle="This shop hasn't listed any products yet."
            />
          )}
        </div>
      )}

      {/* Tab: Running Events */}
      {active === 2 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-6">
          {events && events.length > 0 ? (
            events.map((item, index) => (
              <ProductCard
                data={item}
                key={index}
                isShop={true}
                isEvent={true}
              />
            ))
          ) : (
            <EmptyState
              icon={<AiOutlineCalendar size={52} />}
              title="No Events Available"
              subtitle="This shop hasn't posted any events yet."
            />
          )}
        </div>
      )}

      {/* Tab: Shop Reviews */}
      {active === 3 && (
        <div className="w-full">
          {allReviews && allReviews.length > 0 ? (
            <div className="space-y-3">
              {allReviews.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  {item.user?.avatar?.url ? (
                    <img
                      src={item.user.avatar.url}
                      className="w-[46px] h-[46px] rounded-full object-cover flex-shrink-0 border-2 border-gray-100"
                      alt={item.user?.name || "User"}
                    />
                  ) : (
                    <div className="w-[46px] h-[46px] rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border-2 border-gray-100">
                      <AiOutlineMessage size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <h1 className="font-[600] text-[14px] text-gray-800">
                          {item.user?.name || "Anonymous"}
                        </h1>
                        <Ratings rating={item.rating} />
                      </div>
                      <span className="text-gray-400 text-[12px] flex-shrink-0">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )
                          : "Recently"}
                      </span>
                    </div>
                    <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">
                      {item?.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <AiOutlineMessage size={52} className="text-gray-300 mb-3" />
              <h5 className="text-[16px] font-[600] text-gray-500">
                No Reviews Yet
              </h5>
              <p className="text-[13px] mt-1 text-gray-400">
                Be the first to review this shop!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;