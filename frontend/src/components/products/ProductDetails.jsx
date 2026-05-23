import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";
import ProductCard from "../Route/ProductCard/ProductCard";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { allProducts, shopProducts: products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;
  const averageRating = avg.toFixed(2);

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  const relatedProducts = allProducts
    ? allProducts.filter(
        (p) => p.category === data.category && p._id !== data._id
      ).slice(0, 4)
    : [];

  return (
    <div className="bg-[#f8f9fc] min-h-screen pb-16">
      {data ? (
        <div className="w-[95%] md:w-[92%] lg:w-[85%] mx-auto pt-6">

          {/* ========== MAIN PRODUCT SECTION ========== */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 p-6 md:p-10 mb-10">
            <div className="product-detail-wrapper grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

              {/* LEFT: Image Gallery */}
              <div className="w-full">
                {/* Main Image */}
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center h-[360px] md:h-[420px] group cursor-zoom-in">
                  <img
                    src={`${data.images && data.images[select]?.url}`}
                    alt={data.name}
                    className="max-w-[85%] max-h-[85%] object-contain transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {data.originalPrice && data.discountPrice && (
                    <span className="absolute top-4 right-4 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md">
                      -{Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% OFF
                    </span>
                  )}
                  {data.stock < 5 && data.stock > 0 && (
                    <span className="absolute top-4 left-4 bg-orange-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md">
                      Only {data.stock} left!
                    </span>
                  )}
                </div>

                {/* Thumbnail Strip */}
                <div className="flex gap-3 mt-5 justify-center">
                  {data.images &&
                    data.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelect(index)}
                        className={`w-[70px] h-[70px] rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-md ${
                          select === index
                            ? "border-[#3321c8] shadow-lg shadow-blue-100 scale-105"
                            : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={`${img?.url}`}
                          alt=""
                          className="w-full h-full object-contain p-1.5"
                        />
                      </button>
                    ))}
                </div>
              </div>

              {/* RIGHT: Product Details */}
              <div className="w-full flex flex-col">
                {/* Title */}
                <h1 className="text-[22px] md:text-[26px] font-[800] text-[#0d0d2b] leading-[1.3] tracking-tight">
                  {data.name}
                </h1>

                {/* Rating + Stock */}
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Ratings rating={data?.ratings} />
                    <span className="text-sm font-semibold text-gray-700 ml-1">
                      {data?.ratings || 0}
                    </span>
                  </div>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-500">
                    {totalReviewsLength || 0} reviews
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className={`text-sm font-semibold ${data.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {data.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-end gap-3">
                  <span className="text-[32px] font-[900] text-[#0d0d2b]">
                    ${data.discountPrice}
                  </span>
                  {data.originalPrice && (
                    <span className="text-[18px] text-gray-400 line-through mb-1">
                      ${data.originalPrice}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-100 my-6" />

                {/* Description */}
                <p className="text-gray-500 text-[14.5px] leading-[1.8] mb-6">
                  {data.description.length > 200
                    ? data.description.slice(0, 200) + "..."
                    : data.description}
                </p>

                {/* Quantity + Add to Cart + Wishlist */}
                <div className="flex items-center gap-4 flex-wrap mb-6">
                  {/* Quantity */}
                  <div className="flex items-center h-[48px] border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      className="qty-btn w-12 h-full min-w-[32px] text-lg font-bold text-white bg-[#10b981] hover:bg-[#059669] transition-colors disabled:opacity-40"
                      onClick={decrementCount}
                      disabled={count <= 1}
                    >
                      −
                    </button>
                    <span className="w-14 h-full flex items-center justify-center text-[16px] font-bold text-gray-800 border-x border-gray-200 bg-gray-50">
                      {count}
                    </span>
                    <button
                      className="qty-btn w-12 h-full min-w-[32px] text-lg font-bold text-white bg-[#10b981] hover:bg-[#059669] transition-colors disabled:opacity-40"
                      onClick={incrementCount}
                      disabled={count >= data.stock}
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    className="flex-1 min-w-[180px] h-[48px] bg-[#3321c8] hover:bg-[#261e9e] text-white font-bold rounded-xl shadow-lg shadow-blue-200/40 transition-all duration-300 flex items-center justify-center gap-2.5 hover:-translate-y-0.5 active:translate-y-0"
                    onClick={() => addToCartHandler(data._id)}
                  >
                    <AiOutlineShoppingCart size={20} />
                    Add to Cart
                  </button>

                  {/* Wishlist */}
                  <button
                    className={`w-[48px] h-[48px] rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
                      click
                        ? "border-blue-300 bg-blue-50 text-blue-500 shadow-sm"
                        : "border-gray-200 text-gray-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500"
                    }`}
                    onClick={() =>
                      click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)
                    }
                    title={click ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {click ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                  </button>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-100 my-4" />

                {/* Seller Info Bar */}
                <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                  <Link to={`/shop/preview/${data?.shop._id}`} className="flex items-center gap-3 group">
                    <img
                      src={`${data?.shop?.avatar?.url}`}
                      alt={data.shop.name}
                      className="w-11 h-11 rounded-full object-cover border-2 border-gray-100 group-hover:border-[#3321c8] transition-colors"
                    />
                    <div>
                      <h4 className="text-[14px] font-semibold text-gray-800 group-hover:text-[#3321c8] transition-colors">
                        {data.shop.name}
                      </h4>
                      <span className="text-[12px] text-gray-500">
                        ({averageRating}) Rating · {products?.length || 0} Products
                      </span>
                    </div>
                  </Link>
                  <button
                    onClick={handleMessageSubmit}
                    className="text-sm font-semibold text-[#3321c8] border border-[#3321c8] px-4 py-2 rounded-lg hover:bg-[#3321c8] hover:text-white transition-all duration-300"
                  >
                    <span className="flex items-center gap-1.5">
                      <AiOutlineMessage size={15} />
                      Message
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========== TABS SECTION ========== */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 overflow-hidden mb-10">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                className={"tab flex-1 text-center text-[15px] md:text-[16px] py-4 " + (activeTab === 1 ? "active" : "")}
                data-tab="panel-details"
                onClick={() => setActiveTab(1)}
              >
                Product Details
              </button>
              <button
                className={"tab flex-1 text-center text-[15px] md:text-[16px] py-4 " + (activeTab === 2 ? "active" : "")}
                data-tab="panel-reviews"
                onClick={() => setActiveTab(2)}
              >
                Product Reviews
              </button>
              <button
                className={"tab flex-1 text-center text-[15px] md:text-[16px] py-4 " + (activeTab === 3 ? "active" : "")}
                data-tab="panel-seller"
                onClick={() => setActiveTab(3)}
              >
                Seller Information
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-10 min-h-[200px]">
              <div
                className="tab-panel"
                id="panel-details"
                style={{ display: activeTab === 1 ? "block" : "none" }}
              >
                <div className="animate-fadeIn">
                  <p className="text-gray-600 text-[15px] leading-[2] whitespace-pre-line">
                    {data.description}
                  </p>
                </div>
              </div>

              <div
                className="tab-panel"
                id="panel-reviews"
                style={{ display: activeTab === 2 ? "block" : "none" }}
              >
                <div className="animate-fadeIn">
                  {data && data.reviews && data.reviews.length > 0 ? (
                    <div className="space-y-5">
                      {data.reviews.map((item, index) => (
                        <div key={index} className="flex gap-4 pb-5 border-b border-gray-100 last:border-0">
                          <img
                            src={`${item.user.avatar?.url}`}
                            alt={item.user.name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-[600] text-gray-800">{item.user.name}</h4>
                              <Ratings rating={item.rating} />
                            </div>
                            <p className="text-gray-600 text-[14px] leading-relaxed">{item.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <p className="text-gray-400 text-lg">No reviews yet for this product.</p>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="tab-panel"
                id="panel-seller"
                style={{ display: activeTab === 3 ? "block" : "none" }}
              >
                <div className="animate-fadeIn">
                  <div className="flex flex-col 800px:flex-row gap-10">
                    {/* Left: Seller Profile */}
                    <div className="w-full 800px:w-1/2">
                      <Link to={`/shop/preview/${data.shop._id}`} className="flex items-center gap-4 mb-4 group">
                        <img
                          src={`${data?.shop?.avatar?.url}`}
                          alt={data.shop.name}
                          className="w-[65px] h-[65px] rounded-full object-cover border-2 border-gray-100"
                        />
                        <div>
                          <h3 className="text-[16px] font-bold text-[#3321c8] group-hover:underline">
                            {data.shop.name}
                          </h3>
                          <p className="text-[14px] text-gray-500 mt-0.5">
                            ({averageRating}/5) Ratings
                          </p>
                        </div>
                      </Link>
                      <p className="text-gray-500 text-[14px] leading-[1.9] mt-2">
                        {data.shop.description || "Quality products from a trusted seller. Fast shipping and reliable customer support."}
                      </p>
                    </div>

                    {/* Right: Stats */}
                    <div className="w-full 800px:w-1/2">
                      <div className="space-y-4">
                        <p className="text-[15px]">
                          <span className="font-[700] text-gray-800">Joined on: </span>
                          <span className="text-gray-600">{data.shop?.createdAt?.slice(0, 10)}</span>
                        </p>
                        <p className="text-[15px]">
                          <span className="font-[700] text-gray-800">Total Products: </span>
                          <span className="text-gray-600">{products?.length || 0}</span>
                        </p>
                        <p className="text-[15px]">
                          <span className="font-[700] text-gray-800">Total Reviews: </span>
                          <span className="text-gray-600">{totalReviewsLength || 0}</span>
                        </p>
                      </div>
                      <Link to={`/shop/preview/${data.shop._id}`}>
                        <button className="mt-6 bg-[#3321c8] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#261e9e] transition-all duration-300 shadow-md shadow-blue-100/50 hover:-translate-y-0.5">
                          Visit Shop
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== RELATED PRODUCTS SECTION ========== */}
          {relatedProducts.length > 0 && (
            <div className="mb-10">
              <h2 className="text-[22px] md:text-[26px] font-[800] text-[#0d0d2b] mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {relatedProducts.map((product, index) => (
                  <ProductCard data={product} key={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;