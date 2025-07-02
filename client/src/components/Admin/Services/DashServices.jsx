import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button, Alert, Spinner, Dropdown, 
  Badge, Tooltip, Checkbox 
} from 'flowbite-react';
import { 
  HiOutlinePlus, HiOutlineTrash, HiOutlineDuplicate,
  HiOutlineEye, HiOutlineSave, HiOutlineTemplate,
  HiOutlineRefresh, HiOutlineCloudUpload, HiOutlineClock,
  HiOutlineCheckCircle, HiOutlineXCircle, HiDotsVertical
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
import TemplateModal from './modals/TemplateModal';
import VersionHistoryModal from './modals/VersionHistoryModal';

// Hook imports
import useAutoSave from './hooks/useAutoSave';
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
  // featuredImage: null,
  // imageUrl: "",
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
  //processSteps: [{ title: "", description: "", order: 1 }],
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
  
  // Basic fields
  if (!formData.title?.trim()) errors.title = 'Title is required';
  if (!formData.category?.trim()) errors.category = 'Category is required';
  if (!formData.shortDescription?.trim()) errors.shortDescription = 'Short description is required';
  if (!formData.description?.trim()) errors.description = 'Description is required';
  
  // Validate features
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
  
  // Services hook
  const {
    services,
    loading,
    alert,
    fetchServices,
    deleteService,
    deleteMultipleServices,
    publishMultipleServices,
    duplicateService,
    showAlert
  } = useServices();

  // Modals hook
  const {
    showFormModal, setShowFormModal,
    showDeleteModal, setShowDeleteModal,
    showPreviewModal, setShowPreviewModal,
    showPaymentModal, setShowPaymentModal,
    showTemplateModal, setShowTemplateModal,
    showHistoryModal, setShowHistoryModal,
    selectedService, setSelectedService,
    currentService, setCurrentService
  } = useServiceModals();

  // Local state
  const [selectedServices, setSelectedServices] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [versionHistory, setVersionHistory] = useState([]);
  const [errors, setErrors] = useState({});

  // Initialize form data
  const initialFormData = useMemo(() => (
    currentService ? { ...DEFAULT_FORM_DATA, ...currentService } : DEFAULT_FORM_DATA
  ), [currentService]);

  // Form handling
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
    removeSocialLink,
    saveDraft,
    saveAsTemplate
  } = formHandlers;

  // Auto-save hook
  const { autoSave } = useAutoSave();

  // Memoized categories
  const categories = useMemo(() => (
    services.length > 0 
      ? [...new Set(services.map(service => service.category))]
      : []
  ), [services]);

  // Fetch version history
  const fetchVersionHistory = useCallback(async (serviceId) => {
    try {
      const { data } = await axios.get(`/api/services/${serviceId}/history`);
      setVersionHistory(data);
    } catch (error) {
      showAlert('Failed to load version history', 'failure');
    }
  }, [showAlert]);

  // Service selection handler
  const toggleServiceSelection = useCallback((serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  }, []);

  // Bulk actions handler
  const handleBulkAction = useCallback(async (action) => {
    try {
      if (action === 'delete') {
        await deleteMultipleServices(selectedServices);
      } else if (action === 'publish') {
        await publishMultipleServices(selectedServices);
      }
      setSelectedServices([]);
      showAlert(`${action === 'delete' ? 'Deleted' : 'Published'} services successfully`, 'success');
    } catch (error) {
      showAlert(`Failed to ${action} services`, 'failure');
    }
  }, [selectedServices, deleteMultipleServices, publishMultipleServices, showAlert]);

  // Form submission handler
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
      
      const { data } = await axios[method](url, formData);
      
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
  }, [editMode, currentService, formData, fetchServices, showAlert]);

  // Edit handler
  const handleEdit = useCallback((service) => {
    setCurrentService(service);
    setEditMode(true);
    setShowFormModal(true);
    fetchVersionHistory(service._id);
  }, [fetchVersionHistory, setCurrentService]);

  // Duplicate handler
  const handleDuplicate = useCallback(async (serviceId) => {
    try {
      await duplicateService(serviceId);
      showAlert('Service duplicated successfully', 'success');
    } catch (error) {
      showAlert('Failed to duplicate service', 'failure');
    }
  }, [duplicateService, showAlert]);

  // Add service handler
  const handleAddService = useCallback(() => {
    setEditMode(false);
    setCurrentService(null);
    setFormData(DEFAULT_FORM_DATA);
    setShowFormModal(true);
  }, [setCurrentService, setFormData]);

  // Preview handler
  const handlePreview = useCallback((service) => {
    setCurrentService(service);
    setShowPreviewModal(true);
  }, [setCurrentService]);

  // Initialize services
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
    <div className="p-4 md:p-6 relative">
      {/* Alert Notification */}
      {alert.show && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Alert 
            color={alert.type}
            icon={alert.type === 'success' ? HiOutlineCheckCircle : HiOutlineXCircle}
            onDismiss={() => showAlert('', alert.type, false)}
          >
            {alert.message}
          </Alert>
        </div>
      )}

      {/* Header and Action Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Manage Services</h2>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Dropdown
            label="Bulk Actions"
            placement="bottom-end"
            disabled={selectedServices.length === 0 || loading.operation}
          >
            <Dropdown.Item 
              icon={HiOutlineCloudUpload}
              onClick={() => handleBulkAction('publish')}
            >
              Publish Selected
            </Dropdown.Item>
            <Dropdown.Item 
              icon={HiOutlineTrash}
              onClick={() => handleBulkAction('delete')}
              className="text-red-600"
            >
              Delete Selected
            </Dropdown.Item>
          </Dropdown>

          <Button 
            gradientDuoTone="tealToLime"
            onClick={handleAddService}
            disabled={loading.operation}
          >
            <HiOutlinePlus className="mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Selected Services Counter */}
      {selectedServices.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <Badge color="info" className="px-3 py-1">
            {selectedServices.length} selected
          </Badge>
          <Button 
            size="xs" 
            color="light" 
            onClick={() => setSelectedServices([])}
          >
            Clear selection
          </Button>
        </div>
      )}

      {/* Content */}
      {loading.table ? (
        <div className="flex justify-center py-12">
          <Spinner size="xl" aria-label="Loading services..." />
        </div>
      ) : services.length > 0 ? (
        <>
          {/* Service Preview */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Services Preview</h3>
              <Button 
                color="light" 
                size="xs" 
                onClick={fetchServices}
                disabled={loading.table}
              >
                <HiOutlineRefresh className="mr-2" />
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                />
              ))}
            </div>
          </div>

          {/* Service Table */}
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
        </>
      ) : (
        <div className="text-center py-12">
          <Alert color="info">
            No services found. Create your first service.
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
        onSaveDraft={saveDraft}
        onSaveTemplate={() => setShowTemplateModal(true)}
        onViewHistory={() => setShowHistoryModal(true)}
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

      {/* Template Modal */}
      <TemplateModal
        show={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSave={saveAsTemplate}
        loading={loading.operation}
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        show={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={versionHistory}
      />
    </div>
  );
};

export default DashServices;