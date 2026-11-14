import { Link } from 'react-router';

const ZigzagLines = ({ className }) => (
  <svg
    viewBox="0 0 72 48"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {[8, 20, 32, 44].map((y) => (
      <polyline
        key={y}
        points={`0,${y} 9,${y - 6} 18,${y} 27,${y - 6} 36,${y} 45,${y - 6} 54,${y} 63,${y - 6} 72,${y}`}
      />
    ))}
  </svg>
);

const Onboarding = () => (
  <div className="min-h-screen bg-gray-100">
    <main className="mx-auto flex min-h-screen max-w-md flex-col bg-white">
      <div className="relative flex-[80] overflow-hidden bg-primary" aria-hidden="true">
        <div className="absolute -right-6 -top-6 size-24 rounded-full border-[12px] border-white/20" />
        <ZigzagLines className="absolute left-8 top-16 w-24 text-white/25" />
        <ZigzagLines className="absolute bottom-12 right-6 w-24 text-white/25" />
      </div>

      <section className="flex flex-[20] flex-col justify-between px-5 pb-8 pt-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Manage What To Do</h1>
          <p className="mt-4 max-w-[18rem] text-xs leading-relaxed text-gray-500">
            The best way to manage what you have to do, don&apos;t forget your plans
          </p>
        </div>

        <Link
          to="/home"
          className="block rounded-md bg-primary py-3 text-center text-sm font-medium text-white"
        >
          Get Started
        </Link>
      </section>
    </main>
  </div>
);

export default Onboarding;