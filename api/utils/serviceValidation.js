import Joi from 'joi';

// Define reusable schemas
const benefitSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().required(),
  icon: Joi.string().default('✅')
});

const featureSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().required()
});

const socialPlatforms = ['twitter', 'facebook', 'linkedin', 'instagram', 'youtube', 'other'];

const contactInfoSchema = Joi.object({
  email: Joi.string().email().allow(''),
  phone: Joi.string().pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).allow(''),
  website: Joi.string().uri().allow(''),
  calendlyLink: Joi.string().uri().allow(''),
  socialLinks: Joi.array().items(
    Joi.object({
      platform: Joi.string().valid(...socialPlatforms).required(),
      url: Joi.string().uri().required()
    })
  ).default([])
});

/**
 * Validates service data before create/update operations
 * @param {Object} serviceData - The service data to validate
 * @param {boolean} isUpdate - Whether this is an update operation
 * @returns {Object} - Validation result { valid: boolean, errors: Object, value: Object }
 */
export const validateServiceData = (serviceData, isUpdate = false) => {
  const schema = Joi.object({
    title: isUpdate 
      ? Joi.string().max(100)
      : Joi.string().required().max(100),
    
    shortDescription: Joi.string()
      .required()
      .max(200),
    
    description: Joi.string()
      .required(),
    
    fullDescription: Joi.string()
      .required(),
    
    category: Joi.string()
      .required()
      .max(50),
    
    features: Joi.array()
      .items(featureSchema)
      .min(1)
      .required(),
    
    icon: Joi.string()
      .default('📋'),
    
    price: Joi.number()
      .min(0)
      .default(0),
    
    projectTypes: Joi.array()
      .items(Joi.string().required().max(100))
      .min(1)
      .required(),
    
    benefits: Joi.array()
      .items(benefitSchema)
      .min(1)
      .required(),
    
    contactInfo: contactInfoSchema
      .required(),
    
    isFeatured: Joi.boolean()
      .default(false),
    
    isPublished: Joi.boolean()
      .default(false),
    
    changeReason: Joi.string()
      .max(200)
      .allow('')
  }).options({ abortEarly: false, allowUnknown: true });

  const { error, value } = schema.validate(serviceData);

  const errors = {};
  if (error) {
    error.details.forEach(err => {
      const path = err.path.join('.');
      errors[path] = err.message;
    });
  }

  return {
    valid: !error,
    errors,
    value
  };
};

/**
 * Gets default service data structure
 * @returns {Object} - Default service data structure
 */
export const getDefaultServiceData = () => ({
  title: '',
  shortDescription: '',
  description: '',
  fullDescription: '',
  category: '',
  features: [{ title: '', description: '' }],
  icon: '📋',
  price: 0,
  projectTypes: [''],
  benefits: [{ title: '', description: '', icon: '✅' }],
  contactInfo: {
    email: '',
    phone: '',
    website: '',
    calendlyLink: '',
    socialLinks: [{ platform: '', url: '' }]
  },
  isFeatured: false,
  isPublished: false
});

/**
 * Validates service ID format
 * @param {string} id - The service ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
export const validateServiceId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};