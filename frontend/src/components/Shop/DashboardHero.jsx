import React, { useEffect } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineDollarCircle,
  AiOutlineShoppingCart,
  AiOutlinePlus,
} from "react-icons/ai";
import { FiPackage, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { BiWallet } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { shopProducts, isLoading: productsLoading } = useSelector((state) => state.products);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const isLoading = ordersLoading || productsLoading;
  const safeOrders = orders || [];
  const safeProducts = shopProducts || [];

  // Compute KPIs
  const deliveredOrders = safeOrders.filter((o) => o?.status === "Delivered");
  const totalRevenue = deliveredOrders.reduce((sum, o) => sum + (o?.totalPrice || 0), 0);
  const availableBalance = (seller?.availableBalance ?? 0).toFixed(2);

  // Latest 5 orders (sorted by createdAt desc)
  const latestOrders = [...safeOrders]
    .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0))
    .slice(0, 5);

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // Today's date
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Status badge styles
  const getStatusStyle = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered") return { bg: "#ecfdf5", color: "#059669", label: status };
    if (s.includes("refund")) return { bg: "#fef2f2", color: "#dc2626", label: status };
    if (s.includes("shipping") || s.includes("way") || s.includes("transfer"))
      return { bg: "#eff6ff", color: "#2563eb", label: status };
    return { bg: "#fffbeb", color: "#d97706", label: status || "Unknown" };
  };

  // Truncate order ID
  const truncateId = (id) => {
    if (!id) return "—";
    return id.length > 10 ? `#${id.slice(-8).toUpperCase()}` : `#${id.toUpperCase()}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .dash-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 0;
        }

        /* Greeting */
        .dash-greeting {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .dash-greeting-left h1 {
          font-size: 26px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px;
        }
        .dash-greeting-left p {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
          font-weight: 400;
        }
        .dash-greeting-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e5e7eb;
        }

        /* KPI Grid */
        .dash-kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }
        @media (max-width: 1024px) {
          .dash-kpi-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .dash-kpi-grid { grid-template-columns: 1fr; }
        }

        .dash-kpi-card {
          border-radius: 16px;
          padding: 24px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .dash-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
        .dash-kpi-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .dash-kpi-value {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 4px;
          letter-spacing: -0.5px;
        }
        .dash-kpi-label {
          font-size: 13px;
          font-weight: 500;
          margin: 0 0 2px;
          opacity: 0.8;
        }
        .dash-kpi-sub {
          font-size: 11px;
          opacity: 0.6;
          margin: 0;
        }
        .dash-kpi-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 14px;
          text-decoration: none;
          opacity: 0.75;
          transition: opacity 0.15s;
        }
        .dash-kpi-link:hover { opacity: 1; }

        /* Card Themes */
        .kpi-green {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          box-shadow: 0 4px 20px rgba(16,185,129,0.1);
        }
        .kpi-green .dash-kpi-icon { background: rgba(16,185,129,0.15); }
        .kpi-green .dash-kpi-value, .kpi-green .dash-kpi-label { color: #065f46; }
        .kpi-green .dash-kpi-link { color: #059669; }

        .kpi-blue {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          box-shadow: 0 4px 20px rgba(59,130,246,0.1);
        }
        .kpi-blue .dash-kpi-icon { background: rgba(59,130,246,0.15); }
        .kpi-blue .dash-kpi-value, .kpi-blue .dash-kpi-label { color: #1e3a5f; }
        .kpi-blue .dash-kpi-link { color: #2563eb; }

        .kpi-violet {
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          box-shadow: 0 4px 20px rgba(139,92,246,0.1);
        }
        .kpi-violet .dash-kpi-icon { background: rgba(139,92,246,0.15); }
        .kpi-violet .dash-kpi-value, .kpi-violet .dash-kpi-label { color: #3b0764; }
        .kpi-violet .dash-kpi-link { color: #7c3aed; }

        .kpi-amber {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          box-shadow: 0 4px 20px rgba(245,158,11,0.1);
        }
        .kpi-amber .dash-kpi-icon { background: rgba(245,158,11,0.15); }
        .kpi-amber .dash-kpi-value, .kpi-amber .dash-kpi-label { color: #78350f; }
        .kpi-amber .dash-kpi-link { color: #d97706; }

        /* Table Section */
        .dash-section-title {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 16px;
        }
        .dash-table-wrap {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
          overflow: hidden;
          margin-bottom: 28px;
        }
        .dash-table {
          width: 100%;
          border-collapse: collapse;
        }
        .dash-table thead {
          background: #f9fafb;
          border-bottom: 1px solid #f3f4f6;
        }
        .dash-table th {
          padding: 14px 20px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
          white-space: nowrap;
        }
        .dash-table td {
          padding: 16px 20px;
          font-size: 14px;
          color: #374151;
          border-bottom: 1px solid #f9fafb;
        }
        .dash-table tbody tr {
          transition: background 0.15s;
        }
        .dash-table tbody tr:hover {
          background: #f9fafb;
        }
        .dash-table tbody tr:last-child td {
          border-bottom: none;
        }
        .dash-order-id {
          font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
          font-size: 13px;
          font-weight: 600;
          color: #4b5563;
        }
        .dash-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }
        .dash-action-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.15s;
          cursor: pointer;
          text-decoration: none;
        }
        .dash-action-btn:hover {
          background: #f3f4f6;
          color: #111827;
          border-color: #d1d5db;
        }

        /* Empty state */
        .dash-empty {
          padding: 48px 20px;
          text-align: center;
        }
        .dash-empty p {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }
        .dash-empty-icon {
          font-size: 36px;
          margin-bottom: 12px;
          opacity: 0.3;
        }

        /* Quick Actions */
        .dash-actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .dash-actions-grid { grid-template-columns: 1fr; }
        }
        .dash-action-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 2px 10px rgba(0,0,0,0.03);
          border: 1px solid #f3f4f6;
          text-decoration: none;
          transition: all 0.2s;
        }
        .dash-action-card:hover {
          border-color: #e0e0e0;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }
        .dash-action-card-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dash-action-card-text {
          flex: 1;
        }
        .dash-action-card-text h4 {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 2px;
        }
        .dash-action-card-text p {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }
        .dash-action-card-arrow {
          color: #d1d5db;
          transition: color 0.15s, transform 0.15s;
        }
        .dash-action-card:hover .dash-action-card-arrow {
          color: #6b7280;
          transform: translateX(2px);
        }

        /* Skeleton */
        .dash-skeleton {
          border-radius: 8px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .dash-skeleton-card {
          border-radius: 16px;
          height: 160px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        .dash-skeleton-row {
          height: 56px;
          border-radius: 6px;
          margin: 8px 20px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        /* Responsive table */
        @media (max-width: 768px) {
          .dash-table th:nth-child(5),
          .dash-table td:nth-child(5) {
            display: none;
          }
        }
        @media (max-width: 640px) {
          .dash-table th:nth-child(3),
          .dash-table td:nth-child(3),
          .dash-table th:nth-child(4),
          .dash-table td:nth-child(4) {
            display: none;
          }
        }
      `}</style>

      <div className="dash-root">
        {/* Greeting */}
        <div className="dash-greeting">
          <div className="dash-greeting-left">
            <h1>Welcome back, {seller?.name || "Seller"}</h1>
            <p>{today}</p>
          </div>
        </div>

        {/* KPI Cards */}
        {isLoading && !safeOrders.length && !safeProducts.length ? (
          <div className="dash-kpi-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="dash-skeleton-card" />
            ))}
          </div>
        ) : (
          <div className="dash-kpi-grid">
            {/* Revenue */}
            <div className="dash-kpi-card kpi-green">
              <div className="dash-kpi-icon">
                <AiOutlineDollarCircle size={22} color="#059669" />
              </div>
              <p className="dash-kpi-label">Total Revenue</p>
              <p className="dash-kpi-value">${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="dash-kpi-sub">From {deliveredOrders.length} delivered order{deliveredOrders.length !== 1 ? "s" : ""}</p>
            </div>

            {/* Orders */}
            <div className="dash-kpi-card kpi-blue">
              <div className="dash-kpi-icon">
                <FiShoppingBag size={20} color="#2563eb" />
              </div>
              <p className="dash-kpi-label">All Orders</p>
              <p className="dash-kpi-value">{safeOrders.length}</p>
              <Link to="/dashboard-orders" className="dash-kpi-link">
                View all <FiArrowRight size={12} />
              </Link>
            </div>

            {/* Products */}
            <div className="dash-kpi-card kpi-violet">
              <div className="dash-kpi-icon">
                <FiPackage size={20} color="#7c3aed" />
              </div>
              <p className="dash-kpi-label">All Products</p>
              <p className="dash-kpi-value">{safeProducts.length}</p>
              <Link to="/dashboard-products" className="dash-kpi-link">
                View all <FiArrowRight size={12} />
              </Link>
            </div>

            {/* Balance */}
            <div className="dash-kpi-card kpi-amber">
              <div className="dash-kpi-icon">
                <BiWallet size={20} color="#d97706" />
              </div>
              <p className="dash-kpi-label">Account Balance</p>
              <p className="dash-kpi-value">${availableBalance}</p>
              <p className="dash-kpi-sub">After 10% service charge</p>
              <Link to="/dashboard-withdraw-money" className="dash-kpi-link">
                Withdraw <FiArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <h3 className="dash-section-title">Recent Orders</h3>
        <div className="dash-table-wrap">
          {isLoading && !safeOrders.length ? (
            <div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="dash-skeleton-row" />
              ))}
            </div>
          ) : latestOrders.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon">📦</div>
              <p>No orders yet. They'll appear here once customers start ordering.</p>
            </div>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {latestOrders.map((order) => {
                  const statusStyle = getStatusStyle(order?.status);
                  const itemsQty = (order?.cart || []).reduce((acc, item) => acc + (item?.qty || 0), 0);
                  return (
                    <tr key={order?._id || Math.random()}>
                      <td>
                        <span className="dash-order-id">{truncateId(order?._id)}</span>
                      </td>
                      <td>
                        <span
                          className="dash-badge"
                          style={{ background: statusStyle.bg, color: statusStyle.color }}
                        >
                          {statusStyle.label}
                        </span>
                      </td>
                      <td>{itemsQty}</td>
                      <td style={{ fontWeight: 600 }}>
                        ${(order?.totalPrice || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ color: "#9ca3af", fontSize: 13 }}>{formatDate(order?.createdAt)}</td>
                      <td>
                        <Link to={`/dashboard/order/${order?._id}`} className="dash-action-btn">
                          <AiOutlineArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <h3 className="dash-section-title">Quick Actions</h3>
        <div className="dash-actions-grid">
          <Link to="/dashboard-create-product" className="dash-action-card">
            <div className="dash-action-card-icon" style={{ background: "#f0fdf4" }}>
              <AiOutlinePlus size={20} color="#16a34a" />
            </div>
            <div className="dash-action-card-text">
              <h4>Create Product</h4>
              <p>Add a new product to your shop</p>
            </div>
            <FiArrowRight size={16} className="dash-action-card-arrow" />
          </Link>

          <Link to="/dashboard-orders" className="dash-action-card">
            <div className="dash-action-card-icon" style={{ background: "#eff6ff" }}>
              <AiOutlineShoppingCart size={20} color="#2563eb" />
            </div>
            <div className="dash-action-card-text">
              <h4>View All Orders</h4>
              <p>Manage and track your orders</p>
            </div>
            <FiArrowRight size={16} className="dash-action-card-arrow" />
          </Link>

          <Link to="/dashboard-withdraw-money" className="dash-action-card">
            <div className="dash-action-card-icon" style={{ background: "#fffbeb" }}>
              <BiWallet size={20} color="#d97706" />
            </div>
            <div className="dash-action-card-text">
              <h4>Withdraw Money</h4>
              <p>Transfer balance to your account</p>
            </div>
            <FiArrowRight size={16} className="dash-action-card-arrow" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default DashboardHero;