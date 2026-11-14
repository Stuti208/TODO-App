import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import PageLayout from '../components/common/PageLayout';
import SearchBar from '../components/home/SearchBar';
import WeekStrip from '../components/home/WeekStrip';
import WeekSummary from '../components/home/WeekSummary';
import WeeklyProgress from '../components/home/WeeklyProgress';
import AddTaskButton from '../components/tasks/AddTaskButton';
import TaskList from '../components/tasks/TaskList';
import { useWeekTasks } from '../hooks/useWeekTasks';
import { formatIST, getWeekRange, isSameISTDay, parseISTDate, toISTDateKey } from '../utils/date';
import { filterTasksByDay, getTaskStats } from '../utils/tasks';

const PREVIEW_LIMIT = 3;

const getListTitle = (selectedDate) =>
  isSameISTDay(selectedDate, new Date())
    ? 'Tasks Today'
    : `Tasks on ${formatIST(selectedDate, 'd MMM')}`;

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get('date');

  
  const selectedDate = useMemo(
    () => (dateParam && parseISTDate(dateParam)) || new Date(),
    [dateParam]
  );
  const selectedKey = toISTDateKey(selectedDate);

  const { tasks, isLoading, isError } = useWeekTasks(getWeekRange(selectedDate));

  const stats = useMemo(() => getTaskStats(tasks), [tasks]);
  const dayTasks = useMemo(() => filterTasksByDay(tasks, selectedDate), [tasks, selectedDate]);

  
  const handleSelectDate = (date) =>
    setSearchParams({ date: toISTDateKey(date) }, { replace: true });

  return (
    <PageLayout>
      <SearchBar to="/search"/>
      <WeekStrip selectedDate={selectedDate} onSelectDate={handleSelectDate} />
      <WeekSummary
        completed={stats.completed}
        pending={stats.pending}
        isLoading={isLoading}
        completedTo={`/week/${selectedKey}/completed`}
        pendingTo={`/week/${selectedKey}/pending`}
      />
      <WeeklyProgress progress={stats.progress} />

      <section>
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">{getListTitle(selectedDate)}</h2>
          {dayTasks.length > PREVIEW_LIMIT && (
            <Link to={`/day/${selectedKey}`} className="text-xs font-medium text-primary">
              View All
            </Link>
          )}
        </div>
        <TaskList
          tasks={dayTasks.slice(0, PREVIEW_LIMIT)}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No tasks for this day."
        />
      </section>

      <AddTaskButton defaultDate={selectedDate} />
    </PageLayout>
  );
};

export default HomePage;