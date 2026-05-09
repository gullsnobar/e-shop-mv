import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setActive(true);
      } else {
        setActive(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* ================= DESKTOP HEADER ================= */}
      <header className="hidden lg:block">
        {/* Top Bar */}
        <div className="w-full bg-white">
          <div className="max-w-[1400px] mx-auto px-4 xl:px-6 h-[70px] flex items-center justify-between gap-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt="ShopO"
                className="h-[36px] w-auto object-contain"
              />
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-[600px] relative">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[45px] w-full px-4 pr-12 border-2 border-[#3957db] rounded-md outline-none focus:border-[#3321c8] transition-colors text-sm"
              />
              <AiOutlineSearch
                size={22}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-[#3321c8] transition-colors"
              />
              {searchData && searchData.length !== 0 && (
                <div className="absolute top-full left-0 w-full min-h-[30vh] bg-white shadow-lg z-[60] p-4 rounded-b-md border border-gray-100">
                  {searchData.map((i) => (
                    <Link
                      to={`/product/${i._id}`}
                      key={i._id}
                      onClick={() => {
                        setSearchTerm("");
                        setSearchData(null);
                      }}
                    >
                      <div className="w-full flex items-center py-2 hover:bg-gray-50 px-2 rounded transition-colors">
                        <img
                          src={i.images?.[0]?.url || ""}
                          alt=""
                          className="w-[40px] h-[40px] mr-[10px] object-cover rounded"
                        />
                        <h1 className="text-sm font-medium text-gray-700">
                          {i.name}
                        </h1>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Become Seller / Auth */}
            <Link
              to={`${isSeller ? "/dashboard" : isAuthenticated ? "/shop-create" : "/login"}`}
              className="flex-shrink-0"
            >
              <button className="h-[45px] px-6 bg-black text-white rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                {isSeller ? "Go Dashboard" : "Become Seller"}
                <IoIosArrowForward size={18} />
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Bar (Navbar + Categories + Icons) */}
        <div
          className={`w-full bg-[#3321c8] h-[65px] transition-shadow duration-300 ${
            active ? "shadow-md fixed top-0 left-0 z-40" : ""
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-4 xl:px-6 h-full flex items-center justify-between">
            {/* Categories Dropdown */}
            <div className="relative hidden lg:block">
              <div
                className="relative h-[45px] w-[230px] cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              >
                <BiMenuAltLeft
                  size={22}
                  className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-700 pointer-events-none"
                />
                <button className="h-full w-full flex items-center pl-10 pr-9 bg-white text-gray-800 font-medium text-[14px] rounded-md select-none cursor-pointer hover:bg-gray-50 transition-colors">
                  All Categories
                </button>
                <IoIosArrowDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                />
                {dropDown && (
                  <DropDown
                    categoriesData={categoriesData}
                    setDropDown={setDropDown}
                  />
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 flex justify-center">
              <Navbar active={activeHeading} />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-5">
              {/* Wishlist */}
              <div
                className="relative cursor-pointer group"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart
                  size={26}
                  className="text-white/80 group-hover:text-white transition-colors"
                />
                <span className="absolute -right-1.5 -top-1.5 bg-[#3bc177] w-[18px] h-[18px] rounded-full text-white text-[10px] font-semibold flex items-center justify-center">
                  {wishlist?.length || 0}
                </span>
              </div>

              {/* Cart */}
              <div
                className="relative cursor-pointer group"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart
                  size={26}
                  className="text-white/80 group-hover:text-white transition-colors"
                />
                <span className="absolute -right-1.5 -top-1.5 bg-[#3bc177] w-[18px] h-[18px] rounded-full text-white text-[10px] font-semibold flex items-center justify-center">
                  {cart?.length || 0}
                </span>
              </div>

              {/* Profile */}
              <div className="relative cursor-pointer">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={user?.avatar?.url || ""}
                      className="w-[34px] h-[34px] rounded-full object-cover border-2 border-white/30 hover:border-white transition-colors"
                      alt="Profile"
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile
                      size={28}
                      className="text-white/80 hover:text-white transition-colors"
                    />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE / TABLET HEADER ================= */}
      <header
        className={`lg:hidden w-full h-[60px] bg-white flex items-center justify-between px-4 shadow-sm z-50 ${
          active ? "fixed top-0 left-0" : "relative"
        }`}
      >
        {/* Hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="p-1 -ml-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <BiMenuAltLeft size={32} className="text-gray-800" />
        </button>

        {/* Centered Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img
            src="https://shopo.quomodothemes.website/assets/images/logo.svg"
            alt="ShopO"
            className="h-[30px] w-auto object-contain"
          />
        </Link>

        {/* Cart */}
        <div
          className="relative cursor-pointer"
          onClick={() => setOpenCart(true)}
        >
          <AiOutlineShoppingCart size={28} className="text-gray-800" />
          <span className="absolute -right-1.5 -top-1.5 bg-[#3bc177] w-[18px] h-[18px] rounded-full text-white text-[10px] font-semibold flex items-center justify-center">
            {cart?.length || 0}
          </span>
        </div>
      </header>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* ================= MOBILE MENU PANEL ================= */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-[80%] max-w-[320px] bg-white z-[80] shadow-xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close + Wishlist Header */}
          <div className="flex items-center justify-between px-4 h-[60px] border-b border-gray-100">
            <div
              className="relative cursor-pointer"
              onClick={() => {
                setOpenWishlist(true);
                setOpen(false);
              }}
            >
              <AiOutlineHeart size={26} className="text-gray-700" />
              <span className="absolute -right-1.5 -top-1.5 bg-[#3bc177] w-[18px] h-[18px] rounded-full text-white text-[10px] font-semibold flex items-center justify-center">
                {wishlist?.length || 0}
              </span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <RxCross1 size={24} className="text-gray-700" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {/* Search */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search Product..."
                className="h-[44px] w-full px-4 pr-10 border-2 border-[#3957db] rounded-md outline-none focus:border-[#3321c8] transition-colors text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <AiOutlineSearch
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              {searchData && searchData.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg z-10 p-3 rounded-b-md border border-gray-100 mt-1 max-h-[40vh] overflow-y-auto">
                  {searchData.map((i) => (
                    <Link
                      to={`/product/${i._id}`}
                      key={i._id}
                      onClick={() => {
                        setSearchTerm("");
                        setSearchData(null);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center py-2 hover:bg-gray-50 px-2 rounded transition-colors">
                        <img
                          src={i.images?.[0]?.url || ""}
                          alt=""
                          className="w-[45px] h-[45px] mr-3 object-cover rounded"
                        />
                        <h5 className="text-sm text-gray-700 font-medium line-clamp-2">
                          {i.name}
                        </h5>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Nav Links */}
            <Navbar active={activeHeading} isMobile={true} />

            {/* Become Seller */}
            <Link to={`${isSeller ? "/dashboard" : isAuthenticated ? "/shop-create" : "/login"}`}>
              <button className="w-full h-[48px] bg-black text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                {isSeller ? "Go Dashboard" : "Become Seller"}
                <IoIosArrowForward size={18} />
              </button>
            </Link>
          </div>

          {/* Bottom Auth Section */}
          <div className="px-4 py-5 border-t border-gray-100">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center gap-3"
                onClick={() => setOpen(false)}
              >
                <img
                  src={user?.avatar?.url || ""}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full object-cover border-[3px] border-[#0eae88]"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user?.name || "My Account"}
                  </p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="text-[16px] font-medium text-gray-700 hover:text-[#3321c8] transition-colors"
                >
                  Login
                </Link>
                <span className="text-gray-400">/</span>
                <Link
                  to="/sign-up"
                  onClick={() => setOpen(false)}
                  className="text-[16px] font-medium text-gray-700 hover:text-[#3321c8] transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= OVERLAYS ================= */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
