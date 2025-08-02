import { useNavigate } from "react-router-dom";
import { usersApi } from "../api/usersApi";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState({
    userName: "",
    password: "",
  });

  // User avatar dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting credentials:", loginUser);
    try {
      const res = await usersApi.login(loginUser);
      console.log("API response:", res);
      if (res.authenticated) {
        localStorage.setItem("username", loginUser.userName);
        navigate("/");
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      alert("Login request failed. See console for details.");
      console.error("Login error:", error);
    }
  };

  // Dropdown actions
  const handleSignIn = () => {
    navigate("/login");
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <>
      <div>
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <div
                onClick={() => (window.location.href = "/")}
                className="text-white text-lg font-bold cursor-pointer"
              >
                BlogApp
              </div>
              <div className="space-x-4"></div>
            </div>
          </div>
        </nav>
      </div>

      {/* User Avatar Dropdown */}
      <div className="flex justify-end items-center p-4">
        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="focus:outline-none"
            aria-label="User menu"
          >
            <img
              src="src/assets/userlogo.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 py-2">
              <button
                onClick={handleSignIn}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Sign In
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <h1 className="text-2xl font-bold text-center mt-10">Login Page</h1>
      <form className="max-w-md mx-auto mt-6" onSubmit={handleSubmit}>
        {/* username */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            onChange={(e) =>
              setLoginUser({ ...loginUser, userName: e.target.value })
            }
            value={loginUser.userName}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your username"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            onChange={(e) =>
              setLoginUser({ ...loginUser, password: e.target.value })
            }
            value={loginUser.password}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
          />
        </div>

        {/* Login Button */}
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
          <a
            href="/register"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Register
          </a>
        </div>
      </form>
    </>
  );
};

export default Login;
