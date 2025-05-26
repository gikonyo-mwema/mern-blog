import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CourseForm } from './CourseForm';
import { useCourseForm } from './useCourseForm';
import { Unauthorized } from './Unauthorized';

export const CreateCourse = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const {
    formData,
    error,
    loading,
    handleChange,
    handleFeatureChange,
    addFeatureField,
    removeFeatureField,
    setError,
    setLoading
  } = useCourseForm({
    title: '',
    price: '',
    isPopular: false,
    paymentOption: '',
    features: [''],
    cta: 'Enroll Now',
    description: ''
  });

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
    />
  );
};