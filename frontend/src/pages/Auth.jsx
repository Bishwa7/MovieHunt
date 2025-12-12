import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("signup"); // signup | signin

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const userName = mode === "signup" ? e.target.username.value.trim() : undefined;

    if (!email || !password || (mode === "signup" && !userName)) {
      alert("Please fill in all required fields!");
      return;
    }

    const payload = mode === "signup" ? { email, password, userName } : { email, password };


    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userName }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error occurred");
        return;
      }

      if (mode === "signin") {
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.user)); 
        navigate("/");
      }

      alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="min-h-screen flex bg-primary">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex-col items-start justify-center p-14 relative overflow-hidden">

        {/* BG Glow */}
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/40 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl opacity-20"></div>


        <div className="relative z-10 space-y-6 max-w-lg">

          <div className="flex items-center gap-3 font-bold text-4xl tracking-wide">
            <img src={assets.logo} alt="" className="w-12 h-auto drop-shadow-lg" />
            MovieHunt
          </div>

          <p className="text-lg leading-relaxed opacity-90">
            Your all-in-one platform to explore movies, check showtimes, and book tickets effortlessly.
          </p>


          <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm shadow-lg">
            <p className="text-sm opacity-90 leading-relaxed">
              MovieHunt is a MERN-based modern movie ticketing system with powerful admin controls for 
              managing movies, theatres, shows, and bookings — built with performance and usability in mind.
            </p>
          </div>

        </div>
      </div>



      {/* Right Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 text-gray-900">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                required
              />
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input
                  name="username"
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Choose a username"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                name="password"
                type="password"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              {mode === "signup" ? "Sign Up" : "Log In"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center mt-4 text-sm">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  className="text-blue-600 font-semibold"
                  onClick={() => setMode("signin")}
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  className="text-blue-600 font-semibold"
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
