// utils/serviceValidation.js

/**
 * Validates service data before create/update operations
 * @param {Object} serviceData - The service data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} - Validation result { valid: boolean, errors: Object }
 */
export const validateServiceData = (serviceData, isUpdate = false) => {
  const errors = {};
  
  // Required fields validation
  if (!serviceData.title?.trim()) {
    errors.title = 'Service title is required';
  } else if (serviceData.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters';
  }

  if (!serviceData.category) {
    errors.category = 'Category is required';
  }

  if (!serviceData.description?.trim()) {
    errors.description = 'Description is required';
  } else if (serviceData.description.length > 200) {
    errors.description = 'Short description cannot exceed 200 characters';
  }

  if (!serviceData.fullDescription?.trim()) {
    errors.fullDescription = 'Full description is required';
  }

  // Price validation
  if (typeof serviceData.price !== 'number' || isNaN(serviceData.price)) {
    errors.price = 'Price must be a valid number';
  } else if (serviceData.price < 0) {
    errors.price = 'Price cannot be negative';
  }

  // Process steps validation
  if (serviceData.processSteps && Array.isArray(serviceData.processSteps)) {
    serviceData.processSteps.forEach((step, index) => {
      if (!step.title?.trim()) {
        errors[`processSteps[${index}].title`] = 'Step title is required';
      }
      if (!step.description?.trim()) {
        errors[`processSteps[${index}].description`] = 'Step description is required';
      }
    });
  } else {
    errors.processSteps = 'Process steps must be an array';
  }

  // Project types validation
  if (serviceData.projectTypes && Array.isArray(serviceData.projectTypes)) {
    serviceData.projectTypes.forEach((type, index) => {
      if (!type?.trim()) {
        errors[`projectTypes[${index}]`] = 'Project type cannot be empty';
      }
    });
  } else {
    errors.projectTypes = 'Project types must be an array';
  }

  // Benefits validation
  if (serviceData.benefits && Array.isArray(serviceData.benefits)) {
    serviceData.benefits.forEach((benefit, index) => {
      if (!benefit.title?.trim()) {
        errors[`benefits[${index}].title`] = 'Benefit title is required';
      }
      if (!benefit.description?.trim()) {
        errors[`benefits[${index}].description`] = 'Benefit description is required';
      }
    });
  } else {
    errors.benefits = 'Benefits must be an array';
  }

  // Features validation
  if (!serviceData.features || !Array.isArray(serviceData.features) || serviceData.features.length === 0) {
    errors.features = 'At least one feature is required';
  } else {
    serviceData.features.forEach((feature, index) => {
      if (!feature?.trim()) {
        errors[`features[${index}]`] = 'Feature cannot be empty';
      }
    });
  }

  // Contact info validation
  if (serviceData.contactInfo) {
    if (serviceData.contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(serviceData.contactInfo.email)) {
      errors['contactInfo.email'] = 'Invalid email format';
    }
    
    if (serviceData.contactInfo.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(serviceData.contactInfo.phone)) {
      errors['contactInfo.phone'] = 'Invalid phone number';
    }
    
    if (serviceData.contactInfo.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(serviceData.contactInfo.website)) {
      errors['contactInfo.website'] = 'Invalid website URL';
    }
  }

  // Social links validation
  if (serviceData.socialLinks && Array.isArray(serviceData.socialLinks)) {
    serviceData.socialLinks.forEach((link, index) => {
      if (link.platform && !link.url) {
        errors[`socialLinks[${index}].url`] = 'URL is required when platform is specified';
      }
      if (link.url && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(link.url)) {
        errors[`socialLinks[${index}].url`] = 'Invalid URL format';
      }
    });
  }

  // For updates, some fields might be optional
  if (!isUpdate) {
    if (!serviceData.icon) {
      errors.icon = 'Icon is required';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Gets default service data structure
 * @returns {Object} - Default service data structure
 */
export const getDefaultServiceData = () => {
  return {
    title: '',
    description: '',
    shortDescription: '',
    category: 'assessments',
    features: [''],
    fullDescription: '',
    heroText: '',
    introduction: '',
    icon: '📋',
    price: 0,
    processSteps: [{ title: '', description: '' }],
    projectTypes: [''],
    benefits: [{ title: '', description: '' }],
    contactInfo: {
      email: '',
      phone: '',
      website: ''
    },
    socialLinks: [{ platform: '', url: '' }],
    calendlyLink: '',
    isFeatured: false,
    image: ''
  };
};

/**
 * Processes service data for display
 * @param {Object} service - The service data to process
 * @returns {Object} - Processed service data with defaults
 */
export const processServiceForDisplay = (service) => {
  return {
    ...getDefaultServiceData(),
    ...service,
    contactInfo: {
      ...getDefaultServiceData().contactInfo,
      ...(service.contactInfo || {})
    }
  };
};

/**
 * Validates service ID format
 * @param {string} id - The service ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
export const validateServiceId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};