import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef(null);

  const isAuthenticated = !!localStorage.getItem("username");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.removeItem("username");
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleSignIn = () => {
    setDropdownOpen(false);
    navigate("/login");
  };

  // Close dropdown when clicking outside
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
            <div className="flex items-center space-x-4">
              <a href="/create" className="text-gray-300 hover:text-white">
                Create Blog
              </a>
              <div className="relative" ref={avatarRef}>
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="focus:outline-none"
                  aria-label="User menu"
                >
                  <img
                    src="src/assets/userlogo.png"
                    alt={username ? `${username}'s avatar` : "User Avatar"}
                    className="w-10 h-10 rounded-full"
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-20">
                    {!isAuthenticated && (
                      <button
                        onClick={handleSignIn}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Sign In
                      </button>
                    )}
                    {isAuthenticated && (
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
