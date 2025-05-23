import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardMetrics from "./DashMetrics";
import DashboardTables from "./DashTables";

export default function DashboardComponent() {
  const [metrics, setMetrics] = useState({
    users: [], comments: [], posts: [], services: [], courses: [], popularCourses: [],
    totals: {
      users: 0, posts: 0, comments: 0, services: 0, courses: 0, revenue: 0
    },
    lastMonth: {
      users: 0, posts: 0, comments: 0, services: 0, courses: 0, revenue: 0
    }
  });
  
  const [loading, setLoading] = useState({
    users: true, posts: true, comments: true, 
    services: true, courses: true, metrics: true
  });

  const [error, setError] = useState({
    users: null, posts: null, comments: null, 
    services: null, courses: null, metrics: null
  });

  const [pagination, setPagination] = useState({
    users: { limit: 5, page: 1 },
    posts: { limit: 5, page: 1 },
    comments: { limit: 5, page: 1 },
    services: { limit: 5, page: 1 },
    courses: { limit: 5, page: 1 }
  });

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    fetchDashboardData();
  }, [currentUser, pagination]);

  const fetchDashboardData = async () => {
    try {
      await Promise.all([
        fetchData('users', '/api/users'),
        fetchData('posts', '/api/post'),
        fetchData('comments', '/api/comments'),
        fetchData('services', '/api/services'),
        fetchData('courses', '/api/courses'),
        fetchMetrics()
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
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || `Failed to fetch ${type}`);

      setMetrics(prev => ({
        ...prev,
        [type]: data[type] || [],
        totals: { ...prev.totals, [type]: data[`total${type.charAt(0).toUpperCase() + type.slice(1)}`] || 0 },
        lastMonth: { ...prev.lastMonth, [type]: data[`lastMonth${type.charAt(0).toUpperCase() + type.slice(1)}`] || 0 }
      }));
    } catch (error) {
      setError(prev => ({...prev, [type]: error.message}));
      console.error(`${type} fetch error:`, error.message);
    } finally {
      setLoading(prev => ({...prev, [type]: false}));
    }
  };

  const fetchMetrics = async () => {
    try {
      setError(prev => ({...prev, metrics: null}));
      setLoading(prev => ({...prev, metrics: true}));
      
      const res = await fetch("/api/users/payments/metrics", {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${currentUser.token}` }
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to fetch payment metrics');

      setMetrics(prev => ({
        ...prev,
        popularCourses: data.popularCourses || [],
        totals: { ...prev.totals, revenue: data.totalRevenue || 0 },
        lastMonth: { ...prev.lastMonth, revenue: data.lastMonthRevenue || 0 }
      }));
    } catch (error) {
      setError(prev => ({...prev, metrics: error.message}));
      console.error("Payment metrics fetch error:", error.message);
    } finally {
      setLoading(prev => ({...prev, metrics: false}));
    }
  };

  const handleLoadMore = (type) => {
    setPagination(prev => ({
      ...prev,
      [type]: { ...prev[type], limit: prev[type].limit + 5 }
    }));
  };

  if (!currentUser?.isAdmin) {
    return <p className="text-center p-4">You do not have permission to view this page.</p>;
  }

  return (
    <div className="p-3 md:mx-auto">
      <DashboardMetrics 
        totals={metrics.totals} 
        lastMonth={metrics.lastMonth} 
      />
      <DashboardTables 
        data={metrics} 
        loading={loading} 
        error={error} 
        onLoadMore={handleLoadMore} 
      />
    </div>
  );
}