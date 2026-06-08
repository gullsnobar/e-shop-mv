import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { clearProductState } from "../../redux/reducers/products";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error, isLoading } = useSelector((state) => state.products);
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

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProductState());
    }
    if (success) {
      toast.success("Product created successfully!");
      dispatch(clearProductState());
      navigate("/dashboard-products");
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

    if (!name || !description || !category || !discountPrice || !stock || images.length === 0) {
      toast.error("Please fill all required fields and upload at least one image!");
      return;
    }

    dispatch(
      createProduct({
        name,
        description,
        category,
        tags,
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        discountPrice: Number(discountPrice),
        stock: Number(stock),
        shopId: seller?._id,
        images,
      })
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .cp-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          max-width: 720px;
          margin: 0 auto;
          width: 100%;
        }
        .cp-header { margin-bottom: 28px; }
        .cp-header h1 {
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 4px;
        }
        .cp-header p {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }
        .cp-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
          border: 1px solid #f3f4f6;
          padding: 28px;
          margin-bottom: 24px;
        }
        .cp-card-title {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 20px;
        }
        .cp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 640px) { .cp-grid { grid-template-columns: 1fr; } }
        .cp-full { grid-column: 1 / -1; }
        .cp-field label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .cp-field label .req { color: #ef4444; margin-left: 2px; }
        .cp-input, .cp-select, .cp-textarea {
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
        .cp-input:focus, .cp-select:focus, .cp-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
          background: #fff;
        }
        .cp-input::placeholder, .cp-textarea::placeholder { color: #d1d5db; }
        .cp-textarea { min-height: 100px; resize: vertical; }
        .cp-select { appearance: none; cursor: pointer; }

        /* Images */
        .cp-images-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
        }
        .cp-img-thumb {
          position: relative;
          width: 90px;
          height: 90px;
          border-radius: 10px;
          overflow: hidden;
          border: 1.5px solid #e5e7eb;
        }
        .cp-img-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cp-img-remove {
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
        .cp-img-remove:hover { background: rgba(239,68,68,0.85); }
        .cp-img-add {
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
        .cp-img-add:hover { border-color: #6366f1; background: #f5f3ff; }
        .cp-img-add span { font-size: 11px; color: #9ca3af; font-weight: 500; }

        /* Submit */
        .cp-submit-wrap { display: flex; justify-content: flex-end; margin-top: 8px; }
        .cp-submit-btn {
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
      `}</style>

      <div className="cp-root">
        <div className="cp-header">
          <h1>Create Product</h1>
          <p>Add a new product to your shop</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="cp-card">
            <h3 className="cp-card-title">Basic Information</h3>
            <div className="cp-grid">
              <div className="cp-field cp-full">
                <label>Product Name <span className="req">*</span></label>
                <input
                  type="text"
                  className="cp-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name..."
                  required
                />
              </div>
              <div className="cp-field cp-full">
                <label>Description <span className="req">*</span></label>
                <textarea
                  className="cp-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this product..."
                  required
                />
              </div>
              <div className="cp-field">
                <label>Category <span className="req">*</span></label>
                <select
                  className="cp-select"
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
              <div className="cp-field">
                <label>Tags</label>
                <input
                  type="text"
                  className="cp-input"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. electronics, new arrival"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="cp-card">
            <h3 className="cp-card-title">Pricing & Stock</h3>
            <div className="cp-grid">
              <div className="cp-field">
                <label>Original Price</label>
                <input
                  type="number"
                  className="cp-input"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                />
              </div>
              <div className="cp-field">
                <label>Discount Price <span className="req">*</span></label>
                <input
                  type="number"
                  className="cp-input"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  required
                />
              </div>
              <div className="cp-field">
                <label>Stock <span className="req">*</span></label>
                <input
                  type="number"
                  className="cp-input"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="cp-card">
            <h3 className="cp-card-title">Product Images <span style={{ color: "#ef4444", fontSize: 14 }}>*</span></h3>
            <div className="cp-images-row">
              {images.map((img, index) => (
                <div key={index} className="cp-img-thumb">
                  <img src={img} alt={`Preview ${index + 1}`} />
                  <button type="button" className="cp-img-remove" onClick={() => removeImage(index)}>
                    <RxCross1 size={10} />
                  </button>
                </div>
              ))}
              <label htmlFor="product-upload" className="cp-img-add">
                <AiOutlinePlusCircle size={24} color="#9ca3af" />
                <span>Add</span>
              </label>
              <input
                type="file"
                id="product-upload"
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="cp-submit-wrap">
            <button type="submit" className="cp-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="cp-spinner" />
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;