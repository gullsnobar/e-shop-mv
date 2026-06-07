import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopLogin from "../components/Shop/ShopLogin";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller, loading } = useSelector((state) => state.seller);

  useEffect(() => {
    if(isSeller === true){
      navigate(`/dashboard`);
    }
  }, [loading, isSeller])
  return (
    <div>
        <ShopLogin />
    </div>
  )
}

export default ShopLoginPage