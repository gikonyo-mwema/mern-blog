import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardTables from "./DashTables";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function DashboardComponent() {
  const [data, setData] = useState({
    users: [], 
    comments: [], 
    posts: [], 
    services: [], 
    courses: [] 
  });
  
  const [loading, setLoading] = useState({
    users: true, 
    posts: true, 
    comments: true, 
    services: true, 
    courses: true
  });

  const [error, setError] = useState({
    users: null, 
    posts: null, 
    comments: null, 
    services: null, 
    courses: null
  });

  const [pagination, setPagination] = useState({
    users: { limit: 5, page: 1 },
    posts: { limit: 5, page: 1 },
    comments: { limit: 5, page: 1 },
    services: { limit: 5, page: 1 },
    courses: { limit: 5, page: 1 }
  });

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    fetchDashboardData();
  }, [currentUser, pagination]);

  const fetchDashboardData = async () => {
    try {
      await Promise.all([
        fetchData('users', '/api/users/getUsers'),
        fetchData('posts', '/api/post'),
        fetchData('comments', '/api/comment/getComments'), // Updated endpoint
        fetchData('services', '/api/services'),
        fetchData('courses', '/api/courses')
      ]);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    }
  };

  const fetchData = async (type, endpoint) => {
    try {
      setError(prev => ({...prev, [type]: null}));
      setLoading(prev => ({...prev, [type]: true}));
      
      const { limit, page } = pagination[type];
      const res = await fetch(`${endpoint}?limit=${limit}&page=${page}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (res.status === 401) {
        handleSessionExpired();
        return;
      }
      
      const response = await res.json();
      
      if (!res.ok) {
        throw new Error(response.message || `Failed to fetch ${type}`);
      }

      const responseData = response[type] || response.users || response.posts || 
                         response.comments || response.services || response.courses || 
                         response.data || [];

      setData(prev => ({
        ...prev,
        [type]: Array.isArray(responseData) ? responseData : []
      }));
    } catch (error) {
      setError(prev => ({
        ...prev, 
        [type]: error.message.includes('Session expired') 
          ? error.message 
          : `Failed to load ${type}. ${error.message}`
      }));
      console.error(`${type} fetch error:`, error.message);
    } finally {
      setLoading(prev => ({...prev, [type]: false}));
    }
  };

  const handleSessionExpired = () => {
    localStorage.clear();
    sessionStorage.clear();
    
    toast.error('Session expired. Please login again.', {
      autoClose: 5000,
      onClose: () => {
        window.location.href = '/sign-in';
      }
    });
  };

  const handleLoadMore = (type) => {
    setPagination(prev => ({
      ...prev,
      [type]: { ...prev[type], limit: prev[type].limit + 5 }
    }));
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 font-medium">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 md:mx-auto">
      {error.users?.includes('Session expired') ? (
        <div className="text-center py-8">
          <p className="text-red-500 font-medium">{error.users}</p>
        </div>
      ) : (
        <DashboardTables 
          data={data} 
          loading={loading} 
          error={error} 
          onLoadMore={handleLoadMore} 
        />
      )}
    </div>
  );
}