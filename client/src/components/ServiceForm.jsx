import React, { useState, useEffect } from 'react';
import { Modal, TextInput, Label, Button, Select, Textarea } from 'flowbite-react';

const categories = [
  { value: 'assessments', label: 'Assessments' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'safeguards', label: 'Safeguards' },
  { value: 'planning', label: 'Planning' },
  { value: 'sustainability', label: 'Sustainability' },
];

export default function ServiceForm({
  show,
  onClose,
  onSubmit,
  formData: initialData = {},
  loading,
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    icon: '📋', // Default icon
  });

  const [fullDescription, setFullDescription] = useState('');
  const [features, setFeatures] = useState(['']);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (show) {
      setFormData({
        title: initialData?.title || '',
        category: initialData?.category || '',
        price: initialData?.price || '',
        description: initialData?.description || '',
        icon: initialData?.icon || '📋',
      });
      setFullDescription(initialData?.fullDescription || '');
      setFeatures(initialData?.features || ['']);
      setErrors({});
    }
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || isNaN(formData.price)) newErrors.price = 'Price must be a number';
    if (!fullDescription) newErrors.fullDescription = 'Full description is required';
    if (features.length === 0 || features.some(f => f.trim() === '')) {
      newErrors.features = 'At least one valid feature is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const serviceData = {
        title: formData.title,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        fullDescription,
        features: features.filter(f => f.trim() !== ''),
        icon: formData.icon,
      };
      
      if (initialData?._id) {
        serviceData._id = initialData._id;
      }
      
      onSubmit(serviceData);
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>
        {initialData?._id ? 'Edit Service' : 'Add New Service'}
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" value="Title" />
            <TextInput
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              color={errors.title ? 'failure' : 'gray'}
              helperText={errors.title}
              required
            />
          </div>

          <div>
            <Label htmlFor="category" value="Category" />
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              color={errors.category ? 'failure' : 'gray'}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price" value="Price (KES)" />
            <TextInput
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              color={errors.price ? 'failure' : 'gray'}
              helperText={errors.price}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" value="Short Description" />
            <TextInput
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description"
              required
            />
          </div>

          <div>
            <Label htmlFor="icon" value="Icon (Emoji)" />
            <TextInput
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="e.g. 🎨"
              required
            />
          </div>

          <div>
            <Label htmlFor="fullDescription" value="Full Description" />
            <Textarea
              id="fullDescription"
              name="fullDescription"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              rows={4}
              color={errors.fullDescription ? 'failure' : 'gray'}
              helperText={errors.fullDescription}
              required
            />
          </div>

          <div>
            <Label value="Features" />
            {errors.features && (
              <p className="text-sm text-red-600">{errors.features}</p>
            )}
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <TextInput
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...features];
                    newFeatures[index] = e.target.value;
                    setFeatures(newFeatures);
                  }}
                  className="flex-1"
                  required
                />
                <Button
                  color="failure"
                  size="xs"
                  onClick={() =>
                    setFeatures(features.filter((_, i) => i !== index))
                  }
                  disabled={features.length <= 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              gradientMonochrome="info"
              size="xs"
              onClick={() => setFeatures([...features, ''])}
              className="mt-2"
            >
              Add Feature
            </Button>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          onClick={handleSubmit} 
          isProcessing={loading}
          gradientDuoTone="purpleToBlue"
        >
          {initialData?._id ? 'Update Service' : 'Create Service'}
        </Button>
        <Button color="gray" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}