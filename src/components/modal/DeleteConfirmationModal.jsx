import PropTypes from "prop-types";

const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 h-full flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[80%] max-w-md">
        <h2 className="text-primary-text font-medium text-[24px] mb-2">
          Delete comment
        </h2>
        <p className="text-secondary text-base mb-6">
          Are you sure you want to delete this comment? This will remove the
          comment and can’t be undone.
        </p>
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 w-full h-[48px] bg-secondary text-white uppercase rounded-md hover:bg-gray-400 cursor-pointer"
          >
            No, Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 w-full bg-danger text-white uppercase rounded-md hover:bg-danger-hover cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeleteConfirmationModal;
