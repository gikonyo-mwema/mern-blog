import {
  Avatar,
  Button,
  Dropdown,
  Navbar,
  TextInput,
} from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOut } from "../redux/user/userSlice";
import { useEffect, useState } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      await dispatch(signOut()).unwrap();
      navigate("/sign-in");
    } catch (error) {
      console.error("Sign-out failed:", error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  // Logo based on theme
  const logoUrl = theme === "light" 
    ? "https://res.cloudinary.com/dcrubaesi/image/upload/v1753007363/ECODEED_BLACK_LOGO_xtwjoy.png"
    : "https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png";

  // Default user avatar
  const userAvatar = currentUser?.profilePicture || 
    "https://res.cloudinary.com/dcrubaesi/image/upload/v1753008847/EcodeedUser2_ekhqvm.jpg";

  return (
    <header className={`sticky top-0 z-50 ${theme === "light" ? "bg-white shadow-md" : "bg-brand-blue"}`}>
      {/* Top Quote Bar */}
      <div className="bg-brand-green py-2 px-4 text-center">
        <p className="text-sm italic text-white inline">
          "Empowering a sustainable future through expert environmental consulting"{" "}
          <Link
            to="/about"
            className="text-xs text-brand-yellow hover:underline inline font-medium"
          >
            Learn more →
          </Link>
        </p>
      </div>

      {/* Main Navbar */}
      <Navbar
        fluid
        rounded
        className={`border-b ${theme === "light" ? "border-gray-200" : "border-gray-700"} max-w-7xl mx-auto px-4 py-3 ${theme === "light" ? "bg-white" : "bg-brand-blue"}`}
      >
        {/* Logo Section */}
        <Navbar.Brand as={Link} to="/" className="flex items-center space-x-2 hover:scale-105 transition-transform duration-200">
          <img
            src={logoUrl}
            alt="Ecodeed Logo"
            className="h-10 w-10"
          />
          <span className={`self-center text-xl font-semibold whitespace-nowrap ${theme === "light" ? "text-brand-blue" : "text-white"}`}>
            Ecodeed
          </span>
        </Navbar.Brand>

        {/* Search Form - Updated with continuous border */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 max-w-xs md:max-w-md mx-2 md:mx-4"
        >
          <div className={`relative flex items-center rounded-full border ${
            theme === "light" 
              ? "border-gray-300 bg-gray-50 focus-within:border-brand-green" 
              : "border-gray-600 bg-gray-700 focus-within:border-brand-yellow"
          } transition-colors duration-200`}>
            <input
              type="text"
              placeholder="Search articles..."
              className={`w-full h-10 pl-4 pr-10 text-sm bg-transparent outline-none rounded-full ${
                theme === "light" ? "text-gray-800" : "text-white"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                theme === "light" ? "text-gray-500" : "text-gray-300"
              } hover:text-brand-green`}
            >
              <AiOutlineSearch className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Navbar Links - Center */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/services", label: "Services" },
            /*{ to: "/courses", label: "Courses" },*/
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                path === to
                  ? "text-white bg-brand-green"
                  : theme === "light"
                    ? "text-brand-blue hover:text-brand-green hover:bg-gray-100"
                    : "text-white hover:text-brand-yellow hover:bg-gray-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            className="w-9 h-9"
            color="gray"
            pill
            size="sm"
            onClick={() => dispatch(toggleTheme())}
            aria-label={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? (
              <FaSun className="text-brand-yellow" />
            ) : (
              <FaMoon className="text-white" />
            )}
          </Button>

          {/* User Avatar/Dropdown */}
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  img={userAvatar}
                  rounded
                  size="sm"
                  className={`border-2 ${theme === "light" ? "border-brand-green" : "border-brand-yellow"} cursor-pointer hover:scale-105 transition-transform duration-200`}
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-medium">
                  @{currentUser.username}
                </span>
                <span className="block text-sm text-gray-500 truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to="/dashboard?tab=profile">
                <Dropdown.Item className="hover:bg-brand-green hover:text-white transition-colors duration-200">
                  My Profile
                </Dropdown.Item>
              </Link>
              {currentUser.isAdmin && (
                <Link to="/dashboard">
                  <Dropdown.Item className="hover:bg-brand-green hover:text-white transition-colors duration-200">
                    Admin Dashboard
                  </Dropdown.Item>
                </Link>
              )}
              <Dropdown.Divider />
              <Dropdown.Item 
                onClick={handleSignout}
                className="hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                Sign out
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt="user"
                  rounded
                  size="sm"
                  img={userAvatar}
                  className={`border-2 cursor-pointer hover:scale-105 transition-transform duration-200 ${
                    theme === "light" 
                      ? "border-brand-green bg-gray-100" 
                      : "border-brand-yellow bg-gray-700"
                  }`}
                />
              }
            >
              <Link to="/sign-in">
                <Dropdown.Item className={`${theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"} transition-colors duration-200`}>
                  Sign In
                </Dropdown.Item>
              </Link>
              <Link to="/sign-up">
                <Dropdown.Item className={`${theme === "light" ? "hover:bg-gray-100" : "hover:bg-gray-700"} transition-colors duration-200`}>
                  Sign Up
                </Dropdown.Item>
              </Link>
            </Dropdown>
          )}

          <Navbar.Toggle className="lg:hidden text-brand-green dark:text-brand-yellow" />
        </div>

        {/* Mobile Menu */}
        <Navbar.Collapse className="lg:hidden w-full mt-3 bg-white dark:bg-brand-blue rounded-lg shadow-lg">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/services", label: "Services" },
            { to: "/courses", label: "Courses" },
          ].map(({ to, label }) => (
            <Navbar.Link
              key={to}
              active={path === to}
              as={Link}
              to={to}
              className={`px-4 py-3 rounded-md transition-colors duration-200 ${
                path === to
                  ? "bg-brand-green text-white"
                  : theme === "light"
                    ? "text-brand-blue hover:bg-gray-100 hover:text-brand-green"
                    : "text-white hover:bg-gray-700 hover:text-brand-yellow"
              }`}
            >
              {label}
            </Navbar.Link>
          ))}
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}