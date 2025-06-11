import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOut } from "../redux/user/userSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

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
      const resultAction = await dispatch(signOut());
      
      if (signOut.fulfilled.match(resultAction)) {
        // Clear client-side storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Redirect with replace to prevent back navigation
        navigate('/sign-in', { 
          replace: true,
          state: { from: 'signout' } // Optional tracking
        });
        
        toast.success("Signed out successfully");
      } else {
        throw new Error(resultAction.error || "Sign out failed");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error(error.message || "Failed to sign out");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <header className="bg-gray-50 dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      {/* Top Quote Bar */}
      <div className="bg-indigo-50 dark:bg-gray-700 py-2 px-4 text-center">
        <p className="text-sm italic text-indigo-600 dark:text-indigo-300 inline">
          "Empowering a sustainable future through expert environmental consulting"{" "}
          <Link 
            to="/about" 
            className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline inline"
          >
            Learn more about our mission →
          </Link>
        </p>
      </div>

      {/* Main Navbar */}
      <Navbar fluid rounded className="border-b border-gray-200 dark:border-gray-700 max-w-7xl mx-auto px-4 py-3">
        {/* Logo Section */}
        <Navbar.Brand as={Link} to="/" className="flex items-center space-x-2">
          <img
            src="https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png"
            alt="Ecodeed Logo"
            className="h-10 w-10"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Ecodeed
          </span>
        </Navbar.Brand>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-xs md:max-w-md mx-2 md:mx-4">
          <div className="relative">
            <TextInput
              type="text"
              placeholder="Search articles..."
              className="rounded-full w-full h-10 pl-4 pr-10 text-sm border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit" 
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-300"
            >
              <AiOutlineSearch className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Navbar Links - Center */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          <Link 
            to="/" 
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              path === "/" 
                ? "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-gray-700" 
                : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              path === "/about" 
                ? "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-gray-700" 
                : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            }`}
          >
            About
          </Link>
          <Link 
            to="/services" 
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              path === "/services" 
                ? "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-gray-700" 
                : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            }`}
          >
            Services
          </Link>
          <Link 
            to="/courses" 
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              path === "/courses" 
                ? "text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-gray-700" 
                : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            }`}
          >
            Courses
          </Link>
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
                  size="sm"
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
        <Navbar.Collapse className="lg:hidden w-full mt-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
          <Navbar.Link 
            active={path === "/"} 
            as={Link} 
            to="/"
            className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md"
          >
            Home
          </Navbar.Link>
          <Navbar.Link 
            active={path === "/about"} 
            as={Link} 
            to="/about"
            className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md"
          >
            About
          </Navbar.Link>
          <Navbar.Link 
            active={path === "/services"} 
            as={Link} 
            to="/services"
            className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md"
          >
            Services
          </Navbar.Link>
          <Navbar.Link 
            active={path === "/courses"} 
            as={Link} 
            to="/courses"
            className="px-4 py-3 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-md"
          >
            Courses
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}