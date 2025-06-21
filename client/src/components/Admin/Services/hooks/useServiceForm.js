import { useState, useEffect, useCallback } from 'react';
import { validateServiceForm } from '../../utils/serviceValidation';

export const useServiceForm = (initialService = null) => {
  const initialFormData = {
    title: '',
    shortDescription: '',
    description: '',
    fullDescription: '',
    category: '',
    price: 0,
    icon: '📋',
    heroText: '',
    introduction: '',
    isFeatured: false,
    isPublished: false,
    processSteps: [{ title: '', description: '', order: 1 }],
    projectTypes: [''],
    benefits: [{ title: '', description: '', icon: '✅' }],
    features: [''],
    contactInfo: {
      email: '',
      phone: '',
      website: '',
      calendlyLink: ''
    },
    socialLinks: [{ platform: '', url: '' }],
    image: ''
  };

  const [formData, setFormData] = useState(initialService || initialFormData);
  const [activeTab, setActiveTab] = useState('basic');
  const [errors, setErrors] = useState({});
  const [draftSaved, setDraftSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Initialize form with service data
  useEffect(() => {
    if (initialService) {
      setFormData({
        ...initialFormData,
        ...initialService,
        processSteps: initialService.processSteps || initialFormData.processSteps,
        projectTypes: initialService.projectTypes || initialFormData.projectTypes,
        benefits: initialService.benefits || initialFormData.benefits,
        features: initialService.features || initialFormData.features,
        contactInfo: {
          ...initialFormData.contactInfo,
          ...(initialService.contactInfo || {})
        },
        socialLinks: initialService.socialLinks || initialFormData.socialLinks
      });
    }
  }, [initialService]);

  // Basic field change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    setDraftSaved(false);
  }, []);

  // Process steps handlers
  const handleProcessStepChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const newSteps = [...prev.processSteps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      return { ...prev, processSteps: newSteps };
    });
    setDraftSaved(false);
  }, []);

  const addProcessStep = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      processSteps: [
        ...prev.processSteps,
        { title: '', description: '', order: prev.processSteps.length + 1 }
      ]
    }));
    setDraftSaved(false);
  }, []);

  const removeProcessStep = useCallback((index) => {
    if (formData.processSteps.length > 1) {
      setFormData(prev => ({
        ...prev,
        processSteps: prev.processSteps.filter((_, i) => i !== index)
          .map((step, idx) => ({ ...step, order: idx + 1 }))
      }));
      setDraftSaved(false);
    }
  }, [formData.processSteps.length]);

  // Project types handlers
  const handleProjectTypeChange = useCallback((index, value) => {
    setFormData(prev => {
      const newTypes = [...prev.projectTypes];
      newTypes[index] = value;
      return { ...prev, projectTypes: newTypes };
    });
    setDraftSaved(false);
  }, []);

  const addProjectType = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      projectTypes: [...prev.projectTypes, '']
    }));
    setDraftSaved(false);
  }, []);

  const removeProjectType = useCallback((index) => {
    if (formData.projectTypes.length > 1) {
      setFormData(prev => ({
        ...prev,
        projectTypes: prev.projectTypes.filter((_, i) => i !== index)
      }));
      setDraftSaved(false);
    }
  }, [formData.projectTypes.length]);

  // Benefits handlers
  const handleBenefitChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const newBenefits = [...prev.benefits];
      newBenefits[index] = { ...newBenefits[index], [field]: value };
      return { ...prev, benefits: newBenefits };
    });
    setDraftSaved(false);
  }, []);

  const addBenefit = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, { title: '', description: '', icon: '✅' }]
    }));
    setDraftSaved(false);
  }, []);

  const removeBenefit = useCallback((index) => {
    if (formData.benefits.length > 1) {
      setFormData(prev => ({
        ...prev,
        benefits: prev.benefits.filter((_, i) => i !== index)
      }));
      setDraftSaved(false);
    }
  }, [formData.benefits.length]);

  // Features handlers
  const handleFeatureChange = useCallback((index, value) => {
    setFormData(prev => {
      const newFeatures = [...prev.features];
      newFeatures[index] = value;
      return { ...prev, features: newFeatures };
    });
    setDraftSaved(false);
  }, []);

  const addFeature = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
    setDraftSaved(false);
  }, []);

  const removeFeature = useCallback((index) => {
    if (formData.features.length > 1) {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
      setDraftSaved(false);
    }
  }, [formData.features.length]);

  // Contact info handlers
  const handleContactInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
    setDraftSaved(false);
  }, []);

  // Social links handlers
  const handleSocialLinkChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const newLinks = [...prev.socialLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, socialLinks: newLinks };
    });
    setDraftSaved(false);
  }, []);

  const addSocialLink = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '' }]
    }));
    setDraftSaved(false);
  }, []);

  const removeSocialLink = useCallback((index) => {
    if (formData.socialLinks.length > 1) {
      setFormData(prev => ({
        ...prev,
        socialLinks: prev.socialLinks.filter((_, i) => i !== index)
      }));
      setDraftSaved(false);
    }
  }, [formData.socialLinks.length]);

  // Image handler
  const handleImageChange = useCallback((imageUrl) => {
    setFormData(prev => ({
      ...prev,
      image: imageUrl
    }));
    setDraftSaved(false);
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const validationErrors = validateServiceForm(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setActiveTab('basic');
    setErrors({});
    setDraftSaved(false);
  }, [initialFormData]);

  // Save draft
  const saveDraft = useCallback(() => {
    const draftData = {
      ...formData,
      isDraft: true,
      isPublished: false
    };
    // In a real app, you would save to localStorage or backend here
    setLastSaved(new Date());
    setDraftSaved(true);
    return draftData;
  }, [formData]);

  return {
    formData,
    setFormData,
    activeTab,
    setActiveTab,
    errors,
    draftSaved,
    lastSaved,
    handleChange,
    handleProcessStepChange,
    addProcessStep,
    removeProcessStep,
    handleProjectTypeChange,
    addProjectType,
    removeProjectType,
    handleBenefitChange,
    addBenefit,
    removeBenefit,
    handleFeatureChange,
    addFeature,
    removeFeature,
    handleContactInfoChange,
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink,
    handleImageChange,
    validateForm,
    resetForm,
    saveDraft
  };
};