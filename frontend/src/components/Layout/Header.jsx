import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData, productData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoArrowForward, IoChevronDown } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";

const Header = ({ activeHeading }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);

  // Search logic
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setSearchData([]);
      return;
    }

    const filtered = productData.filter((product) =>
      product.name.toLowerCase().includes(term.toLowerCase())
    );

    setSearchData(filtered);
  };

  return (
    <div className={styles.section}>
      {/* Top Header */}
      <div className="hidden md:flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrG..."
            alt="logo"
            className="h-[64px] rounded-full"
          />
        </Link>

        {/* Search */}
        <div className="w-[50%] relative">
          <input
            type="text"
            placeholder="Search Product..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-[40px] w-full px-2 border-2 border-[#3957db] rounded-md outline-none"
          />

          <AiOutlineSearch
            size={24}
            className="absolute right-2 top-2 cursor-pointer text-gray-600"
          />

          {/* Search Results */}
          {searchData.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg z-20 max-h-[300px] overflow-y-auto rounded-md">
              {searchData.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex items-center gap-2 p-2 border-b hover:bg-gray-100"
                >
                  <img
                    src={product.image_Url?.[0]?.url}
                    alt={product.name}
                    className="w-[40px] h-[40px] object-cover rounded"
                  />
                  <span className="text-sm">{product.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Seller Button */}
        <div className={styles.button}>
          <Link to="/seller">
            <h1 className="text-white flex items-center gap-2">
              Become Seller <IoArrowForward />
            </h1>
          </Link>
        </div>
      </div>

      {/* Sticky Navbar */}
      <div
        className={`${
          active ? "shadow-sm fixed top-0 left-0 z-10" : ""
        } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}
      >
        <div className={`${styles.section} flex items-center justify-between`}>
          {/* Categories */}
          <div className="relative h-[60px] w-[270px] hidden 1000px:block">
            <BiMenuAltLeft
              size={28}
              className="absolute left-2 top-3 cursor-pointer text-white"
            />

            <button
              onClick={() => setDropDown(!dropDown)}
              className="h-full w-full flex justify-between items-center pl-10 pr-8 bg-white font-medium rounded-md"
            >
              All Categories
            </button>

            <IoChevronDown
              size={20}
              className="absolute right-2 top-3 cursor-pointer text-gray-600"
              onClick={() => setDropDown(!dropDown)}
            />

            {dropDown && (
              <DropDown
                categoriesData={categoriesData}
                setDropDown={setDropDown}
              />
            )}
          </div>

          {/* Navbar */}
          <Navbar active={activeHeading} />

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <div className="relative cursor-pointer">
              <AiOutlineHeart size={26} className="text-white" />
              <span className="absolute -top-1 -right-1 bg-[#3bc177] text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                0
              </span>
            </div>

            {/* Cart */}
            <div className="relative cursor-pointer">
              <AiOutlineShoppingCart size={26} className="text-white" />
              <span className="absolute -top-1 -right-1 bg-[#3bc177] text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                1
              </span>
            </div>

            {/* Profile */}
            <Link to="/login">
              <CgProfile size={26} className="text-white cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;