import { useState, useCallback } from 'react';

export const useServiceForm = (initialData) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Generic field change handler
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // Contact info change handler
  const handleContactInfoChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
  }, []);

  // Process Steps handlers
  const handleProcessStepChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newProcessSteps = [...prev.processSteps];
      newProcessSteps[index] = {
        ...newProcessSteps[index],
        [name]: value
      };
      return { ...prev, processSteps: newProcessSteps };
    });
  }, []);

  const addProcessStep = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      processSteps: [
        ...prev.processSteps,
        { title: "", description: "", order: prev.processSteps.length + 1 }
      ]
    }));
  }, []);

  const removeProcessStep = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      processSteps: prev.processSteps.filter((_, i) => i !== index)
    }));
  }, []);

  // Project Types handlers
  const handleProjectTypeChange = useCallback((index, value) => {
    setFormData(prev => {
      const newProjectTypes = [...prev.projectTypes];
      newProjectTypes[index] = value;
      return { ...prev, projectTypes: newProjectTypes };
    });
  }, []);

  const addProjectType = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      projectTypes: [...prev.projectTypes, ""]
    }));
  }, []);

  const removeProjectType = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.filter((_, i) => i !== index)
    }));
  }, []);

  // Benefits handlers - UPDATED to match component usage
  const handleBenefitChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const newBenefits = [...prev.benefits];
      if (!newBenefits[index]) return prev; // safety check
      
      newBenefits[index] = {
        ...newBenefits[index],
        [field]: value
      };
      return { ...prev, benefits: newBenefits };
    });
  }, []);

  const addBenefit = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      benefits: [
        ...prev.benefits,
        { title: "", description: "", icon: "✅" }
      ]
    }));
  }, []);

  const removeBenefit = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  }, []);

  // Features handlers - UPDATED to match benefits pattern
  const handleFeatureChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const newFeatures = [...prev.features];
      if (!newFeatures[index]) return prev; // safety check
      
      newFeatures[index] = {
        ...newFeatures[index],
        [field]: value
      };
      return { ...prev, features: newFeatures };
    });
  }, []);

  const addFeature = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        { title: "", description: "" }
      ]
    }));
  }, []);

  const removeFeature = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  }, []);

  // Social Links handlers - UPDATED to match benefits pattern
  const handleSocialLinkChange = useCallback((index, field, value) => {
    setFormData(prev => {
      const newSocialLinks = [...prev.socialLinks];
      if (!newSocialLinks[index]) return prev; // safety check
      
      newSocialLinks[index] = {
        ...newSocialLinks[index],
        [field]: value
      };
      return { ...prev, socialLinks: newSocialLinks };
    });
  }, []);

  const addSocialLink = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { platform: "", url: "" }
      ]
    }));
  }, []);

  const removeSocialLink = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  }, []);

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    handleContactInfoChange,
    // Process Steps
    handleProcessStepChange,
    addProcessStep,
    removeProcessStep,
    // Project Types
    handleProjectTypeChange,
    addProjectType,
    removeProjectType,
    // Benefits
    handleBenefitChange,
    addBenefit,
    removeBenefit,
    // Features
    handleFeatureChange,
    addFeature,
    removeFeature,
    // Social Links
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink
  };
};