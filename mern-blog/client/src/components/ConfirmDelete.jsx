import React from 'react';
import { Modal, Button } from 'flowbite-react';

export default function ConfirmDelete({ open, onClose, onConfirm, loading, itemName = 'item' }) {
  return (
    <Modal show={open} onClose={onClose}>
      <Modal.Header>Confirm Deletion</Modal.Header>
      <Modal.Body>
        <p className="text-red-600">
          Are you sure you want to delete this {itemName}? This action cannot be undone.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button color="failure" onClick={onConfirm} isProcessing={loading}>
          Delete
        </Button>
        <Button color="gray" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
