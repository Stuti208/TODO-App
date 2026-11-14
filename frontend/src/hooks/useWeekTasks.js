import { useQuery } from '@tanstack/react-query';
import { fetchWeekTasks } from '../api/taskApi';
import { EMPTY_TASKS } from '../utils/tasks';

export const useWeekTasks = (weekRange) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', 'week', weekRange.from],
    queryFn: () => fetchWeekTasks(weekRange),
  });

  return { tasks: data ?? EMPTY_TASKS, isLoading, isError };
};