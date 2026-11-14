import { useState } from 'react';
import { Check, Eye, SquarePen, Trash2 } from 'lucide-react';
import { useTaskForm } from '../../context/TaskFormContext';
import { useDeleteTask, useUpdateTaskStatus } from '../../hooks/useTaskMutations';
import { formatIST } from '../../utils/date';
import ConfirmDialog from '../common/ConfirmDialog';
import SwipeableRow from '../common/SwipeableRow';
import TaskDetailsModal from './TaskDetailsModal';

const DEFAULT_ACTIONS = ['edit', 'delete'];

const IconButton = ({ icon: Icon, label, onClick }) => (
  <button type="button" onClick={onClick} aria-label={label} className="p-1 text-gray-400">
    <Icon size={18} aria-hidden="true" />
  </button>
);

const TaskItem = ({ task, actions = DEFAULT_ACTIONS, showDate = false }) => {
  const { _id: id, title, isCompleted, startAt } = task;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { openEdit } = useTaskForm();
  const { mutate: updateStatus } = useUpdateTaskStatus();
  const { mutate: removeTask } = useDeleteTask();

  const startTime = formatIST(startAt, 'h:mm a');
  const caption = showDate ? `${formatIST(startAt, 'EEE, d MMM')} · ${startTime}` : startTime;

  const handleConfirmDelete = () => {
    removeTask(id);
    setIsConfirmOpen(false);
  };

  return (
    <li className="border-b border-gray-100 last:border-b-0">
      <SwipeableRow actionLabel="Delete" onAction={() => removeTask(id)}>
        <div className="flex items-center gap-3 py-3">
          <button
            type="button"
            role="checkbox"
            aria-checked={isCompleted}
            aria-label={`Mark "${title}" as ${isCompleted ? 'in progress' : 'completed'}`}
            onClick={() => updateStatus({ id, isCompleted: !isCompleted })}
            className={`flex size-5 shrink-0 items-center justify-center rounded border-[1.5px] border-primary ${
              isCompleted ? 'bg-primary text-white' : 'bg-white'
            }`}
          >
            {isCompleted && <Check size={14} strokeWidth={3} aria-hidden="true" />}
          </button>

          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-sm ${
                isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}
            >
              {title}
            </p>
            <p className="text-[11px] text-gray-400">{caption}</p>
          </div>

          {actions.includes('view') && (
            <IconButton icon={Eye} label="View task" onClick={() => setIsDetailsOpen(true)} />
          )}
          {actions.includes('edit') && (
            <IconButton icon={SquarePen} label="Edit task" onClick={() => openEdit(task)} />
          )}
          {actions.includes('delete') && (
            <IconButton icon={Trash2} label="Delete task" onClick={() => setIsConfirmOpen(true)} />
          )}
        </div>
      </SwipeableRow>

      {isDetailsOpen && <TaskDetailsModal task={task} onClose={() => setIsDetailsOpen(false)} />}
      {isConfirmOpen && (
        <ConfirmDialog
          title="Delete task?"
          message={`"${title}" will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsConfirmOpen(false)}
        />
      )}
    </li>
  );
};

export default TaskItem;