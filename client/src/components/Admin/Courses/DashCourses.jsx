import React, { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'flowbite-react';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineExclamationCircle, HiOutlineCreditCard } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Unauthorized } from './Unauthorized'; 

export const DashCourses = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [courses, setCourses] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [courseIdToDelete, setCourseIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchCourses = async (startIndex = 0) => {
    try {
      setLoading(true);
      const url = startIndex > 0 
        ? `/api/courses?startIndex=${startIndex}`
        : '/api/courses';
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        if (startIndex > 0) {
          setCourses(prev => [...prev, ...(data.courses || data)]);
        } else {
          setCourses(data.courses || data);
        }
        setShowMore((data.courses || data).length >= 9);
      }
    } catch (error) {
      console.error('Error fetching courses:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.isAdmin) fetchCourses();
  }, [currentUser]);

  const handleShowMore = () => {
    fetchCourses(courses.length);
  };

  const handleDeleteCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseIdToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCourses(prev => prev.filter(course => course._id !== courseIdToDelete));
        setShowModal(false);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting course:', error.message);
    }
  };

  const handlePaymentClick = (course) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
  };

  if (!currentUser?.isAdmin) {
    return <Unauthorized />;
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Courses</h2>
        <Link to="/create-course">
          <Button gradientDuoTone="tealToLime">
            <HiOutlinePlus className="mr-2" />
            Add New Course
          </Button>
        </Link>
      </div>

      {loading && courses.length === 0 ? (
        <p>Loading courses...</p>
      ) : courses.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Popular</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {courses.map((course) => (
                <Table.Row key={course._id}>
                  <Table.Cell>{course.title}</Table.Cell>
                  <Table.Cell>${course.price}</Table.Cell>
                  <Table.Cell>{course.isPopular ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Link to={`/edit-course/${course._id}`}>
                        <Button outline gradientDuoTone="tealToLime" size="xs">
                          <HiOutlinePencilAlt className="mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        outline
                        gradientDuoTone="pinkToOrange"
                        size="xs"
                        onClick={() => {
                          setShowModal(true);
                          setCourseIdToDelete(course._id);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        outline
                        gradientDuoTone="purpleToBlue"
                        size="xs"
                        onClick={() => handlePaymentClick(course)}
                      >
                        <HiOutlineCreditCard className="mr-1" />
                        Test Payment
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button 
              onClick={handleShowMore} 
              className="w-full text-teal-500 py-7 text-sm"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No courses found. Create your first course!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mx-auto mb-4" />
            <h3 className="mb-5 text-lg text-gray-500">Are you sure you want to delete this course?</h3>
            <div className="flex justify-center gap-4">
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button color="failure" onClick={handleDeleteCourse}>
                Delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};


