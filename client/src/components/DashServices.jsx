import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, TextInput, Textarea, Select, Label, Alert } from 'flowbite-react';
import { 
  HiOutlineExclamationCircle, 
  HiOutlinePencilAlt, 
  HiOutlinePlus, 
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineXCircle
} from 'react-icons/hi';
import { useSelector } from 'react-redux';
import axios from 'axios';

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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'assessments',
    features: [''],
    fullDescription: '',
    icon: '📋'
  });

  const categories = [
    { value: 'assessments', label: 'Assessments' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'safeguards', label: 'Safeguards' },
    { value: 'planning', label: 'Planning' },
    { value: 'sustainability', label: 'Sustainability' }
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

  const handleEdit = (service) => {
    setCurrentService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      features: service.features,
      fullDescription: service.fullDescription,
      icon: service.icon || '📋'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
              category: 'assessments',
              features: [''],
              fullDescription: '',
              icon: '📋'
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : services.length > 0 ? (
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Icon</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
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
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">
                      {service.category}
                    </span>
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
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No services found. Create your first service.</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal show={showModal} onClose={() => !loading.operation && setShowModal(false)} size="4xl">
        <Modal.Header>
          {editMode ? 'Edit Service' : 'Create Service'}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div>
              <Label htmlFor="title" value="Title" />
              <TextInput
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={loading.operation}
              />
            </div>
            
            <div>
              <Label htmlFor="description" value="Short Description" />
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading.operation}
              />
            </div>

            <div>
              <Label htmlFor="fullDescription" value="Full Description" />
              <Textarea
                id="fullDescription"
                rows={5}
                value={formData.fullDescription}
                onChange={handleChange}
                required
                disabled={loading.operation}
              />
            </div>
            
            <div>
              <Label htmlFor="category" value="Category" />
              <Select
                id="category"
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
              <Label htmlFor="icon" value="Icon" />
              <TextInput
                id="icon"
                value={formData.icon}
                onChange={handleChange}
                disabled={loading.operation}
              />
            </div>

            <div>
              <Label value="Features" />
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <TextInput
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    required
                    disabled={loading.operation}
                    className="flex-1"
                  />
                  <Button 
                    color="failure" 
                    size="xs" 
                    onClick={() => removeFeatureField(index)}
                    disabled={loading.operation || formData.features.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button 
                gradientMonochrome="info" 
                size="xs" 
                onClick={addFeatureField}
                disabled={loading.operation}
                className="mt-2"
              >
                Add Feature
              </Button>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                color="gray" 
                onClick={() => setShowModal(false)}
                disabled={loading.operation}
              >
                Cancel
              </Button>
              <Button 
                gradientDuoTone="tealToLime" 
                type="submit"
                disabled={loading.operation}
                isProcessing={loading.operation}
              >
                {editMode ? 'Update Service' : 'Create Service'}
              </Button>
            </div>
          </form>
        </Modal.Body>
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
    </div>
  );
}