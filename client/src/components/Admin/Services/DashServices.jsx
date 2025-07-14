import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button, Alert, Spinner
} from 'flowbite-react';
import { 
  HiOutlineRefresh, HiOutlineCheckCircle, HiOutlineXCircle
} from 'react-icons/hi';
import axios from 'axios';

// Component imports
import ServiceCard from './serviceCard';
import ServiceTable from './ServiceTable';
import PaymentModal from '../../Modal/PaymentModal';

// Modal imports
import ServiceFormModal from './modals/ServiceFormModal';
import DeleteModal from './modals/DeleteModal';
import PreviewModal from './modals/PreviewModal';

// Hook imports
import { useServices } from './hooks/useServices';
import { useServiceForm } from './hooks/useServiceForm';
import { useServiceModals } from "./hooks/useServiceModal";

// Default form data
const DEFAULT_FORM_DATA = {
  title: "",
  category: "",
  price: "",
  shortDescription: "",
  description: "",
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
  projectTypes: [""],
  benefits: [{ title: "", description: "", icon: "✅" }],
  features: [{ title: "", description: "" }],
  contactInfo: {
    email: "",
    phone: "",
    website: "",
    calendlyLink: ""
  },
  socialLinks: [{ platform: "", url: "" }]
};

// Validation function
const validateForm = (formData) => {
  const errors = {};
  if (!formData.title?.trim()) errors.title = 'Title is required';
  if (!formData.category?.trim()) errors.category = 'Category is required';
  if (!formData.shortDescription?.trim()) errors.shortDescription = 'Short description is required';
  if (!formData.description?.trim()) errors.description = 'Description is required';
  if (formData.features) {
    formData.features.forEach((feature, index) => {
      if (!feature.title?.trim()) {
        errors[`features[${index}].title`] = 'Feature title is required';
      }
      if (!feature.description?.trim()) {
        errors[`features[${index}].description`] = 'Feature description is required';
      }
    });
  }
  return errors;
};

