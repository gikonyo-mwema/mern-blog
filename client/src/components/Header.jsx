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

  return (
    <header className="bg-[#051836] sticky top-0 z-50">
      {/* Top Quote Bar */}
      <div className="bg-[#008037] py-2 px-4 text-center">
        <p className="text-sm italic text-white inline">
          "Empowering a sustainable future through expert environmental consulting"{" "}
          <Link
            to="/about"
            className="text-xs text-[#F8BF0F] hover:underline inline"
          >
            Learn more →
          </Link>
        </p>
      </div>

      {/* Main Navbar */}
      <Navbar
        fluid
        rounded
        className="border-b border-gray-700 max-w-7xl mx-auto px-4 py-3 bg-[#051836]"
      >
        {/* Logo Section */}
        <Navbar.Brand as={Link} to="/" className="flex items-center space-x-2">
          <img
            src="https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png"
            alt="Ecodeed Logo"
            className="h-10 w-10"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
            Ecodeed
          </span>
        </Navbar.Brand>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 max-w-xs md:max-w-md mx-2 md:mx-4"
        >
          <div className="relative">
            <TextInput
              type="text"
              placeholder="Search articles..."
              className="rounded-full w-full h-10 pl-4 pr-10 text-sm border-gray-300 focus:ring-2 focus:ring-[#008037] focus:border-[#008037] dark:bg-gray-700 dark:border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#008037]"
            >
              <AiOutlineSearch className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Navbar Links - Center */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            { to: "/services", label: "Services" },
            { to: "/courses", label: "Courses" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                path === to
                  ? "text-white bg-[#008037]"
                  : "text-white hover:text-[#008037] hover:bg-gray-100 dark:hover:bg-gray-700"
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
              <FaSun className="text-[#F8BF0F]" />
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
                  img={currentUser.profilePicture}
                  rounded
                  size="sm"
                  className="border-2 border-[#008037] cursor-pointer"
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
                <Dropdown.Item>My Profile</Dropdown.Item>
              </Link>
              {currentUser.isAdmin && (
                <Link to="/dashboard">
                  <Dropdown.Item>Admin Dashboard</Dropdown.Item>
                </Link>
              )}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
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
                  className="border-2 border-gray-300 cursor-pointer bg-gray-100 dark:bg-gray-600"
                />
              }
            >
              <Link to="/sign-in">
                <Dropdown.Item>Sign In</Dropdown.Item>
              </Link>
              <Link to="/sign-up">
                <Dropdown.Item>Sign Up</Dropdown.Item>
              </Link>
            </Dropdown>
          )}

          <Navbar.Toggle className="lg:hidden" />
        </div>

        {/* Mobile Menu */}
        <Navbar.Collapse className="lg:hidden w-full mt-3 bg-[#051836] rounded-lg shadow-lg">
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
              className={`px-4 py-3 rounded-md text-white ${
                path === to
                  ? "bg-[#008037]"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#008037]"
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
