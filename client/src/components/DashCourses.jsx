import React, { useState, useEffect } from 'react';
import { Button, TextInput, Textarea, Select, Label, Table, Modal, Checkbox } from 'flowbite-react';
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlinePencilAlt, HiOutlineExclamationCircle, HiOutlineCreditCard } from 'react-icons/hi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// CreateCourse component
export function CreateCourse() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    isPopular: false,
    paymentOption: '',
    features: [''],
    cta: 'Enroll Now',
    description: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [id]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureField = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (!currentUser.isAdmin) throw new Error('Only admins can create courses');

      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create course');

      navigate('/dashboard?tab=courses');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser?.isAdmin) {
    return <Unauthorized />;
  }

  return (
    <CourseForm
      formData={formData}
      error={error}
      loading={loading}
      handleChange={handleChange}
      handleFeatureChange={handleFeatureChange}
      addFeatureField={addFeatureField}
      removeFeatureField={removeFeatureField}
      handleSubmit={handleSubmit}
      title="Create New Course"
      submitButtonText="Create Course"
      isEdit={false}
    />
  );
}

// EditCourse component
export function EditCourse() {
  const { currentUser } = useSelector((state) => state.user);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    isPopular: false,
    paymentOption: '',
    features: [''],
    cta: 'Enroll Now',
    description: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch course');

        setFormData({
          title: data.title,
          price: data.price,
          isPopular: data.isPopular || false,
          paymentOption: data.paymentOption || '',
          features: data.features || [''],
          cta: data.cta || 'Enroll Now',
          description: data.description || ''
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) fetchCourse();
  }, [courseId, currentUser]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [id]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeatureField = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeatureField = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (!currentUser.isAdmin) throw new Error('Only admins can edit courses');

      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update course');

      navigate('/dashboard?tab=courses');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser?.isAdmin) {
    return <Unauthorized />;
  }

  if (loading && !formData.title) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading course data...</p>
      </div>
    );
  }

  return (
    <CourseForm
      formData={formData}
      error={error}
      loading={loading}
      handleChange={handleChange}
      handleFeatureChange={handleFeatureChange}
      addFeatureField={addFeatureField}
      removeFeatureField={removeFeatureField}
      handleSubmit={handleSubmit}
      title="Edit Course"
      submitButtonText="Update Course"
      isEdit={true}
    />
  );
}

// DashCourses component
export function DashCourses() {
  const { currentUser } = useSelector((state) => state.user);
  const [courses, setCourses] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [courseIdToDelete, setCourseIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (res.ok) {
          setCourses(data.courses || data);
          if ((data.courses || data).length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.isAdmin) fetchCourses();
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = courses.length;
    try {
      const res = await fetch(`/api/courses?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setCourses((prev) => [...prev, ...(data.courses || data)]);
        if ((data.courses || data).length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteCourse = async () => {
    try {
      const res = await fetch(`/api/courses/${courseIdToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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

      {/* Payment Modal would be rendered here */}
      {/* <PaymentModal
        showModal={showPaymentModal}
        setShowModal={setShowPaymentModal}
        item={selectedCourse}
        itemType="course"
        onPaymentSuccess={() => {
          console.log('Payment successful for course:', selectedCourse?.title);
        }}
      /> */}
    </div>
  );
}

// Reusable components
function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">You are not authorized to view this page</p>
    </div>
  );
}

function CourseForm({ 
  formData, 
  handleChange, 
  handleFeatureChange, 
  addFeatureField, 
  removeFeatureField, 
  handleSubmit, 
  error, 
  loading, 
  title, 
  submitButtonText, 
  isEdit 
}) {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard?tab=courses">
          <Button outline gradientDuoTone="tealToLime" className="mb-6">
            <HiOutlineArrowLeft className="mr-2" /> Back to Courses
          </Button>
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 border border-teal-100">
          <h1 className="text-3xl font-bold text-teal-800 mb-6">{title}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" value="Course Title" />
              <TextInput
                id="title"
                type="text"
                placeholder="Enter course title"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="price" value="Price" />
              <TextInput
                id="price"
                type="number"
                placeholder="Enter price"
                required
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                placeholder="Enter course description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
              />
              <Label htmlFor="isPopular">Mark as Popular Course</Label>
            </div>

            <div>
              <Label htmlFor="paymentOption" value="Payment Option" />
              <Select
                id="paymentOption"
                value={formData.paymentOption}
                onChange={handleChange}
              >
                <option value="">Select payment option</option>
                <option value="one-time">One-time Payment</option>
                <option value="subscription">Subscription</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="cta" value="Call to Action Text" />
              <TextInput
                id="cta"
                type="text"
                placeholder="Enter CTA text"
                value={formData.cta}
                onChange={handleChange}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label value="Course Features" />
                <Button
                  type="button"
                  outline
                  gradientDuoTone="tealToLime"
                  size="xs"
                  onClick={addFeatureField}
                >
                  <HiOutlinePlus className="mr-1" /> Add Feature
                </Button>
              </div>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <TextInput
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      color="failure"
                      size="xs"
                      onClick={() => removeFeatureField(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              gradientDuoTone="tealToLime"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : submitButtonText}
            </Button>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}