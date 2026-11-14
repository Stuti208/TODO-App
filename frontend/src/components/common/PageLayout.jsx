const PageLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-100">
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 bg-white px-5 pb-28 pt-6">
      {children}
    </main>
  </div>
);

export default PageLayout;