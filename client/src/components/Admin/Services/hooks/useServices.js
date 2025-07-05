import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom hook for managing services in the admin panel.
 * Handles CRUD, bulk operations, version history, and alerts.
 */
export const useServices = () => {
  // State for the list of services
  const [services, setServices] = useState([]);
  // Loading states for different operations
  const [loading, setLoading] = useState({
    table: true,
    operation: false,
    bulk: false,
    history: false,
  });
  // Alert state for user feedback
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success',
    duration: 5000,
  });

  /**
   * Show alert with message, type, and duration.
   * Automatically hides after duration.
   * @param {string} message - Alert message to display
   * @param {string} [type='success'] - Alert type ('success' or 'failure')
   * @param {number} [duration=5000] - Duration in ms before auto-hide
   */
  const showAlert = useCallback((message, type = 'success', duration = 5000) => {
    setAlert({ show: true, message, type, duration });
    const timer = setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, duration);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Fetch services from API with optional filters.
   * @param {object} params - Query parameters for filtering services
   */
  const fetchServices = useCallback(
    async (params = {}) => {
      try {
        setLoading(prev => ({ ...prev, table: true }));
        const { data } = await axios.get('/api/services', {
          params,
          withCredentials: true,
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
    },
    [showAlert]
  );

  /**
   * Create a new service.
   * @param {object} serviceData - Data for the new service
   * @returns {object} Created service data
   */
  const createService = async (serviceData) => {
    try {
      setLoading(prev => ({ ...prev, operation: true }));
      const { data } = await axios.post('/api/services', serviceData, {
        withCredentials: true,
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

  /**
   * Update an existing service by ID.
   * @param {string} id - Service ID
   * @param {object} serviceData - Updated service data
   * @returns {object} Updated service data
   */
  const updateService = async (id, serviceData) => {
    try {
      setLoading(prev => ({ ...prev, operation: true }));
      const { data } = await axios.put(`/api/services/${id}`, serviceData, {
        withCredentials: true,
      });
      setServices(prev => prev.map(s => (s._id === id ? data : s)));
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

  /**
   * Delete a service by ID.
   * @param {string} id - Service ID
   * @returns {boolean} True if deleted, false otherwise
   */
  const deleteService = async (id) => {
    try {
      setLoading(prev => ({ ...prev, operation: true }));
      await axios.delete(`/api/services/${id}`, {
        withCredentials: true,
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

  /**
   * Duplicate a service by ID.
   * @param {string} serviceId - Service ID to duplicate
   * @returns {object} Duplicated service data
   */
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
      showAlert('Failed to duplicate service', 'failure');
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, operation: false }));
    }
  };

  // Expose state and handlers for use in components
  return {
    services,        // List of services
    loading,         // Loading states for UI feedback
    alert,           // Alert state for notifications
    fetchServices,   // Fetch all services
    createService,   // Create a new service
    updateService,   // Update an existing service
    deleteService,   // Delete a service
    duplicateService,// Duplicate a service
    showAlert,       // Show alert messages
  };
};
