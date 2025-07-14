import Joi from 'joi';

// Define reusable schemas
const benefitSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().required(),
  icon: Joi.string().default('✅')
});

const featureSchema = Joi.object({
  title: Joi.string().max(100),
  description: Joi.string()
});

const processStepSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  order: Joi.number()
});

const socialPlatforms = ['twitter', 'facebook', 'linkedin', 'instagram', 'youtube', 'other'];

const socialLinkSchema = Joi.object({
  platform: Joi.string().valid(...socialPlatforms).required(),
  url: Joi.string().uri().required()
});

const contactInfoSchema = Joi.object({
  email: Joi.string().email().allow(''),
  phone: Joi.string().pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/).allow(''),
  website: Joi.string().uri().allow(''),
  calendlyLink: Joi.string().uri().allow('')
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
    
    metaTitle: Joi.string()
      .max(100)
      .allow(''),
    
    metaDescription: Joi.string()
      .max(200)
      .allow(''),
    
    category: Joi.string()
      .required()
      .max(50),
    
    features: Joi.array()
      .items(featureSchema)
      .default([]),
    
    icon: Joi.string()
      .default('📋'),
    
    price: Joi.number()
      .min(0)
      .default(0),
    
    priceNote: Joi.string()
      .max(100)
      .allow(''),
    
    projectTypes: Joi.array()
      .items(Joi.string().max(100))
      .default(['']),
    
    benefits: Joi.array()
      .items(benefitSchema)
      .default([{ title: '', description: '', icon: '✅' }]),
    
    processSteps: Joi.array()
      .items(processStepSchema)
      .default([]),
    
    contactInfo: contactInfoSchema
      .default({
        email: '',
        phone: '',
        website: '',
        calendlyLink: ''
      }),
    
    socialLinks: Joi.array()
      .items(socialLinkSchema)
      .default([]),
    
    isFeatured: Joi.boolean()
      .default(false),
    
    isPublished: Joi.boolean()
      .default(false),
    
    changeReason: Joi.string()
      .max(200)
      .allow('')
  }).options({ 
    abortEarly: false, 
    allowUnknown: true,
    stripUnknown: true
  });

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
  metaTitle: '',
  metaDescription: '',
  category: '',
  features: [{ title: '', description: '' }],
  icon: '📋',
  price: 0,
  priceNote: '',
  projectTypes: [''],
  benefits: [{ title: '', description: '', icon: '✅' }],
  processSteps: [{ title: '', description: '', order: 0 }],
  contactInfo: {
    email: '',
    phone: '',
    website: '',
    calendlyLink: ''
  },
  socialLinks: [{ platform: '', url: '' }],
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