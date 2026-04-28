import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles"; // make sure path is correct

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat bg-cover ${styles.normalFlex}`}
      style={{
        backgroundImage: "url('/path/to/your/image.jpg')",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1 className="text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize">
          Best Collection for <br /> Home Decoration
        </h1>

        <p className="pt-5 text-[16px] font-[Poppins] font-[300] text-[#00000b]">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni et ut
          suscipit molestias explicabo cumque optio cum soluta, laboriosam ab
          neque id perferendis sint error aspernatur. Nihil eius rerum dolores
          corporis esse ex alias, minima nemo tempora aliquid sint vero.
        </p>

        <Link
          to="/products"
          className="inline-block bg-[#000] text-white font-[Poppins] font-[500] text-[16px] py-3 mt-5 px-6 rounded-md hover:bg-[#2a9d6a] transition duration-300"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Hero;