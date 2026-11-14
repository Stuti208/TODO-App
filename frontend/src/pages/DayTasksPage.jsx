import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router';
import PageHeader from '../components/common/PageHeader';
import PageLayout from '../components/common/PageLayout';
import AddTaskButton from '../components/tasks/AddTaskButton';
import TaskList from '../components/tasks/TaskList';
import { useWeekTasks } from '../hooks/useWeekTasks';
import { formatIST, getWeekRange, parseISTDate } from '../utils/date';
import { filterTasksByDay } from '../utils/tasks';

const DayTasks = ({ date, dateKey }) => {
  const { tasks, isLoading, isError } = useWeekTasks(getWeekRange(date));
  const dayTasks = useMemo(() => filterTasksByDay(tasks, date), [tasks, date]);

  return (
    <PageLayout>
      <PageHeader
        title={formatIST(date, 'EEEE, d MMMM')}
        subtitle="All tasks for the day"
        backTo={`/home?date=${dateKey}`}
      />
      <TaskList
        tasks={dayTasks}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No tasks for this day."
      />
      <AddTaskButton defaultDate={date} />
    </PageLayout>
  );
};

const DayTasksPage = () => {
  const { dateKey } = useParams();
  const date = useMemo(() => parseISTDate(dateKey), [dateKey]);

  return date ? <DayTasks date={date} dateKey={dateKey} /> : <Navigate to="/home" replace />;
};

export default DayTasksPage;