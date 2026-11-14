import { isSameISTDay } from './date';

export const EMPTY_TASKS = [];

export const getTaskStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.isCompleted).length;

  return {
    completed,
    pending: total - completed,
    progress: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
};


export const filterTasksByDay = (tasks, date) =>
  tasks.filter((task) => isSameISTDay(task.date, date));