import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import PageLayout from '../components/common/PageLayout';
import TaskList from '../components/tasks/TaskList';
import { useDebounce } from '../hooks/useDebounce';
import { useSearchTasks } from '../hooks/useSearchTasks';

const SEARCH_ACTIONS = ['view', 'edit', 'delete'];

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  const trimmedQuery = query.trim();
  const searchTerm = debouncedQuery.trim();
  const isDebouncing = trimmedQuery !== searchTerm; 

  const { tasks, isLoading, isError } = useSearchTasks(searchTerm);

  
  const handleBack = () => {
    if (location.key === 'default') navigate('/home');
    else navigate(-1);
  };

  return (
    <PageLayout>
      <button type="button" onClick={handleBack} aria-label="Go back" className="self-start">
        <ArrowLeft size={22} aria-hidden="true" />
      </button>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4">
        <input
          type="text"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a task"
          aria-label="Search tasks"
          className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        <Search size={18} className="shrink-0 text-gray-900" aria-hidden="true" />
      </div>

      {trimmedQuery ? (
        <TaskList
          tasks={tasks}
          isLoading={isLoading || (isDebouncing && tasks.length === 0)}
          isError={isError}
          emptyMessage={`No tasks found for "${searchTerm}"`}
          actions={SEARCH_ACTIONS}
          showDate
        />
      ) : (
        <p className="py-8 text-center text-sm text-gray-400">Type to search your tasks.</p>
      )}
    </PageLayout>
  );
};

export default SearchPage;