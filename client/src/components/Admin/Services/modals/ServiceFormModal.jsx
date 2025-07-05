import { Modal, Button, Badge } from 'flowbite-react';
import { HiOutlineClock } from 'react-icons/hi';
import ServiceFormTabs from "../ServiceForm/ServiceFormTabs";

const ServiceFormModal = ({
  show, 
  onClose, 
  editMode, 
  currentService, 
  formData,
  onViewHistory,
  onSubmit, 
  loading = {},
  categories = [], 
  errors = {}, 
  formHandlers
}) => {
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

  const handlePublish = (e) => {
    e.preventDefault();
    onSubmit({ 
      ...formData, 
      isPublished: true 
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
      
      <Modal.Body className="max-h-[80vh] overflow-y-auto">
        {editMode && (
          <div className="flex justify-end mb-4">
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
          </div>
        )}

        <ServiceFormTabs
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

      <Modal.Footer className="flex justify-end gap-3">
        <Button color="gray" onClick={onClose}>
          Cancel
        </Button>
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={handlePublish}
          disabled={loading.operation}
        >
          {editMode ? 'Update Service' : 'Publish Service'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ServiceFormModal;