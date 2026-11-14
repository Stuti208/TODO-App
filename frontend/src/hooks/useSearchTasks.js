import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { searchTasks } from '../api/taskApi';
import { EMPTY_TASKS } from '../utils/tasks';

export const useSearchTasks = (searchTerm) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', 'search', searchTerm],
    queryFn: () => searchTasks(searchTerm),
    enabled: searchTerm.length > 0, 
    placeholderData: keepPreviousData, 
  });

  return { tasks: data ?? EMPTY_TASKS, isLoading, isError };
};