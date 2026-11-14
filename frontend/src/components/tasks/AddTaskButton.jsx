import { Plus } from 'lucide-react';
import { useTaskForm } from '../../context/TaskFormContext';

const AddTaskButton = ({ defaultDate }) => {
  const { openCreate } = useTaskForm();

  return (
    <button
      type="button"
      onClick={() => openCreate(defaultDate)}
      aria-label="Add new task"
      className="fixed bottom-6 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40"
    >
      <Plus size={28} aria-hidden="true" />
    </button>
  );
};

export default AddTaskButton;