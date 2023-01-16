import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
//
import ViolationCategories from '../pages/violation-categories/ViolationCategories';
import ViolationsPage from '../pages/violations/Violations';
import CitationRecords from '../pages/CitationRecords';
import CommunityService from '../pages/CommunityService';
import Payments from '../pages/Payments';
import User from '../pages/user/User';
import CreateUser from '../pages/user/CreateUser';
import { getLocalStorageItem } from '../utils/getLocalStorage';
import DashboardLayout from '../layouts/dashboard';
import DashboardApp from '../pages/DashboardApp';
import Page404 from '../pages/Page404';
import Login from '../pages/Login';
import ViewUser from '../pages/user/ViewUser';
// ----------------------------------------------------------------------

export default function UserRoute() {
  const location = useLocation();
  const userData = getLocalStorageItem('userData');
  // console.log(userData);
  
  if (userData?.role === 'admin' && userData?.role !== undefined) {
    return (
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<DashboardApp />} />
          <Route path="violation-categories" element={<ViolationCategories />} />
          <Route path="violations-list" element={<ViolationsPage />} />
          <Route path="citation-records" element={<CitationRecords />} />
          <Route path="community-services" element={<CommunityService />} />
          <Route path="users" element={<User />} />
          <Route path="user/create" element={<CreateUser />} />
          <Route path="user/view" element={<ViewUser />} />
          <Route path="*" element={<Navigate to="/" state={{ from: location }} replace />} />
        </Route>
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    );
  }

  if (userData?.role !== 'admin' && userData?.role !== undefined) {
    return (
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<DashboardApp />} />
          <Route path="payments" element={<Payments />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="signin" element={<Login />} />
      <Route path="*" element={<Navigate to="/signin" state={{ from: location }} replace />} />
    </Routes>
  );
}
