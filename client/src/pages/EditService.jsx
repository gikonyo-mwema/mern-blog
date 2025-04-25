import React, { useEffect, useState } from 'react';
import { Button, TextInput, Textarea, Select, Label } from 'flowbite-react';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function EditService() {
  const { currentUser } = useSelector((state) => state.user);
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'assessments',
    features: [''],
    fullDescription: '',
    icon: '📋'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'assessments', label: 'Assessments' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'safeguards', label: 'Safeguards' },
    { value: 'planning', label: 'Planning' },
    { value: 'sustainability', label: 'Sustainability' }
  ];

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/services/${serviceId}`);
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch service');
        }
        
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          features: data.features,
          fullDescription: data.fullDescription,
          icon: data.icon || '📋'
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser?.isAdmin) {
      fetchService();
    }
  }, [serviceId, currentUser]);

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
        throw new Error('Only admins can edit services');
      }

      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update service');
      }
      
      // Redirect to services dashboard on success
      navigate('/dashboard/services');
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
      <p>Loading service data...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard/services">
          <Button outline gradientDuoTone="tealToLime" className="mb-6">
            <HiOutlineArrowLeft className="mr-2" /> Back to Services
          </Button>
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 border border-teal-100">
          <h1 className="text-3xl font-bold text-teal-800 mb-6">Edit Service</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" value="Service Title" />
              <TextInput
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="description" value="Short Description" />
              <Textarea
                id="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="category" value="Category" />
              <Select
                id="category"
                required
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="icon" value="Icon (Emoji)" />
              <TextInput
                id="icon"
                type="text"
                value={formData.icon}
                onChange={handleChange}
                maxLength="2"
              />
            </div>

            <div>
              <Label htmlFor="fullDescription" value="Full Description" />
              <Textarea
                id="fullDescription"
                required
                rows={5}
                value={formData.fullDescription}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Key Features/Benefits" />
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
                {loading ? 'Updating...' : 'Update Service'}
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