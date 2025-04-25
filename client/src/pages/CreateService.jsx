import React, { useState } from 'react';
import { Button, TextInput, Textarea, Select, Label } from 'flowbite-react';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CreateService() {
  const { currentUser } = useSelector((state) => state.user);
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
        throw new Error('Only admins can create services');
      }

      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create service');
      }
      
      // Redirect to services dashboard on success
      window.location.href = '/dashboard/services';
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/dashboard/services">
          <Button outline gradientDuoTone="tealToLime" className="mb-6">
            <HiOutlineArrowLeft className="mr-2" /> Back to Services
          </Button>
        </Link>

        <div className="bg-white rounded-xl shadow-md p-8 border border-teal-100">
          <h1 className="text-3xl font-bold text-teal-800 mb-6">Create New Service</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" value="Service Title" />
              <TextInput
                id="title"
                type="text"
                placeholder="Project Environmental Impact Assessments"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="description" value="Short Description" />
              <Textarea
                id="description"
                placeholder="Brief description that appears on service cards"
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
                placeholder="📋"
                value={formData.icon}
                onChange={handleChange}
                maxLength="2"
              />
            </div>

            <div>
              <Label htmlFor="fullDescription" value="Full Description" />
              <Textarea
                id="fullDescription"
                placeholder="Detailed description for the service page"
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
                {loading ? 'Creating...' : 'Create Service'}
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