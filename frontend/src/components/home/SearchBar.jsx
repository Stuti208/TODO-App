import { Search } from 'lucide-react';
import { Link } from 'react-router';

const SearchBar = ({ to }) => (
  <Link
    to={to}
    className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-400"
  >
    <span>Search for a task</span>
    <Search size={18} className="text-gray-900" aria-hidden="true" />
  </Link>
);

export default SearchBar;