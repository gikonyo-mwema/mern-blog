import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { 
  HiUser, 
  HiArrowSmRight, 
  HiDocumentText, 
  HiOutlineUserGroup, 
  HiAnnotation, 
  HiChartPie,
  HiClipboardCheck,
  HiBookOpen 
} from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

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
      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleTabClick = (tabName) => {
    navigate(`/dashboard?tab=${tabName}`);
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser.isAdmin && (
            <Sidebar.Item
              active={tab === "dash" || !tab}
              icon={HiChartPie}
              onClick={() => handleTabClick("dash")}
              as="div"
              className="cursor-pointer"
            >
              Dashboard
            </Sidebar.Item>
          )}
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser.isAdmin ? "Admin" : "User"}
            labelColor="dark"
            onClick={() => handleTabClick("profile")}
            as="div"
            className="cursor-pointer"
          >
            Profile
          </Sidebar.Item>

          {currentUser.isAdmin && (
            <>
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                onClick={() => handleTabClick("posts")}
                as="div"
                className="cursor-pointer"
              >
                Posts
              </Sidebar.Item>
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                onClick={() => handleTabClick("users")}
                as="div"
                className="cursor-pointer"
              >
                Users
              </Sidebar.Item>
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiAnnotation}
                onClick={() => handleTabClick("comments")}
                as="div"
                className="cursor-pointer"
              >
                Comments
              </Sidebar.Item>
              <Sidebar.Item
                active={tab === "services"}
                icon={HiClipboardCheck}
                onClick={() => handleTabClick("services")}
                as="div"
                className="cursor-pointer"
              >
                Services
              </Sidebar.Item>
              <Sidebar.Item
                active={tab === "courses"}
                icon={HiBookOpen}
                onClick={() => handleTabClick("courses")}
                as="div"
                className="cursor-pointer"
              >
                Courses
              </Sidebar.Item>
                

            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            onClick={handleSignOut}
            as="div"
            className="cursor-pointer"
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
