import { SquareCheckBig, SquareX } from 'lucide-react';
import { Link } from 'react-router';

const formatCount = (count) => String(count).padStart(2, '0');

const SummaryCard = ({ to, icon: Icon, label, value, cardClassName, iconClassName }) => (
  <Link to={to} className={`block rounded-xl border p-3 ${cardClassName}`}>
    <div className="flex items-center gap-2">
      <Icon size={22} className={iconClassName} aria-hidden="true" />
      <span className="text-[11px] font-medium text-gray-700">{label}</span>
    </div>
    <p className="mt-2 flex items-baseline gap-1">
      <span className="text-2xl font-semibold text-gray-900">{value}</span>
      <span className="text-[10px] text-gray-500">This Week</span>
    </p>
  </Link>
);

const WeekSummary = ({ completed, pending, isLoading, completedTo, pendingTo }) => (
  <section aria-label="Weekly summary" className="grid grid-cols-2 gap-3">
    <SummaryCard
      to={completedTo}
      icon={SquareCheckBig}
      label="Task Complete"
      value={isLoading ? '--' : formatCount(completed)}
      cardClassName="border-primary bg-primary-soft"
      iconClassName="text-primary"
    />
    <SummaryCard
      to={pendingTo}
      icon={SquareX}
      label="Task Pending"
      value={isLoading ? '--' : formatCount(pending)}
      cardClassName="border-danger bg-danger-soft"
      iconClassName="text-danger"
    />
  </section>
);

export default WeekSummary;