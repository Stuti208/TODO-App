import { Navigate, RouterProvider, createBrowserRouter } from 'react-router';
import './App.css';
import { TaskFormProvider } from './context/TaskFormContext';
import DayTasksPage from './pages/DayTasksPage.jsx';
import Home from './pages/Home.jsx';
import Onboarding from './pages/Onboarding.jsx';
import WeekTasksPage from './pages/WeekTasksPage.jsx';
import SearchPage from './pages/SearchPage.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Onboarding /> },
  { path: '/home', element: <Home /> },
  { path: '/day/:dateKey', element: <DayTasksPage /> },
  { path: '/week/:dateKey/:status', element: <WeekTasksPage /> },
  { path: '/search', element: <SearchPage /> },
  { path: '*', element: <Navigate to="/home" replace /> },
]);

function App() {
  return (
    <TaskFormProvider>
      <RouterProvider router={router} />
    </TaskFormProvider>
  );
}

export default App;