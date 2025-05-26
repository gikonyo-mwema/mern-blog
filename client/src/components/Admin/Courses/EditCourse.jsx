import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseForm } from './CourseForm';
import { useCourseForm } from './useCourseForm';
import { Unauthorized } from './Unauthorized';

export const EditCourse = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    error,
    setError,
    loading,
    setLoading,
    handleChange,
    handleFeatureChange,
    addFeatureField,
    removeFeatureField
  } = useCourseForm({
    title: '',
    price: '',
    isPopular: false,
    paymentOption: '',
    features: [''],
    cta: 'Enroll Now',
    description: ''
  });

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
  }, [courseId, currentUser, setFormData, setError, setLoading]);

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
    />
  );
};