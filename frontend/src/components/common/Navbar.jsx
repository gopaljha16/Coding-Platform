import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logutUser } from "../../slice/authSlice";
import { useNavigate, Link, NavLink } from "react-router";
import { toast } from "react-toastify";
import { User, ChevronDown } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsopen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { isAuthenticated, loading, error, user } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isAuthenticated == false) {
  //     navigate("/login");
  //   }
  // }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entry animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const logout = () => {
    dispatch(logutUser());
    navigate("/login");
    toast.info("Logout Successfully");
  };

  const navItems = [
    { to: "/explore", label: "Explore" },
    { to: "/problems", label: "Problems" },
    { to: "/contest", label: "Contest" },
    { to: "/discuss", label: "Discuss" },
    { to: "/interview", label: "Interview" },
    { to: "/store", label: "Store" },
    { to: "/codeEditor", label: "Code Editor" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl transition-all duration-300 ease-in-out ${
          scrolled
            ? "mt-2 backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl shadow-black/10"
            : "mt-6 bg-transparent border border-orange-300"
        } rounded-2xl`}
      >
        <div className="flex items-center justify-between px-8 py-4">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="group relative overflow-hidden">
              <div className="relative">
                <span className="text-3xl italic text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 tracking-tight font-semibold">
                  Codexa
                </span>
                <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 transition-all duration-300 group-hover:w-full"></div>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div
                key={item.to}
                className={`transition-all duration-300 ease-out ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: `${(index + 1) * 100}ms`,
                }}
              >
                <Link
                  to={item.to}
                  className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200 group"
                >
                  <span className="relative z-10 text-gray-200 text-[16px] ">
                    {item.label}
                  </span>
                  <div className="absolute inset-0 rounded-lg scale-0 transition-transform duration-200 group-hover:scale-100"></div>
                  <div className="absolute bottom-0 h-0.5 w-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 transition-all ml-3 duration-200 group-hover:w-[70%] group-hover:left-0"></div>
                </Link>
              </div>
            ))}
          </nav>

          {/* User Menu */}
          <div className="relative">
            {/* Authenticated. */}
            {isAuthenticated ? (
              <div>
                <button
                  onClick={() => setIsopen(!isOpen)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    scrolled
                      ? "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                      : "bg-gray-100 hover:bg-gray-200"
                  } border border-gray-200/50 hover:border-gray-300/50 shadow-sm hover:shadow-md group`}
                >
                  <User className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-all duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {isOpen && (
                  <div
                    className={`absolute right-0 mt-3 w-64 transition-all duration-300 ease-out ${
                      isOpen
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-2 scale-95"
                    }`}
                  >
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
                      <div className="p-6">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                          <div className="w-15 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Welcome back! {user?.firstName}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                              {user?.role || "User"}
                            </p>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-4 space-y-2">
                          {/* Admin Dashboard */}
                          {user?.role === "admin" && (
                            <NavLink to="/admin">
                              <button className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50 transition-all duration-200 group">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                                <div>
                                  <p className="font-semibold text-blue-900">
                                    Dashboard
                                  </p>
                                  <p className="text-xs text-blue-600">
                                    Admin panel
                                  </p>
                                </div>
                              </button>
                            </NavLink>
                          )}

                          {/* Logout Button */}
                          <button
                            onClick={logout}
                            className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border border-red-200/50 transition-all duration-200 group"
                          >
                            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-red-900">
                                Sign Out
                              </p>
                              <p className="text-xs text-red-600">
                                See you later!
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative group">
                <div className="relative z-10 px-5 py-2 inline-block text-sm font-bold cursor-pointer tracking-wide text-amber-400  hover:text-white border border-amber-500/60 rounded-md group-hover:text-gray-900 transition-colors duration-300">
                  <NavLink to="/login" className="cursor-pointer">
                    <button className="relative z-20">Login</button>
                  </NavLink>
                </div>
                <span className="absolute inset-0 w-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-md group-hover:w-full transition-all duration-300 ease-out"></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Hidden by default but structure ready */}
      <div className="lg:hidden">
        {/* Add mobile menu implementation if needed */}
      </div>
    </div>
  );
};

export default Navbar;