const DashServices = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Custom hooks for services and modals
  const {
    services,
    loading,
    alert,
    fetchServices,
    deleteService,
    duplicateService,
    showAlert
  } = useServices();

  const {
    showFormModal, setShowFormModal,
    showDeleteModal, setShowDeleteModal,
    showPreviewModal, setShowPreviewModal,
    showPaymentModal, setShowPaymentModal,
    selectedService, setSelectedService,
    currentService, setCurrentService
  } = useServiceModals();

  // Local state
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);

  // Memoized initial form data
  const initialFormData = useMemo(() => (
    currentService ? { ...DEFAULT_FORM_DATA, ...currentService } : DEFAULT_FORM_DATA
  ), [currentService]);

  // Form handlers from custom hook
  const formHandlers = useServiceForm(initialFormData);
  const {
    formData,
    setFormData,
    handleChange,
    handleContactInfoChange,
    handleProcessStepChange,
    addProcessStep,
    removeProcessStep,
    handleProjectTypeChange,
    addProjectType,
    removeProjectType,
    handleBenefitChange,
    addBenefit,
    removeBenefit,
    handleFeatureChange,
    addFeature,
    removeFeature,
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink
  } = formHandlers;

  // Memoized categories for dropdowns
  const categories = useMemo(() => (
    services.length > 0 
      ? [...new Set(services.map(service => service.category))]
      : []
  ), [services]);

  // Toggle selection for bulk actions
  const toggleServiceSelection = useCallback((serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  }, []);

  // Handle form submit (create or update)
  const onSubmit = useCallback(async (formData) => {      
    try {
      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
      }
      const method = editMode ? 'put' : 'post';
      const url = editMode 
        ? `/api/services/${currentService._id}` 
        : '/api/services';
      await axios[method](url, formData);
      showAlert(
        `Service ${editMode ? 'updated' : 'created'} successfully`, 
        'success'
      );
      setShowFormModal(false);
      fetchServices();
    } catch (error) {
      showAlert(
        error.response?.data?.message || 
        `Failed to ${editMode ? 'update' : 'create'} service`, 
        'failure'
      );
    }
  }, [editMode, currentService, fetchServices, showAlert]);

  // Edit service handler
  const handleEdit = useCallback((service) => {
    setCurrentService(service);
    setEditMode(true);
    setShowFormModal(true);
  }, [setCurrentService]);

  // Duplicate service handler
  const handleDuplicate = useCallback(async (serviceId) => {
    try {
      await duplicateService(serviceId);
      showAlert('Service duplicated successfully', 'success');
    } catch (error) {
      showAlert('Failed to duplicate service', 'failure');
    }
  }, [duplicateService, showAlert]);

  // Add new service handler
  const handleAddService = useCallback(() => {
    setEditMode(false);
    setCurrentService(null);
    setFormData(DEFAULT_FORM_DATA);
    setShowFormModal(true);
  }, [setCurrentService, setFormData]);

  // Preview service handler
  const handlePreview = useCallback((service) => {
    setCurrentService(service);
    setShowPreviewModal(true);
  }, [setCurrentService]);

  // Fetch services on mount
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (isMounted) await fetchServices();
      } catch (error) {
        if (isMounted) showAlert('Failed to fetch services', 'failure');
      }
    };
    fetchData();
    return () => { isMounted = false };
  }, [fetchServices, showAlert]);

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen relative transition-colors duration-300">
      {/* Alert Notification */}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50 w-full max-w-md">
          <Alert 
            color={alert.type}
            icon={alert.type === 'success' ? HiOutlineCheckCircle : HiOutlineXCircle}
            onDismiss={() => showAlert('', alert.type, false)}
            className="shadow-lg dark:bg-gray-800"
          >
            <span className="dark:text-white">{alert.message}</span>
          </Alert>
        </div>
      )}

      {/* Header and Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Services</h2>
        <Button
          color="primary"
          onClick={handleAddService}
          className="w-full md:w-auto dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          + Add Service
        </Button>
      </div>

      {/* Content */}
      {loading.table ? (
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" aria-label="Loading services..." className="dark:text-white" />
        </div>
      ) : services.length > 0 ? (
        <>
          {/* Service Preview Section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Services Preview</h3>
              <Button 
                color="light" 
                size="xs" 
                onClick={fetchServices}
                disabled={loading.table}
                className="flex items-center gap-1 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                <HiOutlineRefresh className="mr-1" />
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 3).map(service => (
                <ServiceCard 
                  key={service._id} 
                  service={service} 
                  onPurchaseClick={() => {
                    setSelectedService(service);
                    setShowPaymentModal(true);
                  }}
                  onPreviewClick={() => handlePreview(service)}
                  selected={selectedServices.includes(service._id)}
                  onSelectChange={() => toggleServiceSelection(service._id)}
                  className="shadow-md hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700"
                />
              ))}
            </div>
          </div>

          {/* Service Table Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 dark:border dark:border-gray-700">
            <ServiceTable 
              services={services}
              onEdit={handleEdit}
              onDelete={(id) => {
                setSelectedService(services.find(s => s._id === id));
                setShowDeleteModal(true);
              }}
              onDuplicate={handleDuplicate}
              onPreview={handlePreview}
              selectedServices={selectedServices}
              onSelectChange={toggleServiceSelection}
              loading={loading}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-24">
          <Alert color="info" className="inline-block dark:bg-gray-800">
            <span className="dark:text-white">No services found. Create your first service.</span>
          </Alert>
        </div>
      )}

      {/* Service Form Modal */}
      <ServiceFormModal
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        editMode={editMode}
        currentService={currentService}
        formData={formData}
        onSubmit={onSubmit}
        loading={loading}
        categories={categories}
        errors={errors}
        formHandlers={{
          handleChange,
          handleContactInfoChange,
          handleProcessStepChange,
          addProcessStep,
          removeProcessStep,
          handleProjectTypeChange,
          addProjectType,
          removeProjectType,
          handleBenefitChange,
          addBenefit,
          removeBenefit,
          handleFeatureChange,
          addFeature,
          removeFeature,
          handleSocialLinkChange,
          addSocialLink,
          removeSocialLink,
          setFormData
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        service={selectedService}
        onConfirm={async () => {
          await deleteService(selectedService._id);
          setShowDeleteModal(false);
        }}
        loading={loading.operation}
      />

      {/* Preview Modal */}
      <PreviewModal
        show={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        service={currentService}
      />

      {/* Payment Modal */}
      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        service={selectedService}
      />
    </div>
  );
};

export default DashServices;