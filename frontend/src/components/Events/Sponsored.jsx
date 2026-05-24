import React from "react";
import styles from "../../styles/styles";

const Sponsored = () => {
  return (
    <div
      className={`${styles.section} hidden sm:block bg-white py-3 px-5 mb-12 rounded-xl`}
    >
      <div className="flex flex-wrap justify-between items-center w-full gap-6">

        <div className="w-[220px] h-[120px] bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center hover:shadow-md hover:border-gray-200 transition-all duration-300">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
            alt="Amazon"
            className="max-w-[70%] max-h-[70%] object-contain"
          />
        </div>

        <div className="w-[220px] h-[120px] bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center hover:shadow-md hover:border-gray-200 transition-all duration-300">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
            alt="Google"
            className="max-w-[70%] max-h-[70%] object-contain"
          />
        </div>

        <div className="w-[220px] h-[120px] bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center hover:shadow-md hover:border-gray-200 transition-all duration-300">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
            alt="Netflix"
            className="max-w-[70%] max-h-[70%] object-contain"
          />
        </div>

        <div className="w-[220px] h-[120px] bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center hover:shadow-md hover:border-gray-200 transition-all duration-300">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="Apple"
            className="max-w-[70%] max-h-[70%] object-contain"
          />
        </div>

      </div>
    </div>
  );
};

export default Sponsored;