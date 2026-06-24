import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import API_URL from "../Api";

export default function Loginpage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath =
    location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/customers/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "customer",
        JSON.stringify(res.data.customer)
      );

      setIsLoggedIn(true);

      toast.success("Login Successful!");

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Invalid Email or Password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-4">

      <form
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
        onSubmit={handleLogin}
      >
        <h2 className="mb-6 text-center text-3xl font-bold">
          Customer Login
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>

    </div>
  );
}