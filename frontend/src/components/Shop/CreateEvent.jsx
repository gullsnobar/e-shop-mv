import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";
import { clearEventState } from "../../redux/reducers/event";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error, isLoading } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (e) => {
    const date = new Date(e.target.value);
    setStartDate(date);
    setEndDate(null);
  };

  const handleEndDateChange = (e) => {
    const date = new Date(e.target.value);
    setEndDate(date);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : "";

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearEventState());
    }
    if (success) {
      toast.success("Event created successfully!");
      dispatch(clearEventState());
      navigate("/dashboard-events");
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((old) => old.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !description || !category || !discountPrice || !stock || !startDate || !endDate || images.length === 0) {
      toast.error("Please fill all required fields and upload at least one image!");
      return;
    }

    const data = {
      name,
      description,
      category,
      tags,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPrice: Number(discountPrice),
      stock: Number(stock),
      images,
      shopId: seller?._id,
      start_Date: startDate?.toISOString(),
      Finish_Date: endDate?.toISOString(),
    };
    dispatch(createevent(data));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .ce-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: 720px;
          margin: 0 auto;
        }
        .ce-header { margin-bottom: 28px; }
        .ce-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px;
        }
        .ce-header p {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }
        .ce-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          border: 1px solid #f3f4f6;
          padding: 28px;
          margin-bottom: 24px;
        }
        .ce-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 20px;
        }
        .ce-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 640px) { .ce-grid { grid-template-columns: 1fr; } }
        .ce-full { grid-column: 1 / -1; }
        .ce-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .ce-field label .req { color: #ef4444; margin-left: 2px; }
        .ce-input, .ce-select, .ce-textarea {
          width: 100%;
          padding: 12px 14px;
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
        .ce-input:focus, .ce-select:focus, .ce-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: #fff;
        }
        .ce-input::placeholder, .ce-textarea::placeholder { color: #d1d5db; }
        .ce-textarea { min-height: 100px; resize: vertical; }
        .ce-select { appearance: none; cursor: pointer; }

        /* Images */
        .ce-images-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }
        .ce-img-thumb {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 10px;
          overflow: hidden;
          border: 1.5px solid #e5e7eb;
        }
        .ce-img-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .ce-img-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(0,0,0,0.55);
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .ce-img-remove:hover { background: rgba(239,68,68,0.85); }
        .ce-img-add {
          width: 90px;
          height: 90px;
          border-radius: 10px;
          border: 2px dashed #d1d5db;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          background: #fafafa;
          gap: 2px;
        }
        .ce-img-add:hover { border-color: #6366f1; background: #f5f3ff; }
        .ce-img-add span { font-size: 11px; color: #9ca3af; font-weight: 500; }

        /* Submit */
        .ce-submit-wrap { display: flex; justify-content: flex-end; margin-top: 8px; }
        .ce-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 36px;
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
        }
        .ce-submit-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(79,70,229,0.4); }
        .ce-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .ce-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
      `}</style>

      <div className="ce-root">
        <div className="ce-header">
          <h1>Create Event</h1>
          <p>Set up a new event with special pricing and dates</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="ce-card">
            <h3 className="ce-card-title">Basic Information</h3>
            <div className="ce-grid">
              <div className="ce-field ce-full">
                <label>Event Name <span className="req">*</span></label>
                <input
                  type="text"
                  className="ce-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter event name..."
                  required
                />
              </div>
              <div className="ce-field ce-full">
                <label>Description <span className="req">*</span></label>
                <textarea
                  className="ce-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this event..."
                  required
                />
              </div>
              <div className="ce-field">
                <label>Category <span className="req">*</span></label>
                <select
                  className="ce-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Choose a category</option>
                  {categoriesData?.map((i) => (
                    <option value={i.title} key={i.title}>{i.title}</option>
                  ))}
                </select>
              </div>
              <div className="ce-field">
                <label>Tags</label>
                <input
                  type="text"
                  className="ce-input"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. sale, summer, clearance"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="ce-card">
            <h3 className="ce-card-title">Pricing & Stock</h3>
            <div className="ce-grid">
              <div className="ce-field">
                <label>Original Price</label>
                <input
                  type="number"
                  className="ce-input"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <div className="ce-field">
                <label>Discount Price <span className="req">*</span></label>
                <input
                  type="number"
                  className="ce-input"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  required
                />
              </div>
              <div className="ce-field">
                <label>Stock <span className="req">*</span></label>
                <input
                  type="number"
                  className="ce-input"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="ce-card">
            <h3 className="ce-card-title">Event Schedule</h3>
            <div className="ce-grid">
              <div className="ce-field">
                <label>Start Date <span className="req">*</span></label>
                <input
                  type="date"
                  className="ce-input"
                  value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                  onChange={handleStartDateChange}
                  min={today}
                  required
                />
              </div>
              <div className="ce-field">
                <label>End Date <span className="req">*</span></label>
                <input
                  type="date"
                  className="ce-input"
                  id="end-date"
                  value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                  onChange={handleEndDateChange}
                  min={minEndDate}
                  required
                  disabled={!startDate}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="ce-card">
            <h3 className="ce-card-title">Event Images <span style={{ color: "#ef4444", fontSize: 14 }}>*</span></h3>
            <div className="ce-images-row">
              {images.map((img, index) => (
                <div key={index} className="ce-img-thumb">
                  <img src={img} alt={`Preview ${index + 1}`} />
                  <button type="button" className="ce-img-remove" onClick={() => removeImage(index)}>
                    <RxCross1 size={10} />
                  </button>
                </div>
              ))}
              <label htmlFor="event-upload" className="ce-img-add">
                <AiOutlinePlusCircle size={24} color="#9ca3af" />
                <span>Add</span>
              </label>
              <input
                type="file"
                id="event-upload"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="ce-submit-wrap">
            <button type="submit" className="ce-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="ce-spinner" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;