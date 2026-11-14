import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

const PageHeader = ({ title, subtitle, backTo }) => (
  <header className="flex items-center gap-3">
    <Link to={backTo} aria-label="Go back" className="text-gray-900">
      <ArrowLeft size={22} aria-hidden="true" />
    </Link>
    <div>
      <h1 className="text-lg font-semibold leading-tight text-gray-900">{title}</h1>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  </header>
);

export default PageHeader;