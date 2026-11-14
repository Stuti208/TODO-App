import Modal from './Modal';

const ConfirmDialog = ({ title, message, confirmLabel, onConfirm, onCancel }) => (
  <Modal title={title} onClose={onCancel}>
    <p className="text-sm text-gray-600">{message}</p>
    <div className="mt-5 flex gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-lg border border-gray-200 py-3 text-sm font-medium text-gray-700"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="flex-1 rounded-lg bg-danger py-3 text-sm font-medium text-white"
      >
        {confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;