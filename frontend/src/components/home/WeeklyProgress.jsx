const WeeklyProgress = ({ progress }) => (
  <section>
    <h2 className="mb-3 text-base font-semibold text-gray-900">Weekly Progress</h2>
    <div
      role="progressbar"
      aria-label="Weekly progress"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-3 w-full overflow-hidden rounded-full bg-track"
    >
      <div
        className="h-full rounded-full bg-primary-dark transition-[width] duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </section>
);

export default WeeklyProgress;