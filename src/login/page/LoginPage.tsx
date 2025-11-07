// src/auth/pages/LoginPage.tsx
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLogin } from "../hooks/useLogin";
import type { LoginData } from "../types/auth";
import logo from "../../assets/logo.png";
import { useParams } from "react-router-dom";
const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
   const { category } = useParams();
   console.log(category)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  return (
    <div className="w-full font-poppins min-h-screen flex items-center justify-center bg-gray-100 transition-colors duration-500">
      <div className="w-full max-w-md bg-white  rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-48  mb-4 object-fit-cover" />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800   tracking-wide">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="w-full space-y-5">

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="username "
            className="w-full p-3 border-b-2 border-gray-300  bg-transparent text-gray-800  focus:border-blue-500 outline-none"
            required
          />

          <div className="relative">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border-b-2 border-gray-300  bg-transparent text-gray-800  focus:border-blue-500 outline-none pr-10"
              required
            />
            <span
              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-600 transition"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400  text-center">
          Designed and Developed by <span className="font-semibold text-blue-500">Yaksha Soft</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
