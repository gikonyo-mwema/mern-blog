import { useState, useCallback } from 'react';
import axios from 'axios';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState({ 
    table: true, 
    operation: false,
    bulk: false,
    history: false
  });
  const [alert, setAlert] = useState({ 
    show: false, 
    message: '', 
    type: 'success',
    duration: 5000
  });
  const [versionHistory, setVersionHistory] = useState([]);

  // Enhanced alert system
  const showAlert = useCallback((message, type = 'success', duration = 5000) => {
    setAlert({ show: true, message, type, duration });
    const timer = setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  // Fetch services with enhanced filtering
  const fetchServices = useCallback(async (params = {}) => {
    try {
      setLoading(prev => ({ ...prev, table: true }));
      const { data } = await axios.get('/api/services', { 
        params,
        withCredentials: true 
      });
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      showAlert(
        `Failed to load services: ${err.response?.data?.message || err.message}`, 
        'failure'
      );
    } finally {
      setLoading(prev => ({ ...prev, table: false }));
    }
  }, [showAlert]);

  // CRUD Operations
  const createService = async (serviceData) => {
    try {
      setLoading(prev => ({ ...prev, operation: true }));
      const { data } = await axios.post('/api/services', serviceData, {
        withCredentials: true
      });
      setServices(prev => [...prev, data]);
      showAlert('Service created successfully');
      return data;
    } catch (error) {
      console.error('Create failed:', error);
      showAlert(
        `Create failed: ${error.response?.data?.message || error.message}`,
        'failure'
      );
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, operation: false }));
    }
  };

  const updateService = async (id, serviceData) => {
    try {
      setLoading(prev => ({ ...prev, operation: true }));
      const { data } = await axios.put(`/api/services/${id}`, serviceData, {
        withCredentials: true
      });
      setServices(prev => prev.map(s => s._id === id ? data : s));
      showAlert('Service updated successfully');
      return data;
    } catch (error) {
      console.error('Update failed:', error);
      showAlert(
        `Update failed: ${error.response?.data?.message || error.message}`,
        'failure'
      );
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, operation: false }));
    }
  };

  const deleteService = async (id) => {
    try {
      setLoading(prev => ({ ...prev, operation: true }));
      await axios.delete(`/api/services/${id}`, {
        withCredentials: true
      });
      setServices(prev => prev.filter(s => s._id !== id));
      showAlert('Service deleted successfully');
      return true;
    } catch (error) {
      console.error('Delete failed:', error);
      showAlert(
        `Delete failed: ${error.response?.data?.message || error.message}`,
        'failure'
      );
      return false;
    } finally {
      setLoading(prev => ({ ...prev, operation: false }));
    }
  };

  // Bulk Operations
  const deleteMultipleServices = async (ids) => {
    try {
      setLoading(prev => ({ ...prev, bulk: true }));
      await axios.post('/api/services/bulk-delete', { ids }, {
        withCredentials: true
      });
      setServices(prev => prev.filter(s => !ids.includes(s._id)));
      showAlert(`${ids.length} services deleted successfully`);
      return true;
    } catch (error) {
      console.error('Bulk delete failed:', error);
      showAlert(
        `Failed to delete ${ids.length} services`,
        'failure'
      );
      return false;
    } finally {
      setLoading(prev => ({ ...prev, bulk: false }));
    }
  };

  const publishMultipleServices = async (ids) => {
    try {
      setLoading(prev => ({ ...prev, bulk: true }));
      const { data } = await axios.post('/api/services/bulk-publish', { ids }, {
        withCredentials: true
      });
      setServices(prev => prev.map(s => 
        ids.includes(s._id) ? { ...s, isPublished: true } : s
      ));
      showAlert(`${data.updatedCount} services published`);
      return data.updatedCount;
    } catch (error) {
      console.error('Bulk publish failed:', error);
      showAlert(
        `Failed to publish services`,
        'failure'
      );
      return 0;
    } finally {
      setLoading(prev => ({ ...prev, bulk: false }));
    }
  };

  // Version History
  const fetchVersionHistory = async (serviceId) => {
    try {
      setLoading(prev => ({ ...prev, history: true }));
      const { data } = await axios.get(`/api/services/${serviceId}/history`, {
        withCredentials: true
      });
      setVersionHistory(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch version history:', error);
      showAlert(
        `Failed to load version history`,
        'failure'
      );
      return [];
    } finally {
      setLoading(prev => ({ ...prev, history: false }));
    }
  };

  // Duplicate Service
  const duplicateService = async (serviceId) => {
    try {
      setLoading(prev => ({ ...prev, operation: true }));
      const { data } = await axios.post(
        `/api/services/${serviceId}/duplicate`,
        {},
        { withCredentials: true }
      );
      setServices(prev => [...prev, data]);
      showAlert(`Service duplicated as "${data.title}"`);
      return data;
    } catch (error) {
      console.error('Duplicate failed:', error);
      showAlert(
        `Failed to duplicate service`,
        'failure'
      );
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, operation: false }));
    }
  };

  // Save as Template
  const saveAsTemplate = async (serviceData) => {
    try {
      setLoading(prev => ({ ...prev, operation: true }));
      const { data } = await axios.post('/api/service-templates', serviceData, {
        withCredentials: true
      });
      showAlert('Template saved successfully');
      return data;
    } catch (error) {
      console.error('Save as template failed:', error);
      showAlert(
        `Failed to save template`,
        'failure'
      );
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, operation: false }));
    }
  };

  return {
    services,
    loading,
    alert,
    versionHistory,
    fetchServices,
    createService,
    updateService,
    deleteService,
    deleteMultipleServices,
    publishMultipleServices,
    duplicateService,
    fetchVersionHistory,
    saveAsTemplate,
    showAlert
  };
};