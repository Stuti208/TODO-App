import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router';
import PageHeader from '../components/common/PageHeader';
import PageLayout from '../components/common/PageLayout';
import TaskList from '../components/tasks/TaskList';
import { useWeekTasks } from '../hooks/useWeekTasks';
import { formatIST, getWeekRange, parseISTDate } from '../utils/date';

const STATUS_PAGES = {
  completed: {
    title: 'Completed Tasks',
    matches: (task) => task.isCompleted,
    actions: ['view', 'delete'],
    emptyMessage: 'No completed tasks this week.',
  },
  pending: {
    title: 'Pending Tasks',
    matches: (task) => !task.isCompleted,
    actions: ['edit', 'delete'],
    emptyMessage: 'No pending tasks this week.',
  },
};

const WeekTasks = ({ date, dateKey, config }) => {
  const weekRange = getWeekRange(date);
  const { tasks, isLoading, isError } = useWeekTasks(weekRange);
  const visibleTasks = useMemo(() => tasks.filter(config.matches), [tasks, config]);

  const weekLabel = `${formatIST(weekRange.from, 'd MMM')} - ${formatIST(weekRange.to, 'd MMM')}`;

  return (
    <PageLayout>
      <PageHeader title={config.title} subtitle={weekLabel} backTo={`/home?date=${dateKey}`} />
      <TaskList
        tasks={visibleTasks}
        isLoading={isLoading}
        isError={isError}
        emptyMessage={config.emptyMessage}
        actions={config.actions}
        showDate
      />
    </PageLayout>
  );
};

const WeekTasksPage = () => {
  const { dateKey, status } = useParams();
  const date = useMemo(() => parseISTDate(dateKey), [dateKey]);

  // hasOwn avoids matching inherited keys like "constructor" from a hand-typed URL.
  if (!date || !Object.hasOwn(STATUS_PAGES, status)) return <Navigate to="/home" replace />;

  return <WeekTasks date={date} dateKey={dateKey} config={STATUS_PAGES[status]} />;
};

export default WeekTasksPage;