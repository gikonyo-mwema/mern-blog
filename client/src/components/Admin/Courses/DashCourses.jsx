import React, { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'flowbite-react';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineExclamationCircle } from 'react-icons/hi';
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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      const data = await res.json();
      
      if (res.ok) {
        setCourses(prev => prev.filter(course => course._id !== courseIdToDelete));
        setShowModal(false);
      } else {
        throw new Error(data.message || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error.message);
    }
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-gray-500">Loading courses...</div>
        </div>
      ) : courses.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Slug</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Popular</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {courses.map((course) => (
                <Table.Row key={course._id} className="hover:bg-gray-50">
                  <Table.Cell className="font-medium text-gray-900">
                    {course.title}
                  </Table.Cell>
                  <Table.Cell className="font-mono text-sm text-gray-700">
                    {course.slug}
                  </Table.Cell>
                  <Table.Cell>
                    {course.price?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'KES'
                    })}
                  </Table.Cell>
                  <Table.Cell>
                    {course.isPopular ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Popular
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Standard
                      </span>
                    )}
                  </Table.Cell>
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
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 py-7 text-sm hover:text-teal-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Show more'}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No courses found</p>
          <Link to="/create-course">
            <Button gradientDuoTone="tealToLime">
              Create Your First Course
            </Button>
          </Link>
        </div>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <Modal.Header className="border-b-0 pb-0">
          Confirm Deletion
        </Modal.Header>
        <Modal.Body className="pt-4">
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="mb-5 text-lg font-normal text-gray-500">
              Are you sure you want to delete this course?
            </h3>
            <div className="flex justify-center gap-4">
              <Button 
                color="gray" 
                onClick={() => setShowModal(false)}
                className="px-5"
              >
                Cancel
              </Button>
              <Button 
                color="failure" 
                onClick={handleDeleteCourse}
                className="px-5"
              >
                Yes, delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};