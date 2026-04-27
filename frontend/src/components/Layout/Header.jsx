import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData, productData } from "../../static/data";
import { AiOutlineSearch } from "react-icons/ai";
import { IoArrowForward, IoChevronDown } from "react-icons/io"; // fixed
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from "./DropDown";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);

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
    <>
      <div className={styles.section}>
        <div className="hidden md:flex items-center justify-between py-4">

          <Link to="/">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrG..."
              alt="logo"
              className="h-[64px] rounded-full"
            />
          </Link>

          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-2 border-[#3957db] rounded-md outline-none"
            />

            <AiOutlineSearch
              size={28}
              className="absolute right-2 top-2 cursor-pointer text-gray-600"
            />

            {searchData.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg z-10 max-h-[300px] overflow-y-auto rounded-md">
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

          <div className={`${styles.button}`}>
            <Link to="/seller">
              <h1 className="text-[#fff] flex items-center gap-2">
                Become Seller <IoArrowForward />
              </h1>
            </Link>
          </div>

          <div
            className={`${
              active === true ? "shadow-sm fixed top-0 left-0 z-10" : ""
            } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}
          ></div>

          <div
            className={`${styles.section} relative ${styles.normalFlex} justify-between`}
          >
            <div>
              <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">

                <BiMenuAltLeft
                  size={30}
                  className="absolute right-2 top-3 cursor-pointer text-gray-600 left-2"
                />

                {/* fixed className */}
                <button
                  className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
                >
                  All Categories
                </button>

                {/* fixed icon */}
                <IoChevronDown
                  size={20}
                  className="absolute right-2 top-3 cursor-pointer text-gray-600"
                  onClick={() => setDropDown(!dropDown)}
                />

                {/* fixed conditional */}
                {dropDown ? (
                  <DropDown
                    categoriesData={categoriesData}
                    setDropDown={setDropDown}
                  />
                ) : null}

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Header;