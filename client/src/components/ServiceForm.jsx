import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Tab, TextInput, Label, Button, Select, Textarea, Alert } from 'flowbite-react';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineCheck } from 'react-icons/hi';

const categories = [
  { value: 'assessments', label: 'Assessments' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'safeguards', label: 'Safeguards' },
  { value: 'planning', label: 'Planning' },
  { value: 'sustainability', label: 'Sustainability' },
];

const socialPlatforms = [
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
];

export default function ServiceForm({
  show,
  onClose,
  onSubmit,
  formData: initialData = {},
  loading,
}) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: 0,
    description: '',
    fullDescription: '',
    icon: '📋',
    heroText: '',
    introduction: '',
    isFeatured: false,
    calendlyLink: '',
    image: ''
  });

  const [processSteps, setProcessSteps] = useState([{ title: '', description: '' }]);
  const [projectTypes, setProjectTypes] = useState(['']);
  const [benefits, setBenefits] = useState([{ title: '', description: '' }]);
  const [features, setFeatures] = useState(['']);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    website: ''
  });
  const [socialLinks, setSocialLinks] = useState([{ platform: '', url: '' }]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (show && initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || '',
        price: initialData.price || 0,
        description: initialData.description || '',
        fullDescription: initialData.fullDescription || '',
        icon: initialData.icon || '📋',
        heroText: initialData.heroText || '',
        introduction: initialData.introduction || '',
        isFeatured: initialData.isFeatured || false,
        calendlyLink: initialData.calendlyLink || '',
        image: initialData.image || ''
      });

      setProcessSteps(initialData.processSteps || [{ title: '', description: '' }]);
      setProjectTypes(initialData.projectTypes || ['']);
      setBenefits(initialData.benefits || [{ title: '', description: '' }]);
      setFeatures(initialData.features || ['']);
      setContactInfo(initialData.contactInfo || { email: '', phone: '', website: '' });
      setSocialLinks(initialData.socialLinks || [{ platform: '', url: '' }]);
      setErrors({});
      setFormError('');
    }
  }, [show, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleProcessStepChange = (index, field, value) => {
    const newSteps = [...processSteps];
    newSteps[index][field] = value;
    setProcessSteps(newSteps);
  };

  const addProcessStep = () => {
    setProcessSteps([...processSteps, { title: '', description: '' }]);
  };

  const removeProcessStep = (index) => {
    if (processSteps.length > 1) {
      setProcessSteps(processSteps.filter((_, i) => i !== index));
    }
  };

  const handleProjectTypeChange = (index, value) => {
    const newTypes = [...projectTypes];
    newTypes[index] = value;
    setProjectTypes(newTypes);
  };

  const addProjectType = () => {
    setProjectTypes([...projectTypes, '']);
  };

  const removeProjectType = (index) => {
    if (projectTypes.length > 1) {
      setProjectTypes(projectTypes.filter((_, i) => i !== index));
    }
  };

  const handleBenefitChange = (index, field, value) => {
    const newBenefits = [...benefits];
    newBenefits[index][field] = value;
    setBenefits(newBenefits);
  };

  const addBenefit = () => {
    setBenefits([...benefits, { title: '', description: '' }]);
  };

  const removeBenefit = (index) => {
    if (benefits.length > 1) {
      setBenefits(benefits.filter((_, i) => i !== index));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleSocialLinkChange = (index, field, value) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setSocialLinks(newLinks);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: '', url: '' }]);
  };

  const removeSocialLink = (index) => {
    if (socialLinks.length > 1) {
      setSocialLinks(socialLinks.filter((_, i) => i !== index));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Basic Info Validation
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (isNaN(formData.price)) newErrors.price = 'Price must be a number';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (!formData.description.trim()) newErrors.description = 'Short description is required';
    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Full description is required';

    // Process Steps Validation
    processSteps.forEach((step, index) => {
      if (!step.title.trim()) newErrors[`processStepTitle${index}`] = 'Step title is required';
      if (!step.description.trim()) newErrors[`processStepDesc${index}`] = 'Step description is required';
    });

    // Project Types Validation
    projectTypes.forEach((type, index) => {
      if (!type.trim()) newErrors[`projectType${index}`] = 'Project type is required';
    });

    // Benefits Validation
    benefits.forEach((benefit, index) => {
      if (!benefit.title.trim()) newErrors[`benefitTitle${index}`] = 'Benefit title is required';
      if (!benefit.description.trim()) newErrors[`benefitDesc${index}`] = 'Benefit description is required';
    });

    // Features Validation
    if (features.length === 0 || features.some(f => !f.trim())) {
      newErrors.features = 'At least one feature is required';
    }

    // Contact Info Validation
    if (contactInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (contactInfo.phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(contactInfo.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (contactInfo.website && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(contactInfo.website)) {
      newErrors.website = 'Invalid website URL';
    }

    // Social Links Validation
    socialLinks.forEach((link, index) => {
      if (link.platform && !link.url) {
        newErrors[`socialUrl${index}`] = 'URL is required when platform is selected';
      }
      if (link.url && !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(link.url)) {
        newErrors[`socialUrl${index}`] = 'Invalid URL format';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (validate()) {
      const serviceData = {
        ...formData,
        processSteps: processSteps.filter(step => step.title.trim() && step.description.trim()),
        projectTypes: projectTypes.filter(type => type.trim()),
        benefits: benefits.filter(benefit => benefit.title.trim() && benefit.description.trim()),
        features: features.filter(feature => feature.trim()),
        contactInfo,
        socialLinks: socialLinks.filter(link => link.platform && link.url)
      };

      if (initialData?._id) {
        serviceData._id = initialData._id;
      }

      onSubmit(serviceData);
    } else {
      setFormError('Please fix the errors in the form');
      setActiveTab(
        Object.keys(errors)[0].includes('processStep') ? 'process' : 
        Object.keys(errors)[0].includes('projectType') ? 'projects' :
        Object.keys(errors)[0].includes('benefit') ? 'benefits' :
        Object.keys(errors)[0].includes('contact') ? 'contact' : 'basic'
      );
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="4xl">
      <Modal.Header>
        {initialData?._id ? 'Edit Service' : 'Create New Service'}
      </Modal.Header>
      <Modal.Body>
        {formError && (
          <Alert color="failure" className="mb-4">
            {formError}
          </Alert>
        )}

        <Tabs.Group
          aria-label="Service form tabs"
          style="underline"
          onActiveTabChange={setActiveTab}
        >
          {/* Basic Info Tab */}
          <Tabs.Item active={activeTab === 'basic'} title="Basic Info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="title" value="Title*" />
                <TextInput
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  color={errors.title ? 'failure' : 'gray'}
                  helperText={errors.title}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" value="Category*" />
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  color={errors.category ? 'failure' : 'gray'}
                  helperText={errors.category}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="price" value="Price (KES)*" />
                <TextInput
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  color={errors.price ? 'failure' : 'gray'}
                  helperText={errors.price}
                  required
                />
              </div>

              <div>
                <Label htmlFor="icon" value="Icon (Emoji)" />
                <TextInput
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g. 📋"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" value="Short Description*" />
                <TextInput
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  color={errors.description ? 'failure' : 'gray'}
                  helperText={errors.description}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="fullDescription" value="Full Description*" />
                <Textarea
                  id="fullDescription"
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({...formData, fullDescription: e.target.value})}
                  rows={4}
                  color={errors.fullDescription ? 'failure' : 'gray'}
                  helperText={errors.fullDescription}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="heroText" value="Hero Text" />
                <TextInput
                  id="heroText"
                  name="heroText"
                  value={formData.heroText}
                  onChange={handleChange}
                  placeholder="Catchy headline for the service page"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="introduction" value="Introduction Paragraph" />
                <Textarea
                  id="introduction"
                  name="introduction"
                  value={formData.introduction}
                  onChange={(e) => setFormData({...formData, introduction: e.target.value})}
                  rows={3}
                  placeholder="Introductory text for the service page"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="isFeatured"
                  name="isFeatured"
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                  className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500"
                />
                <Label htmlFor="isFeatured" value="Featured Service" />
              </div>
            </div>
          </Tabs.Item>

          {/* Process Steps Tab */}
          <Tabs.Item active={activeTab === 'process'} title="Process Steps">
            <div className="mt-4 space-y-4">
              <Label value="Our Process Steps*" />
              {processSteps.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <Label value={`Step ${index + 1} Title*`} />
                      <TextInput
                        value={step.title}
                        onChange={(e) => handleProcessStepChange(index, 'title', e.target.value)}
                        color={errors[`processStepTitle${index}`] ? 'failure' : 'gray'}
                        helperText={errors[`processStepTitle${index}`]}
                        required
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => removeProcessStep(index)}
                        disabled={processSteps.length <= 1}
                      >
                        <HiOutlineTrash className="mr-1" /> Remove Step
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label value={`Step ${index + 1} Description*`} />
                    <Textarea
                      value={step.description}
                      onChange={(e) => handleProcessStepChange(index, 'description', e.target.value)}
                      rows={3}
                      color={errors[`processStepDesc${index}`] ? 'failure' : 'gray'}
                      helperText={errors[`processStepDesc${index}`]}
                      required
                    />
                  </div>
                </div>
              ))}
              <Button
                gradientMonochrome="info"
                onClick={addProcessStep}
                className="mt-2"
              >
                <HiOutlinePlus className="mr-2" /> Add Process Step
              </Button>
            </div>
          </Tabs.Item>

          {/* Project Types Tab */}
          <Tabs.Item active={activeTab === 'projects'} title="Project Types">
            <div className="mt-4 space-y-4">
              <Label value="Supported Project Types*" />
              {projectTypes.map((type, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <TextInput
                      value={type}
                      onChange={(e) => handleProjectTypeChange(index, e.target.value)}
                      color={errors[`projectType${index}`] ? 'failure' : 'gray'}
                      helperText={errors[`projectType${index}`]}
                      required
                    />
                  </div>
                  <Button
                    color="failure"
                    size="xs"
                    onClick={() => removeProjectType(index)}
                    disabled={projectTypes.length <= 1}
                  >
                    <HiOutlineTrash />
                  </Button>
                </div>
              ))}
              <Button
                gradientMonochrome="info"
                onClick={addProjectType}
                className="mt-2"
              >
                <HiOutlinePlus className="mr-2" /> Add Project Type
              </Button>
            </div>
          </Tabs.Item>

          {/* Benefits Tab */}
          <Tabs.Item active={activeTab === 'benefits'} title="Benefits">
            <div className="mt-4 space-y-4">
              <Label value="Service Benefits*" />
              {benefits.map((benefit, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <Label value={`Benefit ${index + 1} Title*`} />
                      <TextInput
                        value={benefit.title}
                        onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                        color={errors[`benefitTitle${index}`] ? 'failure' : 'gray'}
                        helperText={errors[`benefitTitle${index}`]}
                        required
                      />
                    </div>
                    <div className="flex items-end justify-end">
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => removeBenefit(index)}
                        disabled={benefits.length <= 1}
                      >
                        <HiOutlineTrash className="mr-1" /> Remove Benefit
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label value={`Benefit ${index + 1} Description*`} />
                    <Textarea
                      value={benefit.description}
                      onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                      rows={3}
                      color={errors[`benefitDesc${index}`] ? 'failure' : 'gray'}
                      helperText={errors[`benefitDesc${index}`]}
                      required
                    />
                  </div>
                </div>
              ))}
              <Button
                gradientMonochrome="info"
                onClick={addBenefit}
                className="mt-2"
              >
                <HiOutlinePlus className="mr-2" /> Add Benefit
              </Button>
            </div>
          </Tabs.Item>

          {/* Features Tab */}
          <Tabs.Item active={activeTab === 'features'} title="Features">
            <div className="mt-4 space-y-4">
              <Label value="Key Features*" />
              {errors.features && (
                <Alert color="failure" className="mb-2">
                  {errors.features}
                </Alert>
              )}
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <TextInput
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    color="failure"
                    size="xs"
                    onClick={() => removeFeature(index)}
                    disabled={features.length <= 1}
                  >
                    <HiOutlineTrash />
                  </Button>
                </div>
              ))}
              <Button
                gradientMonochrome="info"
                onClick={addFeature}
                className="mt-2"
              >
                <HiOutlinePlus className="mr-2" /> Add Feature
              </Button>
            </div>
          </Tabs.Item>

          {/* Contact & Social Tab */}
          <Tabs.Item active={activeTab === 'contact'} title="Contact & Social">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
              </div>

              <div>
                <Label htmlFor="contactEmail" value="Email" />
                <TextInput
                  id="contactEmail"
                  name="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={handleContactInfoChange}
                  color={errors.email ? 'failure' : 'gray'}
                  helperText={errors.email}
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone" value="Phone" />
                <TextInput
                  id="contactPhone"
                  name="phone"
                  value={contactInfo.phone}
                  onChange={handleContactInfoChange}
                  color={errors.phone ? 'failure' : 'gray'}
                  helperText={errors.phone}
                  placeholder="+254700000000"
                />
              </div>

              <div>
                <Label htmlFor="website" value="Website" />
                <TextInput
                  id="website"
                  name="website"
                  value={contactInfo.website}
                  onChange={handleContactInfoChange}
                  color={errors.website ? 'failure' : 'gray'}
                  helperText={errors.website}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="calendlyLink" value="Calendly Link" />
                <TextInput
                  id="calendlyLink"
                  name="calendlyLink"
                  value={formData.calendlyLink}
                  onChange={handleChange}
                  placeholder="https://calendly.com/your-link"
                />
              </div>

              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-semibold mb-3">Social Links</h3>
                {socialLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
                    <div className="md:col-span-2">
                      <Label value="Platform" />
                      <Select
                        value={link.platform}
                        onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                      >
                        <option value="">Select platform</option>
                        {socialPlatforms.map(platform => (
                          <option key={platform.value} value={platform.value}>
                            {platform.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label value="URL*" />
                      <TextInput
                        value={link.url}
                        onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                        color={errors[`socialUrl${index}`] ? 'failure' : 'gray'}
                        helperText={errors[`socialUrl${index}`]}
                        placeholder="https://"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        color="failure"
                        size="xs"
                        onClick={() => removeSocialLink(index)}
                        disabled={socialLinks.length <= 1}
                      >
                        <HiOutlineTrash />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  gradientMonochrome="info"
                  onClick={addSocialLink}
                  className="mt-2"
                >
                  <HiOutlinePlus className="mr-2" /> Add Social Link
                </Button>
              </div>
            </div>
          </Tabs.Item>
        </Tabs.Group>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-between w-full">
          <Button color="gray" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            gradientDuoTone="tealToLime"
            onClick={handleSubmit}
            disabled={loading}
            isProcessing={loading}
          >
            <HiOutlineCheck className="mr-2" />
            {initialData?._id ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}