import React from "react";
import styles from "../../styles/styles";

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-3 px-5 mb-12 rounded-xl`}
    >
      <div className="flex flex-wrap justify-between items-center w-full gap-4">
        
        <img
          src="https://images.seeklogo.com/logo-png/12/2/sony-glass-logo-png_seeklogo-129446.png"
          alt="Sony"
          className="w-[120px] object-contain"
        />

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
          alt="Amazon"
          className="w-[120px] object-contain"
        />

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
          alt="Google"
          className="w-[120px] object-contain"
        />

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix"
          className="w-[120px] object-contain"
        />

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
          alt="Apple"
          className="w-[120px] object-contain"
        />

      </div>
    </div>
  );
};

export default Sponsored;