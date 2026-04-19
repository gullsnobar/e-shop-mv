import React,{useState} from "react";
import {AiOutlineEye,AiOutlineEyeInvisible} from "react-icons/ai";
import {RxAvatar} from "react-icons/rx";
import {Link,useNavigate} from "react-router-dom";
import axios from "axios";
import {server} from "../../server";
import {toast} from "react-toastify";

const SignUp = () => {

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [visible,setVisible] = useState(false);
  const [name,setName] = useState("");
  const [avatar,setAvatar] = useState(null);

  const handleFileInputChange = (e)=>{
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = (e)=>{

    e.preventDefault();

    if(!avatar){
      toast.error("Please select profile image");
      return;
    }

    const config={
      headers:{"Content-Type":"multipart/form-data"}
    };

    const newForm = new FormData();

    newForm.append("name",name);
    newForm.append("file",avatar);
    newForm.append("email",email);
    newForm.append("password",password);

    axios.post(`${server}/user/create-user`,newForm,config)

    .then((res)=>{
      toast.success(res.data.message);

      setName("");
      setEmail("");
      setPassword("");
      setAvatar(null);

      navigate("/login");
    })

    .catch((err)=>{
      toast.error(err.response?.data?.message || "Error");
    });

  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>

          <div>

            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>

            <input
              id="signup-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div>

            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>

            <input
              id="signup-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <div>

            <label className="text-sm font-medium text-gray-600">
              Password
            </label>

            <div className="relative mt-2">

              <input
                id="signup-password"
                name="password"
                type={visible ? "text":"password"}
                required
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="new-password"
              />

              <div
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={()=>setVisible(!visible)}
              >
                {visible ? <AiOutlineEyeInvisible/> : <AiOutlineEye/>}
              </div>

            </div>

          </div>

          <div className="flex items-center gap-4">

            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">

              {avatar ? (
                <img
                  src={URL.createObjectURL(avatar)}
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <RxAvatar size={28} className="text-gray-500"/>
              )}

            </div>

            <label
              htmlFor="avatar"
              className="cursor-pointer text-sm px-4 py-2 border border-gray-300
              rounded-lg hover:bg-gray-50 transition"
            >
              Upload Photo

              <input
                type="file"
                id="avatar"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />

            </label>

          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white font-semibold
            rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600">

            Already have an account?

            <Link
              to="/login"
              className="ml-1 text-blue-600 hover:underline"
            >
              Login
            </Link>

          </p>

        </form>

      </div>

    </div>

  );

};

export default SignUp;