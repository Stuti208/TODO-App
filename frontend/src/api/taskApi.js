import apiClient from "./axiosClient";

export const createTask = async (payload) => {
  const response = await apiClient.post('/create-task', payload);
  return response.data.data;
};

export const updateTask = async ({ id, payload }) => {
  const response = await apiClient.patch(`/update-task/${id}`, payload);
  return response.data.data;
};

export const updateTaskStatus = async ({ id, isCompleted }) => {
  const response = await apiClient.patch(`/update-task-status/${id}`, { isCompleted });
  return response.data.data;
};

export const deleteTask = async (id) => {
  await apiClient.delete(`/delete-task/${id}`);
};

export const fetchWeekTasks = async ({ from, to }) => {
  const response = await apiClient.get('/get-tasks', { params: { from, to } });
  return response.data.data;
};

export const searchTasks = async (query) => {
  const response = await apiClient.get('/search-tasks', { params: { searchKey: query } });
  return response.data.data;
};