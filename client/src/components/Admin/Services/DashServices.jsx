import React, { useState, useEffect } from 'react';
import { 
  Table, Modal, Button, TextInput, Textarea, Select, Label, Alert, 
  Badge, Tabs, Tab, Spinner
} from 'flowbite-react';
import { 
  HiOutlineExclamationCircle, HiOutlinePencilAlt, HiOutlinePlus, 
  HiOutlineTrash, HiOutlineCheckCircle, HiOutlineXCircle,
  HiOutlineCreditCard, HiOutlineCheck
} from 'react-icons/hi';
import { useSelector } from 'react-redux';
import axios from 'axios';
import PaymentModal from '../components/PaymentModal';

const ServiceCard = ({ service, onPurchaseClick }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-teal-100 dark:border-gray-700 transition-all hover:shadow-lg dark:hover:shadow-gray-700/50 h-full flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex justify-center text-4xl mb-3 text-teal-600 dark:text-teal-400">
          {service.icon || '📋'}
        </div>
        <h3 className="text-xl font-bold text-teal-800 dark:text-teal-300 mb-3 text-center">
          {service.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-center line-clamp-3">
          {service.shortDescription || service.description}
        </p>
        {service.price > 0 && (
          <div className="text-center font-bold text-lg mb-4 text-green-700 dark:text-green-400">
            KES {service.price.toLocaleString()}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <Button 
          outline 
          gradientDuoTone="tealToLime" 
          size="sm" 
          className="w-full"
          onClick={() => onPurchaseClick(service)}
        >
          Learn More
        </Button>
      </div>
    </div>
  );
};

export default function DashServices() {
  const { currentUser } = useSelector((state) => state.user);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState({
    table: true,
    operation: false
  });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const [selectedService, setSelectedService] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'assessments',
    features: [''],
    fullDescription: '',
    heroText: '',
    introduction: '',
    icon: '📋',
    price: 0,
    processSteps: [{ title: '', description: '' }],
    projectTypes: [''],
    benefits: [{ title: '', description: '' }],
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    },
    socialLinks: [{ platform: '', url: '' }],
    calendlyLink: '',
    isFeatured: false,
    image: ''
  });

  const categories = [
    { value: 'assessments', label: 'Assessments' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'safeguards', label: 'Safeguards' },
    { value: 'planning', label: 'Planning' },
    { value: 'sustainability', label: 'Sustainability' }
  ];

  const socialPlatforms = [
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' }
  ];

  useEffect(() => {
    if (currentUser?.isAdmin) {
      fetchServices();
    }
  }, [currentUser]);

  const showAlert = (message, type = 'success', duration = 5000) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ ...alert, show: false }), duration);
  };

  const fetchServices = async () => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      const { data } = await axios.get('/api/services', {
        withCredentials: true
      });
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      showAlert(`Failed to load services: ${err.response?.data?.message || err.message}`, 'failure');
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  };

  const handlePurchaseClick = (service) => {
    setSelectedService(service);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    showAlert(`Payment successful for: ${selectedService.title}`);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription,
      category: service.category,
      features: service.features || [''],
      fullDescription: service.fullDescription,
      heroText: service.heroText,
      introduction: service.introduction,
      icon: service.icon || '📋',
      price: service.price || 0,
      processSteps: service.processSteps || [{ title: '', description: '' }],
      projectTypes: service.projectTypes || [''],
      benefits: service.benefits || [{ title: '', description: '' }],
      contactInfo: service.contactInfo || {
        email: '',
        phone: '',
        website: ''
      },
      socialLinks: service.socialLinks || [{ platform: '', url: '' }],
      calendlyLink: service.calendlyLink,
      isFeatured: service.isFeatured || false,
      image: service.image || ''
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setServiceToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(prev => ({ ...prev, operation: true }));
      await axios.delete(`/api/services/${serviceToDelete}`, {
        withCredentials: true
      });
      
      setServices(services.filter(s => s._id !== serviceToDelete));
      setShowDeleteModal(false);
      showAlert('Service deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      showAlert(`Delete failed: ${error.response?.data?.message || error.message}`, 'failure');
    } finally {
      setLoading(prev => ({ ...prev, operation: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
  };

  const handleProcessStepChange = (index, field, value) => {
    const newSteps = [...formData.processSteps];
    newSteps[index][field] = value;
    setFormData(prev => ({ ...prev, processSteps: newSteps }));
  };

  const addProcessStep = () => {
    setFormData(prev => ({
      ...prev,
      processSteps: [...prev.processSteps, { title: '', description: '' }]
    }));
  };

  const removeProcessStep = (index) => {
    if (formData.processSteps.length > 1) {
      setFormData(prev => ({
        ...prev,
        processSteps: prev.processSteps.filter((_, i) => i !== index)
      }));
    }
  };

  const handleProjectTypeChange = (index, value) => {
    const newTypes = [...formData.projectTypes];
    newTypes[index] = value;
    setFormData(prev => ({ ...prev, projectTypes: newTypes }));
  };

  const addProjectType = () => {
    setFormData(prev => ({
      ...prev,
      projectTypes: [...prev.projectTypes, '']
    }));
  };

  const removeProjectType = (index) => {
    if (formData.projectTypes.length > 1) {
      setFormData(prev => ({
        ...prev,
        projectTypes: prev.projectTypes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleBenefitChange = (index, field, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index][field] = value;
    setFormData(prev => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, { title: '', description: '' }]
    }));
  };

  const removeBenefit = (index) => {
    if (formData.benefits.length > 1) {
      setFormData(prev => ({
        ...prev,
        benefits: prev.benefits.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index) => {
    if (formData.features.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSocialLinkChange = (index, field, value) => {
    const newLinks = [...formData.socialLinks];
    newLinks[index][field] = value;
    setFormData(prev => ({ ...prev, socialLinks: newLinks }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
    }));
  };

  const removeSocialLink = (index) => {
    if (formData.socialLinks.length > 1) {
      setFormData(prev => ({
        ...prev,
        socialLinks: prev.socialLinks.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    if (isNaN(formData.price)) errors.price = 'Price must be a number';
    if (formData.price < 0) errors.price = 'Price cannot be negative';
    
    formData.processSteps.forEach((step, index) => {
      if (!step.title.trim()) errors[`processStepTitle${index}`] = 'Step title is required';
      if (!step.description.trim()) errors[`processStepDesc${index}`] = 'Step description is required';
    });
    
    formData.projectTypes.forEach((type, index) => {
      if (!type.trim()) errors[`projectType${index}`] = 'Project type is required';
    });
    
    formData.benefits.forEach((benefit, index) => {
      if (!benefit.title.trim()) errors[`benefitTitle${index}`] = 'Benefit title is required';
      if (!benefit.description.trim()) errors[`benefitDesc${index}`] = 'Benefit description is required';
    });
    
    if (formData.features.length === 0 || formData.features.some(f => !f.trim())) {
      errors.features = 'At least one feature is required';
    }
    
    if (formData.contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (formData.contactInfo.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.contactInfo.phone)) {
      errors.phone = 'Invalid phone number';
    }
    
    formData.socialLinks.forEach((link, index) => {
      if (link.platform && !link.url) {
        errors[`socialUrl${index}`] = 'URL is required when platform is selected';
      }
    });
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      showAlert('Please fix the form errors', 'failure');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, operation: true }));
      
      const config = {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      };

      const url = editMode 
        ? `/api/services/${currentService._id}`
        : '/api/services';
      
      const { data } = editMode 
        ? await axios.put(url, formData, config)
        : await axios.post(url, formData, config);

      if (editMode) {
        setServices(services.map(s => s._id === currentService._id ? data : s));
        showAlert('Service updated successfully');
      } else {
        setServices([...services, data]);
        showAlert('Service created successfully');
      }

      setShowModal(false);
    } catch (error) {
      console.error('Operation failed:', error);
      showAlert(`Error: ${error.response?.data?.message || error.message}`, 'failure');
    } finally {
      setLoading(prev => ({ ...prev, operation: false }));
    }
  };

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">You are not authorized to view this content.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 relative">
      {/* Alert Notification */}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Alert 
            color={alert.type}
            icon={alert.type === 'success' ? HiOutlineCheckCircle : HiOutlineXCircle}
            onDismiss={() => setAlert({ ...alert, show: false })}
          >
            {alert.message}
          </Alert>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Services</h2>
        <Button 
          gradientDuoTone="tealToLime" 
          onClick={() => {
            setEditMode(false);
            setFormData({
              title: '',
              description: '',
              shortDescription: '',
              category: 'assessments',
              features: [''],
              fullDescription: '',
              heroText: '',
              introduction: '',
              icon: '📋',
              price: 0,
              processSteps: [{ title: '', description: '' }],
              projectTypes: [''],
              benefits: [{ title: '', description: '' }],
              contactInfo: {
                email: '',
                phone: '',
                website: ''
              },
              socialLinks: [{ platform: '', url: '' }],
              calendlyLink: '',
              isFeatured: false,
              image: ''
            });
            setShowModal(true);
          }}
          disabled={loading.operation}
        >
          <HiOutlinePlus className="mr-2" />
          Add Service
        </Button>
      </div>

      {loading.table ? (
        <div className="flex justify-center py-12">
          <Spinner size="xl" aria-label="Loading services..." />
        </div>
      ) : services.length > 0 ? (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Services Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {services.slice(0, 3).map(service => (
                <ServiceCard 
                  key={service._id} 
                  service={service} 
                  onPurchaseClick={handlePurchaseClick}
                />
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Icon</Table.HeadCell>
                <Table.HeadCell>Title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
                <Table.HeadCell>Featured</Table.HeadCell>
                <Table.HeadCell>Process Steps</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {services.map(service => (
                  <Table.Row key={service._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="text-2xl">
                      {service.icon || '📋'}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {service.title}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color="info" className="w-fit">
                        {service.category}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {service.price ? `KES ${service.price.toLocaleString()}` : 'Free'}
                    </Table.Cell>
                    <Table.Cell>
                      {service.isFeatured ? (
                        <Badge color="success" icon={HiOutlineCheck}>
                          Featured
                        </Badge>
                      ) : (
                        <Badge color="gray">Regular</Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {service.processSteps?.length || 0} steps
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button 
                          outline 
                          gradientDuoTone="purpleToBlue" 
                          size="xs"
                          onClick={() => handleEdit(service)}
                          disabled={loading.operation}
                        >
                          <HiOutlinePencilAlt className="mr-1" />
                          Edit
                        </Button>
                        <Button 
                          outline 
                          gradientDuoTone="pinkToOrange" 
                          size="xs"
                          onClick={() => handleDelete(service._id)}
                          disabled={loading.operation}
                        >
                          <HiOutlineTrash className="mr-1" />
                          Delete
                        </Button>
                        {service.price > 0 && (
                          <Button
                            outline
                            gradientDuoTone="tealToLime"
                            size="xs"
                            onClick={() => handlePurchaseClick(service)}
                          >
                            <HiOutlineCreditCard className="mr-1" />
                            Test
                          </Button>
                        )}
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Alert color="info">
            No services found. Create your first service.
          </Alert>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal show={showModal} onClose={() => !loading.operation && setShowModal(false)} size="6xl">
        <Modal.Header>
          {editMode ? 'Edit Service' : 'Create Service'}
        </Modal.Header>
        <Modal.Body>
          <Tabs.Group
            aria-label="Service form tabs"
            style="underline"
            onActiveTabChange={setActiveTab}
          >
            {/* Basic Info Tab */}
            <Tabs.Item active={activeTab === 'basic'} title="Basic Info">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="title" value="Title*" />
                  <TextInput
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={loading.operation}
                  />
                </div>

                <div>
                  <Label htmlFor="category" value="Category*" />
                  <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={loading.operation}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price" value="Price (KES)*" />
                  <TextInput
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    disabled={loading.operation}
                  />
                </div>

                <div>
                  <Label htmlFor="icon" value="Icon (Emoji)" />
                  <TextInput
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="e.g. 📋"
                    disabled={loading.operation}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description" value="Short Description*" />
                  <TextInput
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={loading.operation}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="shortDescription" value="Summary Description" />
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    rows={2}
                    disabled={loading.operation}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="fullDescription" value="Full Description*" />
                  <Textarea
                    id="fullDescription"
                    name="fullDescription"
                    value={formData.fullDescription}
                    onChange={handleChange}
                    rows={4}
                    required
                    disabled={loading.operation}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="heroText" value="Hero Text" />
                  <TextInput
                    id="heroText"
                    name="heroText"
                    value={formData.heroText}
                    onChange={handleChange}
                    placeholder="Catchy headline for the service page"
                    disabled={loading.operation}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="introduction" value="Introduction Paragraph" />
                  <Textarea
                    id="introduction"
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Introductory text for the service page"
                    disabled={loading.operation}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                    disabled={loading.operation}
                  />
                  <Label htmlFor="isFeatured" value="Featured Service" />
                </div>

                <div>
                  <Label htmlFor="image" value="Image URL" />
                  <TextInput
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={loading.operation}
                  />
                </div>
              </div>
            </Tabs.Item>

            {/* Process Steps Tab */}
            <Tabs.Item active={activeTab === 'process'} title="Process Steps">
              <div className="mt-4 space-y-4">
                <Label value="Our Process Steps*" />
                {formData.processSteps.map((step, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <Label value={`Step ${index + 1} Title*`} />
                        <TextInput
                          value={step.title}
                          onChange={(e) => handleProcessStepChange(index, 'title', e.target.value)}
                          required
                          disabled={loading.operation}
                        />
                      </div>
                      <div className="flex items-end justify-end">
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => removeProcessStep(index)}
                          disabled={loading.operation || formData.processSteps.length <= 1}
                        >
                          <HiOutlineTrash className="mr-1" /> Remove Step
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label value={`Step ${index + 1} Description*`} />
                      <Textarea
                        value={step.description}
                        onChange={(e) => handleProcessStepChange(index, 'description', e.target.value)}
                        rows={3}
                        required
                        disabled={loading.operation}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  gradientMonochrome="info"
                  onClick={addProcessStep}
                  className="mt-2"
                  disabled={loading.operation}
                >
                  <HiOutlinePlus className="mr-2" /> Add Process Step
                </Button>
              </div>
            </Tabs.Item>

            {/* Project Types Tab */}
            <Tabs.Item active={activeTab === 'projects'} title="Project Types">
              <div className="mt-4 space-y-4">
                <Label value="Supported Project Types*" />
                {formData.projectTypes.map((type, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <TextInput
                        value={type}
                        onChange={(e) => handleProjectTypeChange(index, e.target.value)}
                        required
                        disabled={loading.operation}
                      />
                    </div>
                    <Button
                      color="failure"
                      size="xs"
                      onClick={() => removeProjectType(index)}
                      disabled={loading.operation || formData.projectTypes.length <= 1}
                    >
                      <HiOutlineTrash />
                    </Button>
                  </div>
                ))}
                <Button
                  gradientMonochrome="info"
                  onClick={addProjectType}
                  className="mt-2"
                  disabled={loading.operation}
                >
                  <HiOutlinePlus className="mr-2" /> Add Project Type
                </Button>
              </div>
            </Tabs.Item>

            {/* Benefits Tab */}
            <Tabs.Item active={activeTab === 'benefits'} title="Benefits">
              <div className="mt-4 space-y-4">
                <Label value="Service Benefits*" />
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <Label value={`Benefit ${index + 1} Title*`} />
                        <TextInput
                          value={benefit.title}
                          onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                          required
                          disabled={loading.operation}
                        />
                      </div>
                      <div className="flex items-end justify-end">
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => removeBenefit(index)}
                          disabled={loading.operation || formData.benefits.length <= 1}
                        >
                          <HiOutlineTrash className="mr-1" /> Remove Benefit
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label value={`Benefit ${index + 1} Description*`} />
                      <Textarea
                        value={benefit.description}
                        onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                        rows={3}
                        required
                        disabled={loading.operation}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  gradientMonochrome="info"
                  onClick={addBenefit}
                  className="mt-2"
                  disabled={loading.operation}
                >
                  <HiOutlinePlus className="mr-2" /> Add Benefit
                </Button>
              </div>
            </Tabs.Item>

            {/* Features Tab */}
            <Tabs.Item active={activeTab === 'features'} title="Features">
              <div className="mt-4 space-y-4">
                <Label value="Key Features*" />
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="flex-1">
                      <TextInput
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        required
                        disabled={loading.operation}
                      />
                    </div>
                    <Button
                      color="failure"
                      size="xs"
                      onClick={() => removeFeature(index)}
                      disabled={loading.operation || formData.features.length <= 1}
                    >
                      <HiOutlineTrash />
                    </Button>
                  </div>
                ))}
                <Button
                  gradientMonochrome="info"
                  onClick={addFeature}
                  className="mt-2"
                  disabled={loading.operation}
                >
                  <HiOutlinePlus className="mr-2" /> Add Feature
                </Button>
              </div>
            </Tabs.Item>

            {/* Contact & Social Tab */}
            <Tabs.Item active={activeTab === 'contact'} title="Contact & Social">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                </div>

                <div>
                  <Label htmlFor="contactEmail" value="Email" />
                  <TextInput
                    id="contactEmail"
                    name="email"
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={handleContactInfoChange}
                    placeholder="contact@example.com"
                    disabled={loading.operation}
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone" value="Phone" />
                  <TextInput
                    id="contactPhone"
                    name="phone"
                    value={formData.contactInfo.phone}
                    onChange={handleContactInfoChange}
                    placeholder="+254700000000"
                    disabled={loading.operation}
                  />
                </div>

                <div>
                  <Label htmlFor="website" value="Website" />
                  <TextInput
                    id="website"
                    name="website"
                    value={formData.contactInfo.website}
                    onChange={handleContactInfoChange}
                    placeholder="https://example.com"
                    disabled={loading.operation}
                  />
                </div>

                <div>
                  <Label htmlFor="calendlyLink" value="Calendly Link" />
                  <TextInput
                    id="calendlyLink"
                    name="calendlyLink"
                    value={formData.calendlyLink}
                    onChange={handleChange}
                    placeholder="https://calendly.com/your-link"
                    disabled={loading.operation}
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold mb-3">Social Links</h3>
                  {formData.socialLinks.map((link, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
                      <div className="md:col-span-2">
                        <Label value="Platform" />
                        <Select
                          value={link.platform}
                          onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                          disabled={loading.operation}
                        >
                          <option value="">Select platform</option>
                          {socialPlatforms.map(platform => (
                            <option key={platform.value} value={platform.value}>
                              {platform.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label value="URL" />
                        <TextInput
                          value={link.url}
                          onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                          placeholder="https://"
                          disabled={loading.operation}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          color="failure"
                          size="xs"
                          onClick={() => removeSocialLink(index)}
                          disabled={loading.operation || formData.socialLinks.length <= 1}
                        >
                          <HiOutlineTrash />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    gradientMonochrome="info"
                    onClick={addSocialLink}
                    className="mt-2"
                    disabled={loading.operation}
                  >
                    <HiOutlinePlus className="mr-2" /> Add Social Link
                  </Button>
                </div>
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full">
            <Button 
              color="gray" 
              onClick={() => setShowModal(false)}
              disabled={loading.operation}
            >
              Cancel
            </Button>
            <Button 
              gradientDuoTone="tealToLime" 
              onClick={handleSubmit}
              disabled={loading.operation}
              isProcessing={loading.operation}
            >
              <HiOutlineCheck className="mr-2" />
              {editMode ? 'Update Service' : 'Create Service'}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => !loading.operation && setShowDeleteModal(false)} size="md">
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete this service?
            </h3>
            <div className="flex justify-center gap-3">
              <Button 
                color="gray" 
                onClick={() => setShowDeleteModal(false)}
                disabled={loading.operation}
              >
                Cancel
              </Button>
              <Button 
                color="failure" 
                onClick={confirmDelete}
                disabled={loading.operation}
                isProcessing={loading.operation}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Payment Modal */}
      <PaymentModal
        showModal={showPaymentModal}
        setShowModal={setShowPaymentModal}
        service={selectedService}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}