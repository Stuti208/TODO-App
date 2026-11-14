import { formatIST, parseISTDate, toISTDateKey } from './date';

export const getInitialFormValues = (task, defaultDate) => {
  if (task) {
    return {
      title: task.title,
      description: task.description ?? '',
      date: toISTDateKey(task.date),
      startTime: formatIST(task.startAt, 'HH:mm'),
      endTime: task.endAt ? formatIST(task.endAt, 'HH:mm') : '',
      priority: task.priority,
    };
  }

  return {
    title: '',
    description: '',
    date: toISTDateKey(defaultDate),
    startTime: '',
    endTime: '',
    priority: 'low',
  };
};

export const validateTaskForm = ({ title, date, startTime, endTime }) => {
  const errors = {};

  if (!title.trim()) errors.title = 'Title is required';

  if (!date) errors.date = 'Date is required';
  else if (!parseISTDate(date)) errors.date = 'Enter a valid date';

  if (!startTime) errors.startTime = 'Start time is required';

  if (startTime && endTime && endTime <= startTime) {
    errors.endTime = 'End time must be after start time';
  }

  return errors;
};


const toIsoString = (dateKey, time) => parseISTDate(dateKey, time).toISOString();

export const buildTaskPayload = ({ title, description, date, startTime, endTime, priority }) => ({
  title: title.trim(),
  description: description.trim(),
  date: toIsoString(date), 
  startAt: toIsoString(date, startTime),
  endAt: endTime ? toIsoString(date, endTime) : null,
  priority,
});