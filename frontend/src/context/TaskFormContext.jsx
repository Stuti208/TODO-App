import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import TaskFormModal from '../components/tasks/TaskFormModal';

const TaskFormContext = createContext(null);

export const TaskFormProvider = ({ children }) => {
  const [formState, setFormState] = useState(null); // null means closed

  const openCreate = useCallback(
    (defaultDate) => setFormState({ task: null, defaultDate }),
    []
  );
  const openEdit = useCallback((task) => setFormState({ task, defaultDate: null }), []);
  const closeForm = useCallback(() => setFormState(null), []);

  const value = useMemo(() => ({ openCreate, openEdit }), [openCreate, openEdit]);

  return (
    <TaskFormContext.Provider value={value}>
      {children}
      {formState && (
        <TaskFormModal
          task={formState.task}
          defaultDate={formState.defaultDate}
          onClose={closeForm}
        />
      )}
    </TaskFormContext.Provider>
  );
};

export const useTaskForm = () => {
  const context = useContext(TaskFormContext);
  if (!context) throw new Error('useTaskForm must be used inside TaskFormProvider');
  return context;
};