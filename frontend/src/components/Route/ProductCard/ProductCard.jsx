import React, { useState } from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { useEffect } from "react";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  // Normalize field names (backend uses camelCase, static data uses snake_case)
  const product = data || {};
  const discountPrice = product.discountPrice ?? product.discount_price ?? 0;
  const originalPrice = product.originalPrice ?? product.price ?? 0;
  const soldOut = product.sold_out ?? product.total_sell ?? 0;
  const ratings = product.ratings ?? product.rating ?? 0;
  const imageUrl = product.images?.[0]?.url ?? "";
  const shopId = product.shop?._id || product.shop?.id || product.id || "#";
  const shopName = product.shop?.name || "Unknown Shop";
  const productName = product.name || "Unnamed Product";
  const productId = product._id || product.id || "";

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === productId)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, productId]);

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
      if ((product.stock ?? 0) < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...product, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        <Link to={`${isEvent === true ? `/product/${productId}?isEvent=true` : `/product/${productId}`}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-[170px] object-contain"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<div class="w-full h-[170px] flex items-center justify-center bg-gray-50 text-gray-400 text-sm rounded-md">No Image</div>`;
              }}
            />
          ) : (
            <div className="w-full h-[170px] flex items-center justify-center bg-gray-50 text-gray-400 text-sm rounded-md">
              No Image
            </div>
          )}
        </Link>
        <Link to={`/shop/preview/${shopId}`}>
          <h5 className={`${styles.shop_name}`}>{shopName}</h5>
        </Link>
        <Link to={`${isEvent === true ? `/product/${productId}?isEvent=true` : `/product/${productId}`}`}>
          <h4 className="pb-3 font-[500]">
            {productName.length > 40 ? productName.slice(0, 40) + "..." : productName}
          </h4>

          <div className="flex">
            <Ratings rating={ratings} />
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                {originalPrice === 0 ? originalPrice : discountPrice}$
              </h5>
              <h4 className={`${styles.price}`}>
                {originalPrice > 0 ? originalPrice + " $" : null}
              </h4>
            </div>
            <span className="font-[400] text-[17px] text-[#68d284]">
              {soldOut} sold
            </span>
          </div>
        </Link>

        {/* side options */}
        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Add to wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color="#333"
            title="Quick view"
          />
          <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => addToCartHandler(productId)}
            color="#444"
            title="Add to cart"
          />
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </div>
    </>
  );
};

export default ProductCard;