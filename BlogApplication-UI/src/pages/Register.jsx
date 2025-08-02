import { useState } from "react";
import { usersApi } from "../api/usersApi";
import { useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, setRegisterUser] = useState({
    userName: "",
    firstName: "",
    lastName: "",
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
          </div>
        </div>
      </nav>

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

      <h1 className="text-2xl font-bold text-center mt-10">Register Page</h1>
      <form className="max-w-md mx-auto mt-6">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            type="text"
            id="userName"
            onChange={(e) =>
              setRegisterUser({ ...registerUser, userName: e.target.value })
            }
            value={registerUser.userName}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            onChange={(e) =>
              setRegisterUser({ ...registerUser, firstName: e.target.value })
            }
            value={registerUser.firstName}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your first name"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            onChange={(e) =>
              setRegisterUser({ ...registerUser, lastName: e.target.value })
            }
            value={registerUser.lastName}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your last name"
          />
        </div>

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
              setRegisterUser({ ...registerUser, password: e.target.value })
            }
            value={registerUser.password}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            onClick={async (event) => {
              event.preventDefault();
              const res = await usersApi.register(registerUser);
              console.log("Res: ", res);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
          <a
            href="/login"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Login
          </a>
        </div>
        <p className="text-center text-gray-500 text-xs mt-4">
          &copy; 2023 BlogApp. All rights reserved.
        </p>
      </form>
    </div>
  );
};

export default Register;
