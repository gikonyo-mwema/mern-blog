import { Tabs, Alert } from 'flowbite-react';
import BasicInfoTab from './BasicInfoTab';
import ProjectTypesTab from './ProjectTypesTab';
import BenefitsTab from './BenefitsTab';
import ContactSocialTab from './ContactSocialTab';
import FeaturesTab from './FeaturesTab';

const ServiceFormTabs = ({
  activeTab,
  setActiveTab,
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
  // Destructure the needed properties from formData
  const {
    projectTypes = [],
    benefits = [],
    features = [],
    contactInfo = {},
    socialLinks = []
  } = formData;

  return (
    <>
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
        <Tabs.Item active={activeTab === 'basic'} title="Basic Info">
          <BasicInfoTab 
            formData={formData}
            handleChange={handleChange}
            setFormData={setFormData}
            errors={errors}
            loading={loading}
            categories={categories}
          />
        </Tabs.Item>

        <Tabs.Item active={activeTab === 'projects'} title="Project Types">
          <ProjectTypesTab
            projectTypes={projectTypes}
            handleProjectTypeChange={handleProjectTypeChange}
            addProjectType={addProjectType}
            removeProjectType={removeProjectType}
            errors={errors}
            loading={loading}
          />
        </Tabs.Item>

        <Tabs.Item active={activeTab === 'benefits'} title="Benefits">
          <BenefitsTab
            benefits={benefits}
            handleBenefitChange={handleBenefitChange}
            addBenefit={addBenefit}
            removeBenefit={removeBenefit}
            errors={errors}
            loading={loading}
          />
        </Tabs.Item>

        <Tabs.Item active={activeTab === 'features'} title="Features">
          <FeaturesTab
            features={features}
            handleFeatureChange={handleFeatureChange}
            addFeature={addFeature}
            removeFeature={removeFeature}
            errors={errors}
            loading={loading}
          />
        </Tabs.Item>

        <Tabs.Item active={activeTab === 'contact'} title="Contact & Social">
          <ContactSocialTab
            contactInfo={contactInfo}
            handleContactInfoChange={handleContactInfoChange}
            socialLinks={socialLinks}
            handleSocialLinkChange={handleSocialLinkChange}
            addSocialLink={addSocialLink}
            removeSocialLink={removeSocialLink}
            errors={errors}
            loading={loading}
          />
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
};

export default ServiceFormTabs;