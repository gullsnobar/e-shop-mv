import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login.jsx";
import SignupPage from "./pages/Signup.jsx";
import { ActivationPage, HomePage, ProductsPage, EventsPage, BestSellingPage, FAQPage, ProductDetailsPage, ProfilePage, CheckoutPage, PaymentPage, OrderPage, ShopCreatePage, ShopLoginPage, ShopHomePage, SellerActivationPage } from "./Routes.js";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "./redux/actions/products";
import { loadUser } from "./redux/actions/user";
import ProtectedRoute from "./routes/ProtectedRoute.jsx"
import SellerProtectedRoute from "./routes/SellerProtectedRoute.jsx"
import { useSelector } from "react-redux";
import ShopDashboardPage from "./pages/Shop/ShopDashboardPage.jsx";
import ShopPreviewPage from "./pages/Shop/ShopPreviewPage.jsx";
import InboxPage from "./pages/InboxPage.jsx";
import ShopAllOrders from "./pages/Shop/ShopAllOrders.jsx";
import ShopAllProducts from "./pages/Shop/ShopAllProducts.jsx";
import ShopCreateProduct from "./pages/Shop/ShopCreateProduct.jsx";
import ShopAllEvents from "./pages/Shop/ShopAllEvents.jsx";
import ShopCreateEvents from "./pages/Shop/ShopCreateEvents.jsx";
import ShopWithDrawMoneyPage from "./pages/Shop/ShopWithDrawMoneyPage.jsx";
import ShopInboxPage from "./pages/Shop/ShopInboxPage.jsx";
import ShopAllCoupouns from "./pages/Shop/ShopAllCoupouns.jsx";
import ShopAllRefunds from "./pages/Shop/ShopAllRefunds.jsx";
import ShopSettingsPage from "./pages/Shop/ShopSettingsPage.jsx";
import ShopOrderDetails from "./pages/Shop/ShopOrderDetails.jsx";
const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      dispatch(loadUser());
    }
  }, [dispatch]);

  return (
    <div className="overflow-x-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/activation/:activation_token" element={<ActivationPage />} />
          <Route path="/products" element={<ProductsPage />} />
           <Route path="/products/:name" element={<ProductDetailsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/profile" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/order/success/:id" element={<OrderPage />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />
          <Route path="/shop-create" element={<ShopCreatePage />} />
          <Route path="/seller/activation/:activation_token" element={<SellerActivationPage />} />

           <Route path="/shop/:id" element={
            <SellerProtectedRoute isSeller={true}>
              <ShopHomePage />
            </SellerProtectedRoute>
           } />
           <Route path="/dashboard" element={
            <SellerProtectedRoute>
              <ShopDashboardPage />
            </SellerProtectedRoute>
           } />
           <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
           <Route path="/inbox" element={<InboxPage />} />
           <Route path="/dashboard-orders" element={
            <SellerProtectedRoute>
              <ShopAllOrders />
            </SellerProtectedRoute>
           } />
           <Route path="/dashboard-products" element={
            <SellerProtectedRoute>
              <ShopAllProducts />
            </SellerProtectedRoute>
           } />
           <Route path="/dashboard-create-product" element={
            <SellerProtectedRoute>
              <ShopCreateProduct />
            </SellerProtectedRoute>
           } />
           <Route path="/dashboard-events" element={
            <SellerProtectedRoute>
              <ShopAllEvents />
            </SellerProtectedRoute>
           } />
           <Route path="/dashboard-create-event" element={
            <SellerProtectedRoute>
              <ShopCreateEvents />
            </SellerProtectedRoute>
           } />
           <Route path="/dashboard-withdraw-money" element={
            <SellerProtectedRoute>
              <ShopWithDrawMoneyPage />
            </SellerProtectedRoute>
           } />
           <Route path="/dashboard-messages" element={
            <SellerProtectedRoute>
              <ShopInboxPage />
            </SellerProtectedRoute>
           } />
           <Route path="/dashboard-coupouns" element={
            <SellerProtectedRoute>
              <ShopAllCoupouns />
            </SellerProtectedRoute>
           } />
           <Route path="/dashboard-refunds" element={
            <SellerProtectedRoute>
              <ShopAllRefunds />
            </SellerProtectedRoute>
           } />
           <Route path="/settings" element={
            <SellerProtectedRoute>
              <ShopSettingsPage />
            </SellerProtectedRoute>
           } />
           <Route path="/dashboard/order/:id" element={
            <SellerProtectedRoute>
              <ShopOrderDetails />
            </SellerProtectedRoute>
           } />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;