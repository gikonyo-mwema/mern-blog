import { useState } from 'react';

export const useServiceModals = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  const [selectedService, setSelectedService] = useState(null);
  const [currentService, setCurrentService] = useState(null);

  return {
    showFormModal, setShowFormModal,
    showDeleteModal, setShowDeleteModal,
    showPreviewModal, setShowPreviewModal,
    showPaymentModal, setShowPaymentModal,
    showTemplateModal, setShowTemplateModal,
    showHistoryModal, setShowHistoryModal,
    selectedService, setSelectedService,
    currentService, setCurrentService
  };
};