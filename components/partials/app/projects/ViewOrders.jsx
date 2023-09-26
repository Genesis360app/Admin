import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";

const EditProject = ({ initialEditItem, onClose }) => {
  const [editModal, setEditModal] = useState(false);
  const [editItem, setEditItem] = useState(initialEditItem);
  const [itemId, setItemId] = useState(""); // State to store the item ID

  useEffect(() => {
    setEditModal(true);
    // Update the itemId state when editItem changes
    if (initialEditItem && initialEditItem?.id) {
      setItemId(initialEditItem?.id);
    }
    console.log("selectedOrder:", selectedOrder); // Add this line for debugging
    console.log("initialEditItem:", initialEditItem); // Add this line for debugging
  }, [initialEditItem]);

  const handleCloseModal = () => {
    setEditModal(false);
    // Optionally, you can reset the editItem and itemId states here
    setEditItem({});
    setItemId("");
    // Call the onClose callback to handle modal closure in the parent component
    onClose();
  };

  return (
    <Modal
      title="Edit Project"
      activeModal={editModal}
      onClose={handleCloseModal}
    >
      <form className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-600">
            Item ID: {itemId}
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default EditProject;
