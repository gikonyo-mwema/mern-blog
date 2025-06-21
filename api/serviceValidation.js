import Joi from 'joi';

const processStepSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().required(),
  order: Joi.number().min(1)
});

const benefitSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().required(),
  icon: Joi.string()
});

const projectTypeSchema = Joi.object({
  name: Joi.string().required().max(100),
  description: Joi.string()
});

const featureSchema = Joi.object({
  title: Joi.string().required().max(100),
  description: Joi.string().required(),
  icon: Joi.string()
});

const socialLinkSchema = Joi.object({
  platform: Joi.string().valid(
    'twitter', 
    'facebook', 
    'linkedin', 
    'instagram', 
    'youtube', 
    'other'
  ).required(),
  url: Joi.string().uri().required()
});

const contactInfoSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
  website: Joi.string().uri()
});

const imageSchema = Joi.object({
  url: Joi.string().uri().required(),
  altText: Joi.string().max(100),
  isPrimary: Joi.boolean()
});

export const validateServiceData = (data, isUpdate = false) => {
  const schema = Joi.object({
    title: isUpdate 
      ? Joi.string().max(100)
      : Joi.string().required().max(100),
    
    shortDescription: isUpdate
      ? Joi.string().max(200)
      : Joi.string().required().max(200),
    
    description: isUpdate
      ? Joi.string()
      : Joi.string().required(),
    
    fullDescription: isUpdate
      ? Joi.string()
      : Joi.string().required(),
    
    category: Joi.string().valid(
      'assessments',
      'compliance',
      'safeguards',
      'planning',
      'sustainability',
      'consulting',
      'training'
    ),
    
    features: Joi.array().items(featureSchema),
    icon: Joi.string(),
    price: Joi.number().min(0),
    priceNote: Joi.string().max(100),
    heroText: Joi.string().max(200),
    processSteps: Joi.array().items(processStepSchema),
    projectTypes: Joi.array().items(projectTypeSchema),
    benefits: Joi.array().items(benefitSchema),
    contactInfo: contactInfoSchema,
    isFeatured: Joi.boolean(),
    isPublished: Joi.boolean(),
    calendlyLink: Joi.string().uri(),
    socialLinks: Joi.array().items(socialLinkSchema),
    images: Joi.array().items(imageSchema),
    changeReason: Joi.string().max(200)
  });

  const { error, value } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: true
  });

  const errors = {};
  if (error) {
    error.details.forEach(err => {
      errors[err.path[0]] = err.message;
    });
  }

  return {
    valid: !error,
    errors,
    value
  };
};