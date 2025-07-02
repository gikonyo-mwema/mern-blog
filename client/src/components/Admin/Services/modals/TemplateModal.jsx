import { Modal, Button } from 'flowbite-react';
import { HiOutlineTemplate } from 'react-icons/hi';

const TemplateModal = ({ show, onClose, onSave, loading }) => {
  return (
    <Modal show={show} onClose={onClose} size="md">
      <Modal.Header>Save as Template</Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <p className="mb-4">Save this service as a template for future use?</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-2 w-full">
          <Button color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button
            gradientMonochrome="info"
            onClick={onSave}
            disabled={loading}
          >
            <HiOutlineTemplate className="mr-2" />
            Save Template
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TemplateModal;