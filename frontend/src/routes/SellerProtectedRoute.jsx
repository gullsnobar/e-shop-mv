import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Layout/Loader";

const SellerProtectedRoute = ({ children }) => {
  const { loading, isSeller } = useSelector((state) => state.seller);
  if (loading === true) {
    return <Loader />;
  } else {
    if (!isSeller) {
      return <Navigate to={`/shop-login`} replace />;
    }
    return children;
  }
};

export default SellerProtectedRoute;