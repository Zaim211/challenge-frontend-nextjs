"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignIn = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/auth", { username, password });

      if (response.status === 200) {
        alert("Login Successful!");
        router.push("/homepage");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setError("Ce compte a été bloqué.");
        } else if (error.response.status === 500) {
          setError("Informations de connexion invalides");
        } else {
          setError("Erreur de connexion au serveur");
        }
      } else {
        setError("Erreur de connexion au serveur");
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-full sm:w-1/2 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-semibold mb-4 text-[#0a1b2c]">
            Welcome Back
          </h1>
          <p className="text-gray-600 mb-6 font-medium">
            Welcome back! Please enter your details.
          </p>

          {error && <div className="text-red-600 mb-4">{error}</div>}

          <form className="space-y-4 w-full" onSubmit={handleSubmit}>
            <div className="flex-1">
              <h1 className="text-[#0a1b2c] font-semibold mb-2">Username</h1>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <h1 className="text-[#0a1b2c] font-semibold mb-2">Password</h1>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember">Remember for 30 days</label>
              </div>

              <a
                href="#"
                className="text-[#0a1b2c] font-bold hover:text-black underline"
              >
                Forgot password
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0a1b2c] text-white p-3 rounded-lg"
            >
              Sign In
            </button>
            <button
              type="button"
              className="w-full bg-white text-black border-gray-600 p-3 rounded-lg border mt-4 flex items-center justify-center"
            >
              <img
                src="/assets/images/gl.png" // Or use your local image path
                alt="lg"
                className="w-6 h-6 mr-2"
              />
              Sign in with Google
            </button>

            <p className="text-center text-sm font-medium text-gray-400 mt-4">
              Don't have an account?{" "}
              <a href="" className="text-[#0a1b2c] font-bold underline">
                Sign up for free
              </a>
            </p>
          </form>
        </div>
      </div>

      <div className="w-full sm:w-1/2 hidden md:block">
        <img
          src="/assets/images/hero.png"
          alt="hero"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default SignIn;
