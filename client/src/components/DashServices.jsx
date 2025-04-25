import { Table, Modal, Button } from 'flowbite-react';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle, HiOutlinePencilAlt, HiOutlinePlus } from 'react-icons/hi';

export default function DashServices() {
  const { currentUser } = useSelector((state) => state.user);
  const [services, setServices] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [serviceIdToDelete, setServiceIdToDelete] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/services');
        const data = await res.json();
        if (res.ok) {
          setServices(data);
          if (data.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.isAdmin) {
      fetchServices();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = services.length;
    try {
      const res = await fetch(`/api/services?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setServices((prev) => [...prev, ...data]);
        if (data.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteService = async () => {
    try {
      const res = await fetch(`/api/services/${serviceIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setServices((prev) => prev.filter((service) => service._id !== serviceIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!currentUser?.isAdmin) {
    return <p>You are not authorized to view this content.</p>;
  }

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Services</h2>
        <Link to="/create-service">
          <Button gradientDuoTone="tealToLime">
            <HiOutlinePlus className="mr-2" />
            Add New Service
          </Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading services...</p>
      ) : services.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Icon</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Last Updated</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {services.map((service) => (
                <Table.Row key={service._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <div className="text-2xl">{service.icon || '📋'}</div>
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {service.title}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {service.category}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(service.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Link to={`/edit-service/${service._id}`}>
                        <Button outline gradientDuoTone="tealToLime" size="xs">
                          <HiOutlinePencilAlt className="mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button 
                        outline 
                        gradientDuoTone="pinkToOrange" 
                        size="xs"
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
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No services found. Create your first service!</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this service?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteService}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}