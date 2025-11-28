import { FaSpinner } from "react-icons/fa";

const ModalButtons = ({
  onCancel,
  onSubmit,
  isSubmitting,
  submitText = "Submit",
  cancelText = "Cancel",
}) => {
  return (
    <div className="flex justify-end gap-3 mt-5">
      <button
        onClick={onCancel}
        className="px-4 py-2 bg-gray-400 text-white rounded-full"
      >
        {cancelText}
      </button>

      <button
        onClick={onSubmit}
        className="px-4 py-2 bg-bg-50 text-white rounded-full flex items-center gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting && <FaSpinner className="animate-spin" />}
        {isSubmitting ? `${submitText}...` : submitText}
      </button>
    </div>
  );
};

export default ModalButtons;
