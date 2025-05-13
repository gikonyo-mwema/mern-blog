import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import DashboardComponent from '../components/DashboardComponent';
import DashServices from '../components/DashServices';
import { DashCourses } from '../components/DashCourses';
import { useSelector } from 'react-redux';
import UserCourses from '../components/UserCourses';
import axios from 'axios';

export default function Dashboard() {
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState('profile');
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    if (currentUser) {
      const fetchPurchasedCourses = async () => {
        try {
          const res = await axios.get(`/api/users/${currentUser._id}/courses`, {
            withCredentials: true
          });
          setPurchasedCourses(res.data);
        } catch (err) {
          console.error('Error fetching purchased courses:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchPurchasedCourses();
    }
  }, [currentUser]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashSidebar />
      </div>
      <div className="flex-1 p-4 md:p-8">
        {/* profile... */}
        {tab === 'profile' && <DashProfile />}
        {/* Posts Tab */}
        {tab === 'posts' && <DashPosts />}
        {/* Users Tab */}
        {tab === 'users' && <DashUsers />}
        {/* Comments Tab */}
        {tab === 'comments' && <DashComments />}
        {/* Dashboard Component Tab */}
        {tab === 'dash' && <DashboardComponent />}
        {/* Services Component Tab */}
        {tab === 'services' && <DashServices />}
        {/* Courses Component Tab */}
        {tab === 'courses' && <DashCourses />}
        {/* User Courses Tab */}
        {tab === 'user-courses' && <UserCourses purchasedCourses={purchasedCourses} loading={loading} />}
      </div>
    </div>
  );
}