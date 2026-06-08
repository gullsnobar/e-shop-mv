import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import { FiMapPin, FiPhone, FiHash, FiEdit3, FiSave } from "react-icons/fi";
import { BiStore } from "react-icons/bi";
import { MdOutlineDescription } from "react-icons/md";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");
  const [updating, setUpdating] = useState(false);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            { withCredentials: true }
          )
          .then(() => {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || "Failed to update avatar");
          });
      }
    };
    reader.readAsDataURL(file);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await axios.put(
        `${server}/shop/update-seller-info`,
        { name, address, zipCode, phoneNumber, description },
        { withCredentials: true }
      );
      toast.success("Shop info updated successfully!");
      dispatch(loadSeller());
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update shop info");
    } finally {
      setUpdating(false);
    }
  };

  const avatarUrl = avatar || seller?.avatar?.url || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .settings-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: 720px;
          margin: 0 auto;
        }

        .settings-header {
          margin-bottom: 32px;
        }
        .settings-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px;
        }
        .settings-header p {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }

        /* Avatar Section */
        .settings-avatar-section {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 28px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          border: 1px solid #f3f4f6;
          margin-bottom: 24px;
        }
        .settings-avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .settings-avatar-img {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e5e7eb;
          transition: border-color 0.2s;
        }
        .settings-avatar-img:hover {
          border-color: #c7d2fe;
        }
        .settings-avatar-btn {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #4f46e5;
          color: #fff;
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
        }
        .settings-avatar-btn:hover {
          background: #4338ca;
          transform: scale(1.1);
        }
        .settings-avatar-info h3 {
          font-size: 17px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px;
        }
        .settings-avatar-info p {
          font-size: 13px;
          color: #9ca3af;
          margin: 0 0 2px;
        }
        .settings-avatar-info small {
          font-size: 11px;
          color: #d1d5db;
        }

        /* Form Card */
        .settings-form-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          border: 1px solid #f3f4f6;
          padding: 28px;
        }
        .settings-form-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .settings-form-title svg {
          color: #6366f1;
        }

        /* Form Grid */
        .settings-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        @media (max-width: 640px) {
          .settings-form-grid {
            grid-template-columns: 1fr;
          }
        }
        .settings-field-full {
          grid-column: 1 / -1;
        }

        /* Field */
        .settings-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .settings-input-wrap {
          position: relative;
        }
        .settings-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .settings-input {
          width: 100%;
          height: 46px;
          padding: 0 14px 0 42px;
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
        .settings-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: #fff;
        }
        .settings-input::placeholder {
          color: #d1d5db;
        }
        .settings-textarea {
          width: 100%;
          min-height: 90px;
          padding: 12px 14px 12px 42px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Inter', sans-serif;
          color: #111827;
          background: #fafafa;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
          resize: vertical;
          box-sizing: border-box;
        }
        .settings-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: #fff;
        }

        /* Submit Button */
        .settings-submit-wrap {
          margin-top: 28px;
          display: flex;
          justify-content: flex-end;
        }
        .settings-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 32px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          box-shadow: 0 2px 8px rgba(79,70,229,0.3);
        }
        .settings-submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(79,70,229,0.4);
        }
        .settings-submit-btn:active {
          transform: translateY(0);
        }
        .settings-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        /* Spinner */
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .settings-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
      `}</style>

      <div className="settings-root">
        {/* Header */}
        <div className="settings-header">
          <h1>Shop Settings</h1>
          <p>Manage your shop profile and information</p>
        </div>

        {/* Avatar Section */}
        <div className="settings-avatar-section">
          <div className="settings-avatar-wrap">
            <img
              src={avatarUrl}
              onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; }}
              alt="Shop avatar"
              className="settings-avatar-img"
            />
            <input type="file" id="shop-avatar-input" className="hidden" accept="image/*" onChange={handleImage} />
            <label htmlFor="shop-avatar-input" className="settings-avatar-btn" title="Change photo">
              <AiOutlineCamera size={14} />
            </label>
          </div>
          <div className="settings-avatar-info">
            <h3>{seller?.name || "Your Shop"}</h3>
            <p>{seller?.email || ""}</p>
            <small>Click the camera icon to change your shop logo</small>
          </div>
        </div>

        {/* Form Card */}
        <div className="settings-form-card">
          <h3 className="settings-form-title">
            <FiEdit3 size={17} />
            Shop Information
          </h3>

          <form onSubmit={updateHandler}>
            <div className="settings-form-grid">
              {/* Shop Name */}
              <div className="settings-field">
                <label>Shop Name</label>
                <div className="settings-input-wrap">
                  <span className="settings-input-icon"><BiStore size={16} /></span>
                  <input
                    type="text"
                    className="settings-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter shop name"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="settings-field">
                <label>Phone Number</label>
                <div className="settings-input-wrap">
                  <span className="settings-input-icon"><FiPhone size={15} /></span>
                  <input
                    type="tel"
                    className="settings-input"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="settings-field">
                <label>Address</label>
                <div className="settings-input-wrap">
                  <span className="settings-input-icon"><FiMapPin size={15} /></span>
                  <input
                    type="text"
                    className="settings-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter shop address"
                    required
                  />
                </div>
              </div>

              {/* Zip Code */}
              <div className="settings-field">
                <label>Zip Code</label>
                <div className="settings-input-wrap">
                  <span className="settings-input-icon"><FiHash size={15} /></span>
                  <input
                    type="text"
                    className="settings-input"
                    value={zipCode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="Enter zip code"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="settings-field settings-field-full">
                <label>Shop Description</label>
                <div className="settings-input-wrap">
                  <span className="settings-input-icon" style={{ top: "20px", transform: "none" }}>
                    <MdOutlineDescription size={16} />
                  </span>
                  <textarea
                    className="settings-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell customers about your shop..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="settings-submit-wrap">
              <button
                type="submit"
                className="settings-submit-btn"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span className="settings-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ShopSettings;