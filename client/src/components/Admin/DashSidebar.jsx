import React, { useEffect, useState } from "react";
import { Sidebar, Tooltip, Spinner } from "flowbite-react";
import { 
  HiUser, 
  HiArrowSmRight, 
  HiDocumentText, 
  HiOutlineUserGroup, 
  HiAnnotation, 
  HiChartPie,
  HiClipboardCheck,
  HiAcademicCap,
  HiOutlineViewGrid,
  HiOutlineTrendingUp,
  HiCash // Replaced HiCurrencyDollar with HiCash
} from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../redux/user/userSlice";
import { toast } from "react-toastify";

export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const resultAction = await dispatch(signOut());
      
      if (signOut.fulfilled.match(resultAction)) {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/sign-in', { 
          replace: true,
          state: { from: 'dashboard' }
        });
        toast.success("Signed out successfully");
      } else {
        throw new Error(resultAction.error?.message || "Sign out failed");
      }
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error(error.message || "Failed to sign out");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleTabClick = (tabName) => {
    navigate(`/dashboard?tab=${tabName}`);
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  // Admin tabs configuration
  const adminTabs = [
    { id: "dash", name: "Dashboard", icon: HiChartPie },
    { id: "posts", name: "Posts", icon: HiDocumentText },
    { id: "users", name: "Users", icon: HiOutlineUserGroup },
    { id: "comments", name: "Comments", icon: HiAnnotation },
    { id: "services", name: "Services", icon: HiClipboardCheck },
    { id: "courses", name: "Courses", icon: HiAcademicCap },
    { id: "payments", name: "Payments", icon: HiCash }, // Changed from HiCurrencyDollar to HiCash
    { id: "analytics", name: "Analytics", icon: HiOutlineTrendingUp }
  ];

  return (
    <>
      <button 
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        <HiOutlineViewGrid className="w-6 h-6" />
      </button>

      <Sidebar 
        aria-label="Dashboard sidebar"
        className={`w-full md:w-56 fixed md:relative z-40 transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : ''}`}
        collapsed={collapsed}
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-1">
            <Tooltip content="Profile" placement="right" trigger={collapsed ? "hover" : null}>
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser?.isAdmin ? "Admin" : "User"}
                labelColor="dark"
                onClick={() => handleTabClick("profile")}
                as="div"
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {!collapsed && "Profile"}
              </Sidebar.Item>
            </Tooltip>

            {currentUser?.isAdmin && adminTabs.map((item) => (
              <Tooltip 
                key={item.id} 
                content={item.name} 
                placement="right" 
                trigger={collapsed ? "hover" : null}
              >
                <Sidebar.Item
                  active={tab === item.id || (!tab && item.id === "dash")}
                  icon={item.icon}
                  onClick={() => handleTabClick(item.id)}
                  as="div"
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {!collapsed && item.name}
                </Sidebar.Item>
              </Tooltip>
            ))}

            <Tooltip content="Sign Out" placement="right" trigger={collapsed ? "hover" : null}>
              <Sidebar.Item
                icon={isSigningOut ? Spinner : HiArrowSmRight}
                onClick={handleSignOut}
                as="div"
                className={`cursor-pointer hover:bg-red-50 dark:hover:bg-red-900 transition-colors ${
                  isSigningOut ? "opacity-70" : ""
                }`}
                disabled={isSigningOut}
              >
                {!collapsed && (
                  <span className={isSigningOut ? "text-gray-500" : ""}>
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </span>
                )}
              </Sidebar.Item>
            </Tooltip>
          </Sidebar.ItemGroup>
        </Sidebar.Items>

        {!mobileOpen && (
          <button 
            onClick={toggleSidebar}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-1 shadow-md transition-colors"
          >
            {collapsed ? (
              <HiArrowSmRight className="w-5 h-5 rotate-180" />
            ) : (
              <HiArrowSmRight className="w-5 h-5" />
            )}
          </button>
        )}
      </Sidebar>

      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        />
      )}
    </>
  );
}