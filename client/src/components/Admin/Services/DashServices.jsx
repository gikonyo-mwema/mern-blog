import React, { useState } from 'react';
import { Button, Alert } from 'flowbite-react';
import useServices from '../../../hooks/useServices';
import ServiceCard from '../../ServiceCard';
import ServiceTable from '../../ServiceTable';
import ServiceForm from '../../ServiceForm';
import ConfirmDelete from '../../ConfirmDelete';
import PaymentModal from '../../PaymentModal';

export default function DashServices({ currentUser }) {
  const {
    services,
    loading,
    error,
    refresh,
    createService,
    updateService,
    deleteService,
    createOrUpdateService,
  } = useServices(currentUser);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleFormSubmit = async (data) => {
    try {
      setFormError(null);
      await createOrUpdateService(data);
      setShowModal(false);
    } catch (error) {
      setFormError(error.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      setShowDeleteModal(false);
    } catch (error) {
      setFormError(error.message || 'Failed to delete service');
    }
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:ml-64 mt-20">
        <Alert color="failure">
          Failed to load services: {error.message}
          <Button color="gray" onClick={refresh} className="ml-2">
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-4 md:ml-64 mt-20">
      <h1 className="text-3xl font-bold mb-4">Services</h1>

      {formError && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Alert color="failure" onDismiss={() => setFormError(null)}>
            {formError}
          </Alert>
        </div>
      )}

      {services.length === 0 ? (
        <div className="mb-4">
          <Alert color="info">
            No services available yet.
            <Button
              color="gray"
              onClick={() => {
                setFormData(null);
                setEditMode(false);
                setShowModal(true);
              }}
              className="ml-2"
            >
              Create First Service
            </Button>
          </Alert>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
                onPurchaseClick={() => {
                  setSelectedService(service);
                  setShowPaymentModal(true);
                }}
              />
            ))}
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Manage Services</h2>
              <Button
                onClick={() => {
                  setFormData(null);
                  setEditMode(false);
                  setShowModal(true);
                }}
              >
                Add Service
              </Button>
            </div>

            <ServiceTable
              services={services}
              loading={loading}
              onEdit={(service) => {
                setFormData(service);
                setEditMode(true);
                setShowModal(true);
              }}
              onDelete={(id) => {
                setDeleteId(id);
                setShowDeleteModal(true);
              }}
            />
          </div>
        </>
      )}

      <ServiceForm
  show={showModal}
  onClose={() => {
    setShowModal(false);
    setFormError(null);
  }}
  onSubmit={handleFormSubmit}
  formData={formData}
  loading={loading}
/>


      <ConfirmDelete
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDelete(deleteId)}
        loading={loading}
      />

      <PaymentModal
        showModal={showPaymentModal}
        setShowModal={setShowPaymentModal}
        service={selectedService}
      />
    </div>
  );
}
