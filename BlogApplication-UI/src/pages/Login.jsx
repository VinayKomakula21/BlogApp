import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, setError } = useAuth();
  const [loginUser, setLoginUser] = useState({
    userName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || "/";

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
    setLoading(true);
    setError(null);

    try {
      await login(loginUser);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
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
              <button onClick={() => navigate('/')} className="text-white text-lg font-bold cursor-pointer">
                BlogSphere
              </button>
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
            className="focus:outline-none w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
            aria-label="User menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21a8 8 0 10-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
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
      {error && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
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
            disabled={loading}
            className={`${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <Link
            to="/register"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Register
          </Link>
        </div>
      </form>
    </>
  );
};

export default Login;
