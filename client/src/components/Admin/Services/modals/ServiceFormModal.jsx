import { useState } from 'react';
import { Modal, Button, Badge } from 'flowbite-react';
import {
  HiOutlineSave, HiOutlineTemplate, HiOutlineClock
} from 'react-icons/hi';
import ServiceFormTabs from "../ServiceForm/ServiceFormTabs";

const ServiceFormModal = ({
  show, 
  onClose, 
  editMode, 
  currentService, 
  formData,
  onSaveDraft, 
  onSaveTemplate, 
  onViewHistory,
  onSubmit, 
  loading = {},
  categories = [], 
  errors = {}, 
  formHandlers
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  const {
    handleChange,
    handleContactInfoChange,
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
    handleSocialLinkChange, 
    addSocialLink, 
    removeSocialLink,
    setFormData
  } = formHandlers || {};

  const handleSubmit = (shouldPublish) => (e) => {
    e.preventDefault();
    onSubmit({ 
      ...formData, 
      isPublished: shouldPublish 
    });
  };

  return (
    <Modal show={show} onClose={onClose} size="7xl">
      <Modal.Header>
        {editMode ? `Edit ${currentService?.title}` : 'Create New Service'}
        {editMode && (
          <Badge color="gray" className="ml-2">
            {currentService?.isPublished ? 'Published' : 'Draft'}
          </Badge>
        )}
      </Modal.Header>
      <Modal.Body>
        <div className="flex justify-end gap-2 mb-4">
          <Button 
            color="light" 
            onClick={(e) => {
              e.preventDefault();
              onSaveDraft(formData);
            }}
            disabled={loading.operation}
          >
            <HiOutlineSave className="mr-2" /> Save Draft
          </Button>
          <Button 
            gradientMonochrome="info" 
            onClick={(e) => {
              e.preventDefault();
              onSaveTemplate(formData);
            }}
            disabled={loading.operation}
          >
            <HiOutlineTemplate className="mr-2" /> Save as Template
          </Button>
          {editMode && (
            <Button 
              color="light" 
              onClick={(e) => {
                e.preventDefault();
                onViewHistory();
              }}
              disabled={loading.operation}
            >
              <HiOutlineClock className="mr-2" /> Version History
            </Button>
          )}
        </div>

        <ServiceFormTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          formData={formData}
          handleChange={handleChange}
          setFormData={setFormData}
          handleContactInfoChange={handleContactInfoChange}
          handleProcessStepChange={handleProcessStepChange}
          addProcessStep={addProcessStep}
          removeProcessStep={removeProcessStep}
          handleProjectTypeChange={handleProjectTypeChange}
          addProjectType={addProjectType}
          removeProjectType={removeProjectType}
          handleBenefitChange={handleBenefitChange}
          addBenefit={addBenefit}
          removeBenefit={removeBenefit}
          handleFeatureChange={handleFeatureChange}
          addFeature={addFeature}
          removeFeature={removeFeature}
          handleSocialLinkChange={handleSocialLinkChange}
          addSocialLink={addSocialLink}
          removeSocialLink={removeSocialLink}
          errors={errors}
          loading={Boolean(loading.operation)}
          categories={categories}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>Cancel</Button>
        <div className="flex gap-2">
          <Button
            gradientDuoTone="tealToLime"
            onClick={handleSubmit(false)}
            disabled={loading.operation}
          >
            Save as Draft
          </Button>
          <Button
            gradientDuoTone="purpleToBlue"
            onClick={handleSubmit(true)}
            disabled={loading.operation}
          >
            {editMode ? 'Update and Publish' : 'Publish Service'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ServiceFormModal;
