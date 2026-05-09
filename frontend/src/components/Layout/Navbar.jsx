import React from "react";
import { Link } from "react-router-dom";
import { navItems } from "../../static/data";

const Navbar = ({ active, isMobile = false }) => {
  return (
    <nav
      className={
        isMobile
          ? "flex flex-col gap-1"
          : "flex items-center gap-1"
      }
    >
      {navItems &&
        navItems.map((item, index) => {
          const isActive = active === index + 1;
          const baseClasses = isMobile
            ? "block px-4 py-3 rounded-md text-[15px] font-medium transition-colors duration-200"
            : "px-5 py-2 text-[15px] font-medium rounded-md transition-colors duration-200";

          const activeClasses = isMobile
            ? isActive
              ? "text-[#3321c8] bg-[#3321c8]/10"
              : "text-gray-700 hover:bg-gray-50 hover:text-[#3321c8]"
            : isActive
            ? "text-[#17dd1f]"
            : "text-white/80 hover:text-white";

          return (
            <Link
              key={item.title}
              to={item.url}
              className={`${baseClasses} ${activeClasses}`}
            >
              {item.title}
            </Link>
          );
        })}
    </nav>
  );
};

export default Navbar;
