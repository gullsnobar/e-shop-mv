import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { productData } from "../../static/data";
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);

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
      <div className="hidden 800px:flex items-center justify-between h-[50px] my-[20px]">
        
        {/* Logo */}
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="h-[40px]" />
        </Link>

        {/* Search Bar */}
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

          {/* Results */}
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

      </div>
    </div>
  );
};

export default Header;