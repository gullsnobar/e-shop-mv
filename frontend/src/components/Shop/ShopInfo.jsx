import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { productData } from "../../static/data";
import {
  AiOutlineEnvironment,
  AiOutlinePhone,
  AiOutlineShop,
  AiOutlineStar,
  AiOutlineCalendar,
} from "react-icons/ai";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  const staticProducts = productData.filter((p) => p.shop?._id === id);

  const buildFallbackShop = (shopObj) => ({
    ...shopObj,
    avatar: shopObj.avatar || shopObj.shop_avatar,
    description:
      shopObj.description ||
      "Welcome to our shop! We offer quality products with great deals and excellent customer service.",
    address: shopObj.address || "Main Street, City Center",
    phoneNumber: shopObj.phoneNumber || "0300-1234567",
    createdAt: shopObj.createdAt || "2023-01-01T00:00:00.000Z",
  });

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        const shop = res.data.shop;
        if (shop) {
          setData(shop);
        } else {
          const fallback = productData.find((p) => p.shop?._id === id);
          if (fallback) setData(buildFallbackShop(fallback.shop));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        const fallback = productData.find((p) => p.shop?._id === id);
        if (fallback) setData(buildFallbackShop(fallback.shop));
        setIsLoading(false);
      });
  }, [id]);

  const activeProducts =
    products && products.length > 0 ? products : staticProducts;

  const totalReviewsLength =
    activeProducts &&
    activeProducts.reduce(
      (acc, product) => acc + (product.reviews?.length || 0),
      0
    );

  const totalRatings =
    activeProducts &&
    activeProducts.reduce(
      (acc, product) =>
        acc +
        (product.reviews || []).reduce(
          (sum, review) => sum + (review.rating || 0),
          0
        ),
      0
    );

  const averageRating =
    totalReviewsLength > 0
      ? totalRatings / totalReviewsLength
      : data.ratings || 0;

  const infoRows = [
    {
      icon: <AiOutlineEnvironment size={18} />,
      label: "Address",
      value: data.address || "—",
    },
    {
      icon: <AiOutlinePhone size={18} />,
      label: "Phone Number",
      value: data.phoneNumber || "—",
    },
    {
      icon: <AiOutlineShop size={18} />,
      label: "Total Products",
      value: activeProducts?.length || 0,
    },
    {
      icon: <AiOutlineStar size={18} />,
      label: "Shop Ratings",
      value: `${averageRating.toFixed(1)}/5`,
    },
    {
      icon: <AiOutlineCalendar size={18} />,
      label: "Joined On",
      value: data?.createdAt
        ? new Date(data.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    },
  ];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-5">
          {/* Avatar + Name + Description */}
          <div className="flex flex-col items-center pb-5 border-b border-gray-100">
            <div className="relative">
              {data.avatar?.url ? (
                <img
                  src={data.avatar.url}
                  alt={data.name || "Shop"}
                  className="w-[120px] h-[120px] object-cover rounded-full border-4 border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full border-4 border-gray-100 shadow-sm bg-gray-200 flex items-center justify-center">
                  <AiOutlineShop size={48} className="text-gray-400" />
                </div>
              )}
            </div>

            <h3 className="text-center text-[20px] font-[700] text-gray-900 mt-3 font-Roboto">
              {data.name || "Shop Name"}
            </h3>
            <p className="text-[13px] text-gray-500 text-center mt-1.5 leading-relaxed px-3 line-clamp-3">
              {data.description ||
                "Welcome to our shop! We offer quality products with great deals and excellent customer service."}
            </p>
          </div>

          {/* Info Rows */}
          <div className="mt-4">
            {infoRows.map((row, index) => (
              <div
                key={index}
                className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-b-0"
              >
                <div className="text-gray-400 mt-[2px] flex-shrink-0">
                  {row.icon}
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    {row.label}
                  </p>
                  <p className="text-[14px] font-[600] text-gray-800 mt-0.5">
                    {row.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Owner Buttons */}
          {isOwner && (
            <div className="mt-5 space-y-2.5">
              <Link to="/settings">
                <div
                  className={`${styles.button} !w-full !h-[42px] !rounded-lg`}
                >
                  <span className="text-white text-[14px] font-[600]">
                    Edit Shop
                  </span>
                </div>
              </Link>
              <Link to="/dashboard">
                <div
                  className={`${styles.button} !w-full !h-[42px] !rounded-lg !mt-2`}
                >
                  <span className="text-white text-[14px] font-[600]">
                    Go Dashboard
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;