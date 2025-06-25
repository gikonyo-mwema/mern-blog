import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  Button, Alert, Spinner, Modal, Dropdown, 
  Badge, Tooltip, Checkbox 
} from 'flowbite-react';
import { 
  HiOutlinePlus, HiOutlineTrash, HiOutlineDuplicate,
  HiOutlineEye, HiOutlineSave, HiOutlineTemplate,
  HiOutlineRefresh, HiOutlineCloudUpload, HiOutlineClock,
  HiOutlineCheckCircle, HiOutlineXCircle, HiDotsVertical
} from 'react-icons/hi';
import axios from 'axios';
import ServiceCard from './serviceCard';
import ServiceTable from './ServiceTable';
import ServiceForm from './ServiceForm/ServiceFormTabs';
import PaymentModal from '../../Modal/PaymentModal';
import useAutoSave from './hooks/useAutoSave';
import { useServices } from './hooks/useServices';

const DashServices = () => {
  const { currentUser } = useSelector((state) => state.user);
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

  // State management
  const [selectedServices, setSelectedServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [draft, setDraft] = useState(null);
  const [versionHistory, setVersionHistory] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  // Auto-save hook
  const { autoSave } = useAutoSave();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    category: '',
    price: 0,
    // ... other initial fields
  });

  // Fetch version history
  const fetchVersionHistory = useCallback(async (serviceId) => {
    try {
      const { data } = await axios.get(`/api/services/${serviceId}/history`);
      setVersionHistory(data);
    } catch (error) {
      showAlert('Failed to load version history', 'failure');
    }
  }, [showAlert]);

  // Handle service selection
  const toggleServiceSelection = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedServices.length === 0) {
      showAlert('Please select at least one service', 'warning');
      return;
    }

    try {
      if (action === 'delete') {
        await deleteMultipleServices(selectedServices);
      } else if (action === 'publish') {
        await publishMultipleServices(selectedServices);
      }
      setSelectedServices([]);
    } catch (error) {
      showAlert(`Bulk ${action} failed`, 'failure');
    }
  };

  // Handle duplicate service
  const handleDuplicate = async (serviceId) => {
    try {
      const duplicated = await duplicateService(serviceId);
      showAlert(`Service duplicated as "${duplicated.title}"`, 'success');
    } catch (error) {
      showAlert('Failed to duplicate service', 'failure');
    }
  };

  // Handle process steps reordering - modified to not use react-beautiful-dnd
  const handleStepReorder = (steps) => {
    setFormData(prev => ({
      ...prev,
      processSteps: steps.map((step, index) => ({ ...step, order: index + 1 }))
    }));
  };

  // Save as draft
  const saveDraft = () => {
    autoSave(formData);
    showAlert('Draft saved successfully', 'success');
  };

  // Save as template
  const saveAsTemplate = async () => {
    try {
      await axios.post('/api/service-templates', formData);
      showAlert('Template saved successfully', 'success');
      setShowTemplateModal(false);
    } catch (error) {
      showAlert('Failed to save template', 'failure');
    }
  };

  // Load service for editing
  const handleEdit = (service) => {
    setCurrentService(service);
    setFormData(service);
    setEditMode(true);
    setShowModal(true);
    fetchVersionHistory(service._id);
  };

  // Preview service
  const handlePreview = (service) => {
    setCurrentService(service);
    setShowPreviewModal(true);
  };

  // Initialize
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
            onClick={() => {
              setEditMode(false);
              setCurrentService(null);
              setFormData({
                title: '',
                description: '',
                // ... reset other fields
              });
              setShowModal(true);
            }}
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
      <Modal show={showModal} onClose={() => setShowModal(false)} size="7xl">
        <Modal.Header>
          {editMode ? `Edit ${currentService?.title}` : 'Create New Service'}
          {editMode && (
            <Badge color="gray" className="ml-2">
              {currentService?.isPublished ? 'Published' : 'Draft'}
            </Badge>
          )}
        </Modal.Header>
        <Modal.Body>
          <div className="flex justify-end gap-2 mb-4">
            <Button
              color="light"
              onClick={saveDraft}
              disabled={loading.operation}
            >
              <HiOutlineSave className="mr-2" />
              Save Draft
            </Button>
            <Button
              gradientMonochrome="info"
              onClick={() => setShowTemplateModal(true)}
              disabled={loading.operation}
            >
              <HiOutlineTemplate className="mr-2" />
              Save as Template
            </Button>
            {editMode && (
              <Button
                color="light"
                onClick={() => setShowHistoryModal(true)}
              >
                <HiOutlineClock className="mr-2" />
                Version History
              </Button>
            )}
          </div>

          <ServiceForm
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            editMode={editMode}
            onStepReorder={handleStepReorder}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full">
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                gradientDuoTone="tealToLime"
                onClick={() => {
                  // Handle form submission
                  onSubmit({ ...formData, isPublished: false });
                }}
                disabled={loading.operation}
              >
                Save as Draft
              </Button>
              <Button
                gradientDuoTone="purpleToBlue"
                onClick={() => {
                  // Handle form submission with publish
                  onSubmit({ ...formData, isPublished: true });
                }}
                disabled={loading.operation}
              >
                {editMode ? 'Update and Publish' : 'Publish Service'}
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="md">
        <Modal.Header>Confirm Deletion</Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <p className="mb-4">Are you sure you want to delete this service?</p>
            <p className="font-semibold">{selectedService?.title}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end gap-2 w-full">
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              color="failure"
              onClick={async () => {
                await deleteService(selectedService._id);
                setShowDeleteModal(false);
              }}
              disabled={loading.operation}
            >
              Delete Service
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Preview Modal */}
      <Modal show={showPreviewModal} onClose={() => setShowPreviewModal(false)} size="7xl">
        <Modal.Header>Service Preview: {currentService?.title}</Modal.Header>
        <Modal.Body>
          {/* Render the service preview using the actual ServiceDetail component */}
          <div className="prose max-w-none">
            <h1>{currentService?.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: currentService?.fullDescription }} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowPreviewModal(false)}>Close Preview</Button>
        </Modal.Footer>
      </Modal>

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