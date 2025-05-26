import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useServices(currentUser = null) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // for initial load
  const [operationLoading, setOperationLoading] = useState(false); // for create/update/delete
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const url = currentUser 
        ? '/api/services/my-services' 
        : '/api/services';
      const res = await axios.get(url);
      setServices(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setError(error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData) => {
    try {
      setOperationLoading(true);
      const res = await axios.post('/api/services', serviceData);
      setServices(prev => [...prev, res.data]);
      return res.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      setOperationLoading(true);
      const res = await axios.put(`/api/services/${id}`, serviceData);
      setServices(prev => prev.map(s => s._id === id ? res.data : s));
      return res.data;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      setOperationLoading(true);
      await axios.delete(`/api/services/${id}`);
      setServices(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setOperationLoading(false);
    }
  };

  const createOrUpdateService = async (serviceData) => {
    return serviceData._id 
      ? updateService(serviceData._id, serviceData)
      : createService(serviceData);
  };

  useEffect(() => {
    fetchServices();
  }, [currentUser]);

  return { 
    services, 
    loading, 
    operationLoading,
    error,
    refresh: fetchServices,
    createService,
    updateService,
    deleteService,
    createOrUpdateService,
  };
}
