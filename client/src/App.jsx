import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute';
import CreatePost from './pages/CreatePost';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import ScrollToTop from './components/ScrollToTop';
import Search from './pages/Search';
import ThemeProvider from './components/ThemeProvider';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail'; // ✅ Added import
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import UserCourses from './components/UserCourses';
import { CreateCourse } from './components/Admin/Courses/CreateCourse';
import { EditCourse } from './components/Admin/Courses/EditCourse';
import DashServices from './components/Admin/Services/DashServices';
import Contact from './pages/Contact'; 

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <ScrollToTop />
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Services />} />
          <Route path='/services/:id' element={<ServiceDetail />} /> {/* ✅ Added Route */}
          <Route path='/courses' element={<Courses />} />
          <Route path='/courses/:slug' element={<CourseDetails />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/search' element={<Search />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/post/:postSlug' element={<PostPage />} />
           <Route path="/contact" element={<Contact />} />

          {/* Authenticated User Routes */}
          <Route element={<PrivateRoute />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/my-courses' element={<UserCourses />} />
          </Route>

          {/* Admin-only Routes */}
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/update-post/:postId' element={<UpdatePost />} />
            <Route path='/dashboard/services' element={<DashServices />} />
            <Route path='/create-course' element={<CreateCourse />} />
            <Route path='/edit-course/:courseId' element={<EditCourse />} />
          </Route>
        </Routes>
        <Footer />
      </ThemeProvider>
    </Router>
  );
}
