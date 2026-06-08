import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAllProductsShop } from "../../redux/actions/product";

const AllCoupons = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedProducts, setSelectedProducts] = useState("");
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { seller } = useSelector((state) => state.seller);
  const { shopProducts } = useSelector((state) => state.products);

  const dispatch = useDispatch();

  const fetchCoupons = () => {
    if (!seller?._id) return;
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        setCoupons(res.data?.couponCodes || []);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCoupons();
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [seller?._id, dispatch]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/coupon/delete-coupon/${id}`, {
        withCredentials: true,
      });
      toast.success("Coupon code deleted successfully!");
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete coupon");
    }
  };

  const resetForm = () => {
    setName("");
    setValue("");
    setMinAmount("");
    setMaxAmount("");
    setSelectedProducts("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !value) {
      toast.error("Please fill all required fields!");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount: minAmount ? Number(minAmount) : undefined,
          maxAmount: maxAmount ? Number(maxAmount) : undefined,
          selectedProducts: selectedProducts || undefined,
          value: Number(value),
          shopId: seller?._id,
        },
        { withCredentials: true }
      );
      toast.success("Coupon code created successfully!");
      setOpen(false);
      resetForm();
      fetchCoupons();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .cp-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .cp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .cp-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .cp-header p {
          font-size: 14px;
          color: #9ca3af;
          margin: 4px 0 0;
        }
        .cp-create-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(79,70,229,0.3);
          flex-shrink: 0;
        }
        .cp-create-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(79,70,229,0.4);
        }

        /* Table Card */
        .cp-table-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          border: 1px solid #f3f4f6;
          overflow: hidden;
        }
        .cp-table {
          width: 100%;
          border-collapse: collapse;
        }
        .cp-table thead {
          background: #f9fafb;
          border-bottom: 1px solid #f3f4f6;
        }
        .cp-table th {
          padding: 14px 20px;
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
          white-space: nowrap;
        }
        .cp-table td {
          padding: 16px 20px;
          font-size: 14px;
          color: #374151;
          border-bottom: 1px solid #f9fafb;
        }
        .cp-table tbody tr { transition: background 0.15s; }
        .cp-table tbody tr:hover { background: #f9fafb; }
        .cp-table tbody tr:last-child td { border-bottom: none; }
        .cp-code {
          font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
          font-size: 13px;
          font-weight: 600;
          color: #4f46e5;
          background: #eef2ff;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .cp-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          background: #ecfdf5;
          color: #059669;
        }
        .cp-del-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #fecaca;
          background: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ef4444;
          cursor: pointer;
          transition: all 0.15s;
        }
        .cp-del-btn:hover { background: #fef2f2; border-color: #ef4444; }

        /* Empty State */
        .cp-empty {
          padding: 48px 20px;
          text-align: center;
        }
        .cp-empty-icon { font-size: 36px; margin-bottom: 12px; opacity: 0.3; }
        .cp-empty p { font-size: 14px; color: #9ca3af; margin: 0; }

        /* Modal */
        .cp-modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          z-index: 20000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .cp-modal {
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          padding: 28px;
        }
        .cp-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .cp-modal-header h2 {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }
        .cp-modal-close {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.15s;
        }
        .cp-modal-close:hover { background: #f3f4f6; color: #111827; }
        .cp-field { margin-bottom: 18px; }
        .cp-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .cp-field label .req { color: #ef4444; margin-left: 2px; }
        .cp-input, .cp-select {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #111827;
          background: #fafafa;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .cp-input:focus, .cp-select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: #fff;
        }
        .cp-input::placeholder { color: #d1d5db; }
        .cp-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cp-submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 2px 8px rgba(79,70,229,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 6px;
        }
        .cp-submit-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(79,70,229,0.4); }
        .cp-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .cp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* Skeleton */
        .cp-skeleton-row {
          height: 52px; border-radius: 6px; margin: 8px 20px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @media (max-width: 640px) {
          .cp-table th:nth-child(1), .cp-table td:nth-child(1) { display: none; }
          .cp-grid2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cp-root">
        {/* Header */}
        <div className="cp-header">
          <div>
            <h1>Coupon Codes</h1>
            <p>Manage your discount coupons</p>
          </div>
          <button className="cp-create-btn" onClick={() => setOpen(true)}>
            <AiOutlinePlus size={16} />
            Create Coupon
          </button>
        </div>

        {/* Table */}
        <div className="cp-table-card">
          {isLoading ? (
            <div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="cp-skeleton-row" />
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="cp-empty">
              <div className="cp-empty-icon">🎟️</div>
              <p>No coupon codes yet. Create one to offer discounts!</p>
            </div>
          ) : (
            <table className="cp-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Min Amount</th>
                  <th>Max Amount</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((item) => (
                  <tr key={item._id}>
                    <td><span className="cp-code">{item.name || "—"}</span></td>
                    <td><span className="cp-badge">{item.value ?? 0}% OFF</span></td>
                    <td>${item.minAmount ?? "—"}</td>
                    <td>${item.maxAmount ?? "—"}</td>
                    <td>
                      <button className="cp-del-btn" onClick={() => handleDelete(item._id)} title="Delete coupon">
                        <AiOutlineDelete size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Create Modal */}
        {open && (
          <div className="cp-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
            <div className="cp-modal">
              <div className="cp-modal-header">
                <h2>Create Coupon Code</h2>
                <button className="cp-modal-close" onClick={() => setOpen(false)}>
                  <RxCross1 size={14} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="cp-field">
                  <label>Coupon Code <span className="req">*</span></label>
                  <input
                    type="text"
                    className="cp-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. SUMMER20"
                    required
                  />
                </div>

                <div className="cp-field">
                  <label>Discount Percentage <span className="req">*</span></label>
                  <input
                    type="number"
                    className="cp-input"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g. 20"
                    min="1"
                    max="100"
                    required
                  />
                </div>

                <div className="cp-grid2">
                  <div className="cp-field">
                    <label>Min Amount</label>
                    <input
                      type="number"
                      className="cp-input"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                  <div className="cp-field">
                    <label>Max Amount</label>
                    <input
                      type="number"
                      className="cp-input"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                </div>

                <div className="cp-field">
                  <label>Selected Product</label>
                  <select
                    className="cp-input"
                    value={selectedProducts}
                    onChange={(e) => setSelectedProducts(e.target.value)}
                  >
                    <option value="">All products</option>
                    {shopProducts?.map((p) => (
                      <option value={p.name} key={p._id || p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="cp-submit-btn" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="cp-spinner" />
                      Creating...
                    </>
                  ) : (
                    "Create Coupon"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllCoupons;