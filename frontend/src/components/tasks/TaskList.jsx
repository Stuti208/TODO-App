import TaskItem from './TaskItem';

const StatusMessage = ({ children }) => (
  <p className="py-8 text-center text-sm text-gray-400">{children}</p>
);

const TaskList = ({ tasks, isLoading, isError, emptyMessage, actions, showDate }) => {
  if (isLoading) return <StatusMessage>Loading tasks...</StatusMessage>;
  if (isError) return <StatusMessage>Unable to load tasks. Please try again.</StatusMessage>;
  if (tasks.length === 0) return <StatusMessage>{emptyMessage}</StatusMessage>;

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} actions={actions} showDate={showDate} />
      ))}
    </ul>
  );
};

export default TaskList;