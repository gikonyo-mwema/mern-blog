import { useEffect, useRef } from 'react';
import axios from 'axios';

const useAutoSave = () => {
  const draftRef = useRef(null);
  const isFirstRender = useRef(true);

  // Auto-save function without debounce
  const autoSave = async (formData) => {
    try {
      if (!formData.title) return; // Don't save empty drafts
      
      const endpoint = formData._id 
        ? `/api/services/${formData._id}/draft` 
        : '/api/services/drafts';
      
      const method = formData._id ? 'PUT' : 'POST';
      
      const { data } = await axios({
        method,
        url: endpoint,
        data: formData
      });
      
      draftRef.current = data;
      return data;
    } catch (error) {
      console.error('Auto-save failed:', error);
      throw error;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // No need to cancel debounce anymore
    };
  }, []);

  // Optional: Load draft on initial render
  const loadDraft = async (draftId) => {
    try {
      const { data } = await axios.get(`/api/services/drafts/${draftId}`);
      draftRef.current = data;
      return data;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  };

  // Optional: Clear draft
  const clearDraft = async () => {
    if (draftRef.current?._id) {
      try {
        await axios.delete(`/api/services/drafts/${draftRef.current._id}`);
      } catch (error) {
        console.error('Failed to clear draft:', error);
      }
    }
    draftRef.current = null;
  };

  return {
    autoSave,
    loadDraft,
    clearDraft,
    getCurrentDraft: () => draftRef.current
  };
};

export default useAutoSave;