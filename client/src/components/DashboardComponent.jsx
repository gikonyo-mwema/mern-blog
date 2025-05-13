import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Table, Spinner } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
  HiOutlineClipboardCheck,
  HiAcademicCap,
  HiCurrencyDollar
} from "react-icons/hi";

const SidebarComponent = ({ tab, setTab }) => {
  return (
    <div className="flex flex-col p-3 border-r border-gray-200 h-full">
      {/* ... existing tabs ... */}
      <button
        onClick={() => setTab('courses')}
        className={`p-3 text-left rounded-lg transition-colors ${
          tab === 'courses'
            ? 'bg-teal-100 text-teal-800'
            : 'hover:bg-gray-100'
        }`}
      >
        My Courses
      </button>
    </div>
  );
};

export default function DashboardComponent() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [services, setServices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [popularCourses, setPopularCourses] = useState([]);
  
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthServices, setLastMonthServices] = useState(0);
  const [lastMonthCourses, setLastMonthCourses] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);

  const [loading, setLoading] = useState({
    users: true,
    posts: true,
    comments: true,
    services: true,
    courses: true,
    metrics: true
  });

  const [error, setError] = useState({
    users: null,
    posts: null,
    comments: null,
    services: null,
    courses: null,
    metrics: null
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
    const fetchUsers = async () => {
      try {
        setError(prev => ({...prev, users: null}));
        const { limit, page } = pagination.users;
        const res = await fetch(`/api/user/getUsers?limit=${limit}&page=${page}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        } else {
          throw new Error(data.message || 'Failed to fetch users');
        }
      } catch (error) {
        setError(prev => ({...prev, users: error.message}));
        console.error(error.message);
      } finally {
        setLoading(prev => ({...prev, users: false}));
      }
    };

    const fetchPosts = async () => {
      try {
        setError(prev => ({...prev, posts: null}));
        const { limit, page } = pagination.posts;
        const res = await fetch(`/api/post/getPosts?limit=${limit}&page=${page}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        setError(prev => ({...prev, posts: error.message}));
        console.error("Error fetching posts:", error.message);
      } finally {
        setLoading(prev => ({...prev, posts: false}));
      }
    };

    const fetchComments = async () => {
      try {
        setError(prev => ({...prev, comments: null}));
        const { limit, page } = pagination.comments;
        const res = await fetch(`/api/comment/getComments?limit=${limit}&page=${page}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        } else {
          throw new Error(data.message || 'Failed to fetch comments');
        }
      } catch (error) {
        setError(prev => ({...prev, comments: error.message}));
        console.error(error.message);
      } finally {
        setLoading(prev => ({...prev, comments: false}));
      }
    };

    const fetchServices = async () => {
      try {
        setError(prev => ({...prev, services: null}));
        const { limit, page } = pagination.services;
        const res = await fetch(`/api/services?limit=${limit}&page=${page}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setServices(data.services);
          setTotalServices(data.totalServices);
          setLastMonthServices(data.lastMonthServices);
        } else {
          throw new Error(data.message || 'Failed to fetch services');
        }
      } catch (error) {
        setError(prev => ({...prev, services: error.message}));
        console.error("Error fetching services:", error.message);
      } finally {
        setLoading(prev => ({...prev, services: false}));
      }
    };

    const fetchCourses = async () => {
      try {
        setError(prev => ({...prev, courses: null}));
        const { limit, page } = pagination.courses;
        const res = await fetch(`/api/courses?limit=${limit}&page=${page}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setCourses(data.courses);
          setTotalCourses(data.totalCourses);
          setLastMonthCourses(data.lastMonthCourses);
        } else {
          throw new Error(data.message || 'Failed to fetch courses');
        }
      } catch (error) {
        setError(prev => ({...prev, courses: error.message}));
        console.error("Error fetching courses:", error.message);
      } finally {
        setLoading(prev => ({...prev, courses: false}));
      }
    };

    const fetchPaymentMetrics = async () => {
      try {
        setError(prev => ({...prev, metrics: null}));
        const res = await fetch("/api/user/payments/metrics", {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setTotalRevenue(data.totalRevenue);
          setLastMonthRevenue(data.lastMonthRevenue);
          setPopularCourses(data.popularCourses);
        } else {
          throw new Error(data.message || 'Failed to fetch payment metrics');
        }
      } catch (error) {
        setError(prev => ({...prev, metrics: error.message}));
        console.error("Error fetching payment metrics:", error.message);
      } finally {
        setLoading(prev => ({...prev, metrics: false}));
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
      fetchServices();
      fetchCourses();
      fetchPaymentMetrics();
    }
  }, [currentUser, pagination]);

  if (!currentUser?.isAdmin) {
    return <p className="text-center p-4">You do not have permission to view this page.</p>;
  }

  return (
    <div className="p-3 md:mx-auto">
      {/* Overview Cards */}
      <div className="flex-wrap flex gap-4 justify-center">
        {/* Total Users Card */}
        <Link to="/dashboard?tab=users">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
                <p className="text-2xl">{totalUsers}</p>
              </div>
              <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthUsers}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </Link>

        {/* Total Comments Card */}
        <Link to="/dashboard?tab=comments">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
                <p className="text-2xl">{totalComments}</p>
              </div>
              <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthComments}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </Link>

        {/* Total Posts Card */}
        <Link to="/dashboard?tab=posts">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
                <p className="text-2xl">{totalPosts}</p>
              </div>
              <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthPosts}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </Link>

        {/* Total Services Card */}
        <Link to="/dashboard?tab=services">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">Total Services</h3>
                <p className="text-2xl">{totalServices}</p>
              </div>
              <HiOutlineClipboardCheck className="bg-blue-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthServices}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </Link>

        {/* Total Courses Card */}
        <Link to="/dashboard?tab=courses">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">Total Courses</h3>
                <p className="text-2xl">{totalCourses}</p>
              </div>
              <HiAcademicCap className="bg-orange-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                {lastMonthCourses}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </Link>

        {/* Total Revenue Card */}
        <Link to="/dashboard?tab=payments">
          <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between">
              <div>
                <h3 className="text-gray-500 text-md uppercase">Total Revenue</h3>
                <p className="text-2xl">${totalRevenue.toFixed(2)}</p>
              </div>
              <HiCurrencyDollar className="bg-green-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 flex items-center">
                <HiArrowNarrowUp />
                ${lastMonthRevenue.toFixed(2)}
              </span>
              <div className="text-gray-500">Last month</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Data Tables */}
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        {/* Recent Users Table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=users">See all</Link>
            </Button>
          </div>
          {error.users && (
            <div className="text-red-500 p-4 text-center">
              Error loading users: {error.users}
            </div>
          )}
          {loading.users ? (
            <div className="flex justify-center items-center min-h-32">
              <Spinner size="xl" />
            </div>
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>User Image</Table.HeadCell>
                <Table.HeadCell>Username</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {users.map((user) => (
                  <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          <div className="flex justify-center mt-2">
            <Button 
              outline 
              gradientDuoTone="greenToBlue"
              onClick={() => setPagination(prev => ({
                ...prev,
                users: { ...prev.users, limit: prev.users.limit + 5 }
              }))}
            >
              Load More Users
            </Button>
          </div>
        </div>

        {/* Recent Comments Table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=comments">See all</Link>
            </Button>
          </div>
          {error.comments && (
            <div className="text-red-500 p-4 text-center">
              Error loading comments: {error.comments}
            </div>
          )}
          {loading.comments ? (
            <div className="flex justify-center items-center min-h-32">
              <Spinner size="xl" />
            </div>
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Comment Content</Table.HeadCell>
                <Table.HeadCell>Likes</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {comments.map((comment) => (
                  <Table.Row key={comment._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          <div className="flex justify-center mt-2">
            <Button 
              outline 
              gradientDuoTone="greenToBlue"
              onClick={() => setPagination(prev => ({
                ...prev,
                comments: { ...prev.comments, limit: prev.comments.limit + 5 }
              }))}
            >
              Load More Comments
            </Button>
          </div>
        </div>

        {/* Recent Posts Table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=posts">See all</Link>
            </Button>
          </div>
          {error.posts && (
            <div className="text-red-500 p-4 text-center">
              Error loading posts: {error.posts}
            </div>
          )}
          {loading.posts ? (
            <div className="flex justify-center items-center min-h-32">
              <Spinner size="xl" />
            </div>
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Post Image</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {posts.map((post) => (
                  <Table.Row key={post._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt="post"
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{post.title}</Table.Cell>
                    <Table.Cell>{post.category}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          <div className="flex justify-center mt-2">
            <Button 
              outline 
              gradientDuoTone="greenToBlue"
              onClick={() => setPagination(prev => ({
                ...prev,
                posts: { ...prev.posts, limit: prev.posts.limit + 5 }
              }))}
            >
              Load More Posts
            </Button>
          </div>
        </div>

        {/* Recent Services Table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Services</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=services">See all</Link>
            </Button>
          </div>
          {error.services && (
            <div className="text-red-500 p-4 text-center">
              Error loading services: {error.services}
            </div>
          )}
          {loading.services ? (
            <div className="flex justify-center items-center min-h-32">
              <Spinner size="xl" />
            </div>
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {services.map((service) => (
                  <Table.Row key={service._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{service.title}</Table.Cell>
                    <Table.Cell>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {service.category}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          <div className="flex justify-center mt-2">
            <Button 
              outline 
              gradientDuoTone="greenToBlue"
              onClick={() => setPagination(prev => ({
                ...prev,
                services: { ...prev.services, limit: prev.services.limit + 5 }
              }))}
            >
              Load More Services
            </Button>
          </div>
        </div>

        {/* Recent Courses Table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Courses</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to="/dashboard?tab=courses">See all</Link>
            </Button>
          </div>
          {error.courses && (
            <div className="text-red-500 p-4 text-center">
              Error loading courses: {error.courses}
            </div>
          )}
          {loading.courses ? (
            <div className="flex justify-center items-center min-h-32">
              <Spinner size="xl" />
            </div>
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Course Image</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {courses.map((course) => (
                  <Table.Row key={course._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={course.image}
                        alt="course"
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{course.title}</Table.Cell>
                    <Table.Cell>${course.price}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          <div className="flex justify-center mt-2">
            <Button 
              outline 
              gradientDuoTone="greenToBlue"
              onClick={() => setPagination(prev => ({
                ...prev,
                courses: { ...prev.courses, limit: prev.courses.limit + 5 }
              }))}
            >
              Load More Courses
            </Button>
          </div>
        </div>

        {/* Popular Courses Table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Popular Courses</h1>
          </div>
          {error.metrics && (
            <div className="text-red-500 p-4 text-center">
              Error loading metrics: {error.metrics}
            </div>
          )}
          {loading.metrics ? (
            <div className="flex justify-center items-center min-h-32">
              <Spinner size="xl" />
            </div>
          ) : (
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Course</Table.HeadCell>
                <Table.HeadCell>Purchases</Table.HeadCell>
                <Table.HeadCell>Revenue</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {popularCourses.map((course) => (
                  <Table.Row key={course._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>{course.title}</Table.Cell>
                    <Table.Cell>{course.purchaseCount}</Table.Cell>
                    <Table.Cell>${course.totalRevenue.toFixed(2)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}