import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
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
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
      } else {
        console.error(data.message);
      }
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
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      {/* Top Quote Bar */}
      <div className="bg-indigo-50 dark:bg-gray-700 py-2 px-4 text-center">
        <p className="text-sm italic text-indigo-600 dark:text-indigo-300">
          "Empowering a sustainable future through expert environmental consulting"
        </p>
        <Link 
          to="/about" 
          className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline mt-1 inline-block"
        >
          Learn more about our mission →
        </Link>
      </div>

      {/* Main Navbar */}
      <Navbar fluid rounded className="border-b border-gray-200 dark:border-gray-700 max-w-7xl mx-auto px-4">
        {/* Logo Section - Combined logo and name */}
        <Navbar.Brand as={Link} to="/" className="flex items-center space-x-2">
          <img
            src="https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png"
            alt="Ecodeed Logo"
            className="h-12 w-12"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Ecodeed
          </span>
        </Navbar.Brand>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-4">
          <TextInput
            type="text"
            placeholder="Search articles..."
            rightIcon={AiOutlineSearch}
            className="rounded-full w-full h-10 pl-4 pr-10 text-sm border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            icon={AiOutlineSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Navbar Links - Center */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          <Link 
            to="/" 
            className={`text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white ${
              path === "/" ? "font-medium text-indigo-600 dark:text-indigo-400" : ""
            }`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white ${
              path === "/about" ? "font-medium text-indigo-600 dark:text-indigo-400" : ""
            }`}
          >
            About
          </Link>
          <Link 
            to="/services" 
            className={`text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white ${
              path === "/services" ? "font-medium text-indigo-600 dark:text-indigo-400" : ""
            }`}
          >
            Services
          </Link>
          <Link 
            to="/courses" 
            className={`text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white ${
              path === "/courses" ? "font-medium text-indigo-600 dark:text-indigo-400" : ""
            }`}
          >
            Courses
          </Link>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            className="w-10 h-10"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-200" />}
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
                  className="border-2 border-indigo-500 cursor-pointer"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-medium">@{currentUser.username}</span>
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
        <Navbar.Collapse className="lg:hidden w-full mt-4">
          <Navbar.Link active={path === "/"} as={Link} to="/">
            Home
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={Link} to="/about">
            About
          </Navbar.Link>
          <Navbar.Link active={path === "/services"} as={Link} to="/services">
            Services
          </Navbar.Link>
          <Navbar.Link active={path === "/courses"} as={Link} to="/courses">
            Courses
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}