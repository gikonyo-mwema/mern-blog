import { 
  Label, 
  TextInput, 
  Textarea, 
  Select, 
  ToggleSwitch, 
  FileInput, 
  Button, 
  Alert 
} from 'flowbite-react';
import { 
  HiOutlinePhotograph, 
  HiOutlineTrash, 
  HiOutlinePlus 
} from 'react-icons/hi';

const ServiceFormTabs = ({
  formData,
  handleChange,
  setFormData,
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
  errors,
  formError,
  loading,
  categories = []
}) => {
  // Static data
  const benefitIcons = [
    { value: '✅', label: 'Check Mark' },
    { value: '⏱️', label: 'Time' },
    { value: '💰', label: 'Money' },
    { value: '🛡️', label: 'Shield' },
    { value: '🌱', label: 'Sustainability' },
  ];

  const socialPlatforms = [
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
  ];

  const envConsultingCategories = [
    { _id: 'env1', name: 'Environmental Impact Assessment' },
    { _id: 'env2', name: 'Air Quality Monitoring' },
    { _id: 'env3', name: 'Water Resource Management' },
    { _id: 'env4', name: 'Waste Management Consulting' },
    { _id: 'env5', name: 'Sustainability Planning' },
    { _id: 'env6', name: 'Environmental Compliance' },
    { _id: 'env7', name: 'Ecological Surveys' },
    { _id: 'env8', name: 'Carbon Footprint Analysis' },
    { _id: 'env9', name: 'Soil Contamination Studies' },
    { _id: 'env10', name: 'Environmental Auditing' }
  ];

  // Combine dynamic and static categories
  const allCategories = [
    ...new Map([
      ...envConsultingCategories.map(item => [item._id, item]),
      ...categories.map(item => [item._id, item])
    ]).values()
  ];

  // Destructure form data
  const {
    projectTypes = [],
    benefits = [],
    features = [],
    contactInfo = {},
    socialLinks = []
  } = formData;

  // Basic Info Section
  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
      </div>

      {/* Service Title */}
      <div className="md:col-span-2">
        <Label htmlFor="title" value="Service Title*" />
        <TextInput
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          color={errors.title ? 'failure' : 'gray'}
          helperText={errors.title}
          disabled={loading}
          placeholder="e.g., Environmental Impact Assessment Services"
        />
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category" value="Category*" />
        <TextInput
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          color={errors.category ? 'failure' : 'gray'}
          helperText={errors.category || "E.g., Environmental Impact Assessment"}
          disabled={loading}
          placeholder="Enter service category"
        />
      </div>

      {/* Price */}
      <div>
        <Label htmlFor="price" value="Price (KES)" />
        <TextInput
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          color={errors.price ? 'failure' : 'gray'}
          helperText={errors.price}
          disabled={loading}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>

      {/* Short Description */}
      <div className="md:col-span-2">
        <Label htmlFor="shortDescription" value="Short Description*" />
        <Textarea
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          rows={3}
          color={errors.shortDescription ? 'failure' : 'gray'}
          helperText={errors.shortDescription}
          disabled={loading}
          placeholder="Brief summary of your environmental service"
        />
      </div>

      {/* Full Description */}
      <div className="md:col-span-2">
        <Label htmlFor="description" value="Full Description*" />
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={6}
          color={errors.description ? 'failure' : 'gray'}
          helperText={errors.description}
          disabled={loading}
          placeholder="Detailed description of your environmental consulting service..."
        />
      </div>

      {/* Meta Fields */}
      <div>
        <Label htmlFor="metaTitle" value="SEO Title" />
        <TextInput
          id="metaTitle"
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleChange}
          disabled={loading}
          placeholder="Title for search engines"
        />
      </div>
      <div>
        <Label htmlFor="metaDescription" value="SEO Description" />
        <TextInput
          id="metaDescription"
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleChange}
          disabled={loading}
          placeholder="Description for search engines"
        />
      </div>

      {/* Status Toggle */}
      <div className="md:col-span-2 flex items-center gap-2">
        <ToggleSwitch
          checked={formData.isFeatured || false}
          label="Featured Service"
          onChange={(checked) => setFormData({
            ...formData,
            isFeatured: checked
          })}
          disabled={loading}
        />
      </div>
    </div>
  );

  // Project Types Section
  const renderProjectTypes = () => (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Project Types</h2>
      <div className="space-y-4">
        <Label value="Supported Project Types*" />
        {projectTypes.map((type, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div className="flex-1">
              <TextInput
                value={type}
                onChange={(e) => handleProjectTypeChange(index, e.target.value)}
                color={errors[`projectType${index}`] ? 'failure' : 'gray'}
                helperText={errors[`projectType${index}`]}
                disabled={loading}
                placeholder="Petrol stations and fuel storage"
              />
            </div>
            <Button
              color="failure"
              size="xs"
              onClick={() => removeProjectType(index)}
              disabled={projectTypes.length <= 1 || loading}
            >
              <HiOutlineTrash />
            </Button>
          </div>
        ))}
        <Button
          gradientMonochrome="info"
          onClick={addProjectType}
          disabled={loading}
        >
          <HiOutlinePlus className="mr-2" /> Add Project Type
        </Button>
      </div>
    </div>
  );

  // Benefits Section
  const renderBenefits = () => (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Service Benefits</h2>
      <div className="space-y-4">
        <Label value="Service Benefits*" />
        {benefits.map((benefit, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <Label value={`Benefit ${index + 1} Title*`} />
                <TextInput
                  value={benefit.title}
                  onChange={(e) => handleBenefitChange(index, 'title', e.target.value)}
                  color={errors[`benefitTitle${index}`] ? 'failure' : 'gray'}
                  helperText={errors[`benefitTitle${index}`]}
                  disabled={loading}
                  placeholder="Expertise you can trust"
                />
              </div>
              <div className="flex items-end justify-end">
                <Button
                  color="failure"
                  size="xs"
                  onClick={() => removeBenefit(index)}
                  disabled={benefits.length <= 1 || loading}
                >
                  <HiOutlineTrash className="mr-1" /> Remove
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label value="Icon" />
                <Select
                  value={benefit.icon || '✅'}
                  onChange={(e) => handleBenefitChange(index, 'icon', e.target.value)}
                  disabled={loading}
                >
                  {benefitIcons.map(icon => (
                    <option key={icon.value} value={icon.value}>{icon.label} {icon.value}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label value={`Description*`} />
                <Textarea
                  value={benefit.description}
                  onChange={(e) => handleBenefitChange(index, 'description', e.target.value)}
                  rows={3}
                  color={errors[`benefitDesc${index}`] ? 'failure' : 'gray'}
                  helperText={errors[`benefitDesc${index}`]}
                  disabled={loading}
                  placeholder="Our team is fully licensed and certified..."
                />
              </div>
            </div>
          </div>
        ))}
        <Button
          gradientMonochrome="info"
          onClick={addBenefit}
          disabled={loading}
        >
          <HiOutlinePlus className="mr-2" /> Add Benefit
        </Button>
      </div>
    </div>
  );

  // Features Section
  const renderFeatures = () => (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Service Features</h2>
      <div className="space-y-4">
        <Label value="Service Features*" />
        {features.map((feature, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div>
                <Label value={`Feature ${index + 1} Title*`} />
                <TextInput
                  value={feature.title}
                  onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                  color={errors[`featureTitle${index}`] ? 'failure' : 'gray'}
                  helperText={errors[`featureTitle${index}`]}
                  disabled={loading}
                  placeholder="Custom solutions"
                />
              </div>
              <div className="flex items-end justify-end">
                <Button
                  color="failure"
                  size="xs"
                  onClick={() => removeFeature(index)}
                  disabled={features.length <= 1 || loading}
                >
                  <HiOutlineTrash className="mr-1" /> Remove
                </Button>
              </div>
            </div>
            <div>
              <Label value={`Feature ${index + 1} Description*`} />
              <Textarea
                value={feature.description}
                onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                rows={3}
                color={errors[`featureDesc${index}`] ? 'failure' : 'gray'}
                helperText={errors[`featureDesc${index}`]}
                disabled={loading}
                placeholder="Detailed description of this feature"
              />
            </div>
          </div>
        ))}
        <Button
          gradientMonochrome="info"
          onClick={addFeature}
          disabled={loading}
        >
          <HiOutlinePlus className="mr-2" /> Add Feature
        </Button>
      </div>
    </div>
  );

  // Contact & Social Section
  const renderContactSocial = () => (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Contact & Social</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            disabled={loading}
            placeholder="info@ecodeed.co.ke"
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
            disabled={loading}
            placeholder="+254791233100"
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
            disabled={loading}
            placeholder="https://www.ecodeed.co.ke"
          />
        </div>

        <div>
          <Label htmlFor="calendlyLink" value="Calendly Link" />
          <TextInput
            id="calendlyLink"
            name="calendlyLink"
            value={contactInfo.calendlyLink}
            onChange={handleContactInfoChange}
            disabled={loading}
            placeholder="https://calendly.com/ecodeed"
          />
        </div>

        <div className="md:col-span-2 mt-6">
          <h3 className="text-lg font-semibold mb-3">Social Links</h3>
          {socialLinks.map((link, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
              <div className="md:col-span-2">
                <Label value="Platform" />
                <Select
                  value={link.platform}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                  disabled={loading}
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
                <Label value="URL" />
                <TextInput
                  value={link.url}
                  onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                  color={errors[`socialUrl${index}`] ? 'failure' : 'gray'}
                  helperText={errors[`socialUrl${index}`]}
                  disabled={loading}
                  placeholder="https://"
                />
              </div>
              <div className="flex items-end">
                <Button
                  color="failure"
                  size="xs"
                  onClick={() => removeSocialLink(index)}
                  disabled={socialLinks.length <= 1 || loading}
                >
                  <HiOutlineTrash />
                </Button>
              </div>
            </div>
          ))}
          <Button
            gradientMonochrome="info"
            onClick={addSocialLink}
            disabled={loading}
          >
            <HiOutlinePlus className="mr-2" /> Add Social Link
          </Button>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="space-y-8 pb-4"> {/* Added padding-bottom for scroll spacing */}
      {formError && (
        <Alert color="failure" className="mb-4">
          {formError}
        </Alert>
      )}

      {renderBasicInfo()}
      {renderProjectTypes()}
      {renderBenefits()}
      {renderFeatures()}
      {renderContactSocial()}
    </div>
  );
};

export default ServiceFormTabs;