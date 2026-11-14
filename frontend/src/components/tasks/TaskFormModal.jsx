import { useState } from 'react';
import { getErrorMessage } from '../../api/getErrorMessage';
import { useCreateTask, useUpdateTask } from '../../hooks/useTaskMutations';
import { buildTaskPayload, getInitialFormValues, validateTaskForm } from '../../utils/taskForm';
import Modal from '../common/Modal';

const PRIORITIES = ['low', 'medium', 'high'];

const inputClassName =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary';

const Field = ({ label, error, required = false, children }) => (
  <label className="block">
    <span className="mb-1 block text-xs font-medium text-gray-500">
      {label}
      {required && (
        <span className="ml-0.5 text-danger" aria-hidden="true">
          *
        </span>
      )}
    </span>
    {children}
    {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
  </label>
);

const TaskFormModal = ({ task, defaultDate, onClose }) => {
  const isEditing = Boolean(task);

  const [values, setValues] = useState(() => getInitialFormValues(task, defaultDate));
  const [errors, setErrors] = useState({});

  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const mutation = isEditing ? updateMutation : createMutation;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined })); // clear the error while typing
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateTaskForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = buildTaskPayload(values);

    if (isEditing) {
      mutation.mutate({ id: task._id, payload }, { onSuccess: onClose });
    } else {
      mutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return (
    <Modal title={isEditing ? 'Edit Task' : 'Add New Task'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field label="Task Title" required error={errors.title}>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="Doing Homework"
            autoFocus
            className={inputClassName}
          />
        </Field>

        <fieldset>
          <legend className="mb-1 text-xs font-medium text-gray-500">Set Time</legend>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start" required error={errors.startTime}>
              <input
                type="time"
                name="startTime"
                value={values.startTime}
                onChange={handleChange}
                className={inputClassName}
              />
            </Field>
            <Field label="Ends" error={errors.endTime}>
              <input
                type="time"
                name="endTime"
                value={values.endTime}
                onChange={handleChange}
                className={inputClassName}
              />
            </Field>
          </div>
        </fieldset>

        <Field label="Set Date" required error={errors.date}>
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
            className={inputClassName}
          />
        </Field>

        <Field label="Description">
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={3}
            placeholder="Add Description"
            className={`${inputClassName} resize-none`}
          />
        </Field>

        <fieldset>
          <legend className="mb-1 text-xs font-medium text-gray-500">Priority</legend>
          <div className="flex gap-2">
            {PRIORITIES.map((priority) => (
              <label key={priority} className="flex-1">
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={values.priority === priority}
                  onChange={handleChange}
                  className="peer sr-only"
                />
                <span className="block cursor-pointer rounded-lg border border-gray-200 py-2 text-center text-sm capitalize text-gray-500 peer-checked:border-primary peer-checked:bg-primary-soft peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                  {priority}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {mutation.isError && (
          <p role="alert" className="text-sm text-danger">
            {getErrorMessage(mutation.error)}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-primary py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {mutation.isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Create task'}
        </button>
      </form>
    </Modal>
  );
};

export default TaskFormModal;