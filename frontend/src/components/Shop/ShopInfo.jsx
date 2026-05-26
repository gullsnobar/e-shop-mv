import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { productData } from "../../static/data";

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

  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });
    window.location.reload();
  };

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

  const handleImageError = (e) => {
    e.target.style.display = "none";
    const parent = e.target.parentElement;
    if (parent) {
      parent.innerHTML = `<div class="w-[110px] h-[110px] rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner"><span class="text-3xl">🏪</span></div>`;
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="w-full flex flex-col items-center pb-5 border-b border-gray-100">
            <div className="w-full flex justify-center mb-4">
              <img
                src={
                  data.avatar?.url ||
                  ""
                }
                alt={data.name || "Shop"}
                className="w-[110px] h-[110px] object-cover rounded-full ring-4 ring-gray-50 shadow-sm"
                onError={handleImageError}
              />
            </div>
            <h3 className="text-center text-[22px] font-[600] text-gray-800 font-Roboto">
              {data.name}
            </h3>
            <p className="text-[14px] text-gray-500 text-center mt-2 leading-relaxed px-2 line-clamp-3">
              {data.description}
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-[36px] h-[36px] rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-sm">📍</span>
              </div>
              <div>
                <h5 className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Address</h5>
                <h4 className="text-[14px] text-gray-700 font-medium mt-0.5">{data.address || "—"}</h4>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-[36px] h-[36px] rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-sm">📞</span>
              </div>
              <div>
                <h5 className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Phone Number</h5>
                <h4 className="text-[14px] text-gray-700 font-medium mt-0.5">{data.phoneNumber || "—"}</h4>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-[36px] h-[36px] rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-sm">📦</span>
              </div>
              <div>
                <h5 className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Total Products</h5>
                <h4 className="text-[14px] text-gray-700 font-medium mt-0.5">{activeProducts?.length || 0}</h4>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-[36px] h-[36px] rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-sm">⭐</span>
              </div>
              <div>
                <h5 className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Shop Ratings</h5>
                <h4 className="text-[14px] text-gray-700 font-medium mt-0.5">{averageRating.toFixed(1)}/5</h4>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-[36px] h-[36px] rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-sm">📅</span>
              </div>
              <div>
                <h5 className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Joined On</h5>
                <h4 className="text-[14px] text-gray-700 font-medium mt-0.5">{data?.createdAt?.slice(0, 10) || "—"}</h4>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
              <Link to="/settings">
                <div className={`${styles.button} !w-full !h-[44px] !rounded-xl hover:bg-gray-800 transition-colors`}>
                  <span className="text-white text-[14px] font-medium">Edit Shop</span>
                </div>
              </Link>
              <div
                className={`${styles.button} !w-full !h-[44px] !rounded-xl !bg-red-500 hover:!bg-red-600 transition-colors cursor-pointer`}
                onClick={logoutHandler}
              >
                <span className="text-white text-[14px] font-medium">Log Out</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;