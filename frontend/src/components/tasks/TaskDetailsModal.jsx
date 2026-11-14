import { formatIST } from '../../utils/date';
import Modal from '../common/Modal';

const DetailRow = ({ label, children }) => (
  <div>
    <dt className="text-xs text-gray-400">{label}</dt>
    <dd className="mt-0.5 whitespace-pre-wrap break-words text-sm text-gray-900">{children}</dd>
  </div>
);

const TaskDetailsModal = ({ task, onClose }) => {
  const { title, description, startAt, endAt, priority, isCompleted } = task;

  const startTime = formatIST(startAt, 'h:mm a');
  const timeRange = endAt ? `${startTime} - ${formatIST(endAt, 'h:mm a')}` : startTime;

  return (
    <Modal title="Task Details" onClose={onClose}>
      <dl className="flex flex-col gap-4">
        <DetailRow label="Title">{title}</DetailRow>
        <DetailRow label="Date">{formatIST(startAt, 'EEEE, d MMMM yyyy')}</DetailRow>
        <DetailRow label="Time">{timeRange}</DetailRow>
        <DetailRow label="Priority">
          <span className="capitalize">{priority}</span>
        </DetailRow>
        <DetailRow label="Status">{isCompleted ? 'Completed' : 'In Progress'}</DetailRow>
        {description && <DetailRow label="Description">{description}</DetailRow>}
      </dl>
    </Modal>
  );
};

export default TaskDetailsModal;