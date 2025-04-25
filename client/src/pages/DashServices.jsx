import { Table, Modal, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle, HiOutlinePencilAlt } from 'react-icons/hi';

export default function DashServices() {
  const { currentUser } = useSelector((state) => state.user);
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        if (res.ok) {
          setServices(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser?.isAdmin) {
      fetchServices();
    }
  }, [currentUser]);

  const handleDeleteService = async () => {
    try {
      const res = await fetch(`/api/services/${serviceIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setServices((prev) => prev.filter((service) => service._id !== serviceIdToDelete));
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!currentUser?.isAdmin) {
    return <p>You are not authorized to view this content.</p>;
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-semibold'>Manage Services</h1>
        <Link to='/services/create'>
          <Button gradientDuoTone='tealToLime'>
            Create New Service
          </Button>
        </Link>
      </div>
      
      {services.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Service Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {services.map((service) => (
                <Table.Row key={service._id}>
                  <Table.Cell>{service.title}</Table.Cell>
                  <Table.Cell>{service.category}</Table.Cell>
                  <Table.Cell>
                    <div className='flex gap-2'>
                      <Link to={`/services/edit/${service._id}`}>
                        <Button outline gradientDuoTone='tealToLime' size='xs'>
                          <HiOutlinePencilAlt className='mr-1' />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        outline 
                        gradientDuoTone='pinkToOrange' 
                        size='xs'
                        onClick={() => {
                          setShowModal(true);
                          setServiceIdToDelete(service._id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>No services available</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500'>
              Are you sure you want to delete this service?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteService}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}