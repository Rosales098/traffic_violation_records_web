import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import User from './pages/user/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import DashboardApp from './pages/DashboardApp';
import ViolationCategories from './pages/ViolationCategories';
import Violations from './pages/ViolationsList';
import CitationRecords from './pages/CitationRecords';
import CommunityService from './pages/CommunityService';
import Payments from './pages/Payments';
import CreateUserForm from './components/user/CreateUserForm';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { path: 'dashboard', element: <DashboardApp /> },
        { path: 'violation-categories', element: <ViolationCategories /> },
        { path: 'violations-list', element: <Violations /> },
        { path: 'violations-records', element: <CitationRecords /> },
        { path: 'community-services', element: <CommunityService /> },
        { path: 'payments', element: <Payments /> },

        { path: 'users', element: <User /> },
        { path: 'create-user', element: <CreateUserForm /> },
        { path: 'view-user', element: <User /> },
        
        { path: 'reports', element: <User /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
