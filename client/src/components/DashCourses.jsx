import { Table, Modal, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle, HiOutlinePencilAlt, HiOutlinePlus } from 'react-icons/hi';

export default function DashCourses() {
  const { currentUser } = useSelector((state) => state.user);
  const [courses, setCourses] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [courseIdToDelete, setCourseIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (res.ok) {
          setCourses(data.courses || data);
          if (data.courses && data.courses.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.isAdmin) {
      fetchCourses();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = courses.length;
    try {
      const res = await fetch(`/api/courses?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setCourses((prev) => [...prev, ...data.courses]);
        if (data.courses.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setCourses((prev) => prev.filter((course) => course._id !== courseIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!currentUser?.isAdmin) {
    return <p>You are not authorized to view this content.</p>;
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Courses</h2>
        <Link to="/create-course">
          <Button gradientDuoTone="tealToLime">
            <HiOutlinePlus className="mr-2" />
            Add New Course
          </Button>
        </Link>
      </div>

      {loading ? (
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
                <Table.Row key={course._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {course.title}
                  </Table.Cell>
                  <Table.Cell>{course.price}</Table.Cell>
                  <Table.Cell>
                    {course.isPopular ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Popular
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
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
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No courses found. Create your first course!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this course?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteCourse}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}