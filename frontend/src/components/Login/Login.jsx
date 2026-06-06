import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/user";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, isAuthenticated, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login to your account
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>

          <div>

            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>

            <input
              id="login-email"
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
                id="login-password"
                name="password"
                type={visible ? "text":"password"}
                required
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="current-password"
              />

              <div
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={()=>setVisible(!visible)}
              >
                {visible ? <AiOutlineEyeInvisible/> : <AiOutlineEye/>}
              </div>

            </div>

          </div>

          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-blue-600"/>
              Remember me
            </label>

            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </a>

          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">

            Don't have an account?

            <Link
              to="/signup"
              className="ml-1 text-blue-600 hover:underline"
            >
              Sign Up
            </Link>

          </p>

        </form>

      </div>

    </div>

  );

};

export default Login;