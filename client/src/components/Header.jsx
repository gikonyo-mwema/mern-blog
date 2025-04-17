import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun, FaTimes } from "react-icons/fa";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
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
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }

    // Check localStorage for banner visibility preference
    const bannerPreference = localStorage.getItem("bannerVisible");
    if (bannerPreference === "false") {
      setIsBannerVisible(false);
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

  const handleBannerClose = () => {
    setIsBannerVisible(false);
    localStorage.setItem("bannerVisible", "false");
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Top Banner */}
      {isBannerVisible && (
        <div className="bg-indigo-600 text-white py-2 px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Quality Content Since 2023</span>
            <Link to="/contact" className="text-sm hover:underline">Contact Support</Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <a href="#" aria-label="Facebook"><FaFacebook className="hover:text-indigo-300" /></a>
              <a href="#" aria-label="Twitter"><FaTwitter className="hover:text-indigo-300" /></a>
              <a href="#" aria-label="Instagram"><FaInstagram className="hover:text-indigo-300" /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin className="hover:text-indigo-300" /></a>
            </div>
            <button 
              onClick={handleBannerClose}
              className="p-1 rounded-full hover:bg-indigo-700"
              aria-label="Close banner"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar className="border-b-2 border-yellow-500 px-4 bg-white dark:bg-gray-800">
        {/* Logo Section - Left */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="https://res.cloudinary.com/dcrubaesi/image/upload/v1737333837/ECODEED_COLORED_LOGO_wj2yy8.png"
              alt="Ecodeed Logo"
              className="h-12 w-12 mr-2"
            />
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white hidden sm:block">
              Ecodeed
            </span>
          </Link>
        </div>

        {/* Main Navigation - Center */}
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1">
          <Navbar.Collapse className="space-x-8">
            <Navbar.Link active={path === "/"} as="div">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                Home
              </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/about"} as="div">
              <Link to="/about" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                About Us
              </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/projects"} as="div">
              <Link to="/projects" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                Services
              </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/blog"} as="div">
              <Link to="/blog" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                Blog
              </Link>
            </Navbar.Link>
            <Navbar.Link active={path === "/contact"} as="div">
              <Link to="/contact" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white">
                Contact
              </Link>
            </Navbar.Link>
          </Navbar.Collapse>
        </div>

        {/* User Section - Right */}
        <div className="flex items-center gap-4 md:order-2">
          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="hidden md:block">
            <TextInput
              type="text"
              placeholder="Search..."
              rightIcon={AiOutlineSearch}
              className="rounded-full w-48 lg:w-64 h-10 pl-4 pr-10 text-sm border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* Theme Toggle */}
          <Button
            className="w-10 h-10 hidden sm:inline"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>

          {/* User Avatar/Dropdown or Sign In */}
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar 
                  alt="user" 
                  img={currentUser.profilePicture} 
                  rounded 
                  className="border-2 border-indigo-500"
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm font-medium">@{currentUser.username}</span>
                <span className="block text-sm text-gray-500 truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>
              <Link to="/dashboard">
                <Dropdown.Item>Dashboard</Dropdown.Item>
              </Link>
              <Link to="/dashboard?tab=profile">
                <Dropdown.Item>My Profile</Dropdown.Item>
              </Link>
              <Link to="/dashboard?tab=settings">
                <Dropdown.Item>Settings</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            <div className="flex space-x-2">
              <Link to="/sign-in">
                <Button gradientDuoTone="purpleToBlue" outline>
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up" className="hidden lg:block">
                <Button gradientDuoTone="purpleToBlue">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          
          <Navbar.Toggle className="lg:hidden" />
        </div>

        {/* Mobile Menu */}
        <Navbar.Collapse className="lg:hidden w-full mt-4">
          <Navbar.Link active={path === "/"} as="div">
            <Link to="/" className="block py-2">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as="div">
            <Link to="/about" className="block py-2">About Us</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as="div">
            <Link to="/projects" className="block py-2">Services</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/blog"} as="div">
            <Link to="/blog" className="block py-2">Blog</Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/contact"} as="div">
            <Link to="/contact" className="block py-2">Contact</Link>
          </Navbar.Link>
          {!currentUser && (
            <>
              <Navbar.Link as="div">
                <Link to="/sign-in" className="block py-2">Sign In</Link>
              </Navbar.Link>
              <Navbar.Link as="div">
                <Link to="/sign-up" className="block py-2">Sign Up</Link>
              </Navbar.Link>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}