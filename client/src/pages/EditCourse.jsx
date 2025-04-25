import React, { useEffect, useState } from 'react';
import { Button, TextInput, Textarea, Select, Label } from 'flowbite-react';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function EditCourse() {
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
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch course');
        }
        
        setFormData({
          title: data.title,
          price: data.price,
          isPopular: data.isPopular || false,
          paymentOption: data.paymentOption || '',
          features: data.features,
          cta: data.cta || 'Enroll Now',
          description: data.description || ''
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.isAdmin) {
      fetchCourse();
    }
  }, [courseId, currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const addFeatureField = () => {
    setFormData({
      ...formData,
      features: [...formData.features, '']
    });
  };

  const removeFeatureField = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      features: newFeatures
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      if (!currentUser.isAdmin) {
        throw new Error('Only admins can edit courses');
      }

      const res = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update course');
      }
      
      navigate('/dashboard?tab=courses');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser?.isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">You are not authorized to view this page</p>
    </div>;
  }

  if (loading && !formData.title) {
    return <div className="min-h-screen flex items-center justify-center">
      <p>Loading course data...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard?tab=courses">
          <Button outline gradientDuoTone="tealToLime" className="mb-6">
            <HiOutlineArrowLeft className="mr-2" /> Back to Courses
          </Button>
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 border border-teal-100">
          <h1 className="text-3xl font-bold text-teal-800 mb-6">Edit Course</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" value="Course Title" />
              <TextInput
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" value="Price" />
                <TextInput
                  id="price"
                  type="text"
                  required
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="paymentOption" value="Payment Option (Optional)" />
                <TextInput
                  id="paymentOption"
                  type="text"
                  value={formData.paymentOption}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="cta" value="Call-to-Action Text" />
              <TextInput
                id="cta"
                type="text"
                value={formData.cta}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isPopular"
                type="checkbox"
                className="w-4 h-4"
                checked={formData.isPopular}
                onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
              />
              <Label htmlFor="isPopular" value="Mark as Popular" />
            </div>

            <div>
              <Label value="Features" />
              {formData.features.map((feature, index) => (
                <div key={index} className="flex mb-2">
                  <TextInput
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    className="flex-grow"
                    placeholder={`Feature ${index + 1}`}
                    required
                  />
                  {formData.features.length > 1 && (
                    <Button
                      color="failure"
                      size="sm"
                      className="ml-2"
                      onClick={() => removeFeatureField(index)}
                      type="button"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                outline
                gradientDuoTone="tealToLime"
                size="sm"
                onClick={addFeatureField}
                type="button"
              >
                Add Feature
              </Button>
            </div>

            <div className="flex justify-end">
              <Button
                gradientDuoTone="tealToLime"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Course'}
              </Button>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2">{error}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}