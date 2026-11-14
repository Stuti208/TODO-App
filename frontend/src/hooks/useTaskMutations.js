import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, updateTask, updateTaskStatus } from '../api/taskApi';

const TASKS_KEY = ['tasks'];

const useInvalidateTasks = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: TASKS_KEY });
};

export const useCreateTask = () => {
  const invalidateTasks = useInvalidateTasks();
  return useMutation({ mutationFn: createTask, onSuccess: invalidateTasks });
};

export const useUpdateTask = () => {
  const invalidateTasks = useInvalidateTasks();
  return useMutation({ mutationFn: updateTask, onSuccess: invalidateTasks });
};

export const useDeleteTask = () => {
  const invalidateTasks = useInvalidateTasks();
  return useMutation({ mutationFn: deleteTask, onSuccess: invalidateTasks });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTaskStatus,
    onMutate: async ({ id, isCompleted }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      const snapshot = queryClient.getQueriesData({ queryKey: TASKS_KEY });

      queryClient.setQueriesData({ queryKey: TASKS_KEY }, (tasks) =>
        tasks?.map((task) => (task._id === id ? { ...task, isCompleted } : task))
      );

      return { snapshot };
    },
    onError: (_error, _variables, context) => {
      context?.snapshot.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  });
};