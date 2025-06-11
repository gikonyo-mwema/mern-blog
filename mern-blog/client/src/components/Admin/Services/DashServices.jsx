import React, { useState } from 'react';
import { Button, Alert, Table, Modal } from 'flowbite-react';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineExclamationCircle, HiOutlineCreditCard } from 'react-icons/hi';
import useServices from '../../../hooks/useServices';
import ServiceCard from '../../ServiceCard';
import ServiceForm from '../../ServiceForm';
import PaymentModal from '../../PaymentModal';

export default function DashServices({ currentUser }) {
  const {
    services,
    loading,
    error,
    refresh,
    createOrUpdateService,
    deleteService,
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
      <div className="table-auto overflow-x-scroll md:mx-auto p-3">
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
    <div className="table-auto overflow-x-scroll md:mx-auto p-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Services</h2>
        <Button 
          gradientDuoTone="tealToLime"
          onClick={() => {
            setFormData(null);
            setEditMode(false);
            setShowModal(true);
          }}
        >
          <HiOutlinePlus className="mr-2" />
          Create a New Service
        </Button>
      </div>

      {formError && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Alert color="failure" onDismiss={() => setFormError(null)}>
            {formError}
          </Alert>
        </div>
      )}

      {loading && services.length === 0 ? (
        <p>Loading services...</p>
      ) : services.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {services.map((service) => (
                <Table.Row key={service._id}>
                  <Table.Cell>{service.name}</Table.Cell>
                  <Table.Cell>${service.price}</Table.Cell>
                  <Table.Cell className="truncate max-w-xs">{service.description}</Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button 
                        outline 
                        gradientDuoTone="tealToLime" 
                        size="xs"
                        onClick={() => {
                          setFormData(service);
                          setEditMode(true);
                          setShowModal(true);
                        }}
                      >
                        <HiOutlinePencilAlt className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        outline
                        gradientDuoTone="pinkToOrange"
                        size="xs"
                        onClick={() => {
                          setShowDeleteModal(true);
                          setDeleteId(service._id);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        outline
                        gradientDuoTone="purpleToBlue"
                        size="xs"
                        onClick={() => {
                          setSelectedService(service);
                          setShowPaymentModal(true);
                        }}
                      >
                        <HiOutlineCreditCard className="mr-1" />
                        Test Payment
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
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

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mx-auto mb-4" />
            <h3 className="mb-5 text-lg text-gray-500">Are you sure you want to delete this service?</h3>
            <div className="flex justify-center gap-4">
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button color="failure" onClick={() => handleDelete(deleteId)}>
                Delete
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <PaymentModal
        showModal={showPaymentModal}
        setShowModal={setShowPaymentModal}
        service={selectedService}
      />
    </div>
  );
}