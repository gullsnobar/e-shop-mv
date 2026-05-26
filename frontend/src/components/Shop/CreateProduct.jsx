import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const newForm = new FormData();

    images.forEach((image) => {
      newForm.set("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    newForm.append("discountPrice", discountPrice);
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);
    dispatch(
      createProduct({
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        stock,
        shopId: seller._id,
        images,
      })
    );
  };

  return (
    <div className="w-full max-w-[600px] bg-white rounded-xl border border-gray-100 shadow-sm p-8 800px:p-10">
      <h5 className="text-[24px] font-[600] text-gray-800 text-center mb-8 font-Roboto">
        Create Product
      </h5>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            required
            rows="6"
            name="description"
            value={description}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors resize-none"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 bg-white focus:outline-none focus:border-gray-400 transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Original Price</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount..."
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="stock"
            value={stock}
            className="w-full px-4 h-[42px] border border-gray-200 rounded-lg text-[14px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-700 mb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap gap-3">
            <label
              htmlFor="upload"
              className="w-[80px] h-[80px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
            >
              <AiOutlinePlusCircle size={24} color="#9ca3af" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={i}
                  key={i}
                  alt=""
                  className="h-[80px] w-[80px] object-cover rounded-lg border border-gray-100"
                />
              ))}
          </div>
        </div>

        <div className="pt-2">
          <input
            type="submit"
            value="Create Product"
            className="w-full h-[44px] bg-gray-800 text-white text-[14px] font-medium rounded-lg cursor-pointer hover:bg-gray-900 transition-colors"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;