import React, { useEffect, useState } from "react";
import { Sidebar, Tooltip } from "flowbite-react";
import { 
  HiUser, 
  HiArrowSmRight, 
  HiDocumentText, 
  HiOutlineUserGroup, 
  HiAnnotation, 
  HiChartPie,
  HiClipboardCheck,
  HiBookOpen,
  HiCurrencyDollar,
  HiAcademicCap,
  HiOutlineViewGrid,
  HiOutlineTrendingUp
} from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = res.ok ? await res.json() : await res.text();

      if (!res.ok) {
        console.error(data.message || "Sign out failed");
      } else {
        dispatch(signoutSuccess());
        navigate("/sign-in");
      }
    } catch (error) {
      console.error("Sign out error:", error.message);
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

  // Admin tabs configuration for better maintainability
  const adminTabs = [
    { id: "dash", name: "Dashboard", icon: HiChartPie },
    { id: "posts", name: "Posts", icon: HiDocumentText },
    { id: "users", name: "Users", icon: HiOutlineUserGroup },
    { id: "comments", name: "Comments", icon: HiAnnotation },
    { id: "services", name: "Services", icon: HiClipboardCheck },
    { id: "courses", name: "Courses", icon: HiAcademicCap },
    { id: "payments", name: "Payments", icon: HiCurrencyDollar },
    { id: "analytics", name: "Analytics", icon: HiOutlineTrendingUp }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-200 dark:bg-gray-700"
      >
        <HiOutlineViewGrid className="w-6 h-6" />
      </button>

      <Sidebar 
        className={`w-full md:w-56 fixed md:relative z-40 transition-all duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${collapsed ? 'md:w-20' : ''}`}
        collapsed={collapsed}
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-1">
            {/* Profile always visible */}
            <Tooltip content="Profile" placement="right" trigger={collapsed ? "hover" : null}>
              <Sidebar.Item
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser.isAdmin ? "Admin" : "User"}
                labelColor="dark"
                onClick={() => handleTabClick("profile")}
                as="div"
                className="cursor-pointer"
              >
                {!collapsed && "Profile"}
              </Sidebar.Item>
            </Tooltip>

            {/* Admin-only tabs */}
            {currentUser.isAdmin && adminTabs.map((item) => (
              <Tooltip key={item.id} content={item.name} placement="right" trigger={collapsed ? "hover" : null}>
                <Sidebar.Item
                  active={tab === item.id || (!tab && item.id === "dash")}
                  icon={item.icon}
                  onClick={() => handleTabClick(item.id)}
                  as="div"
                  className="cursor-pointer"
                >
                  {!collapsed && item.name}
                </Sidebar.Item>
              </Tooltip>
            ))}

            {/* Sign out */}
            <Tooltip content="Sign Out" placement="right" trigger={collapsed ? "hover" : null}>
              <Sidebar.Item
                icon={HiArrowSmRight}
                onClick={handleSignOut}
                as="div"
                className="cursor-pointer"
              >
                {!collapsed && "Sign Out"}
              </Sidebar.Item>
            </Tooltip>
          </Sidebar.ItemGroup>
        </Sidebar.Items>

        {/* Collapse toggle button (desktop only) */}
        {!mobileOpen && (
          <button 
            onClick={toggleSidebar}
            className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full p-1 shadow-md"
          >
            {collapsed ? (
              <HiArrowSmRight className="w-5 h-5 rotate-180" />
            ) : (
              <HiArrowSmRight className="w-5 h-5" />
            )}
          </button>
        )}
      </Sidebar>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}