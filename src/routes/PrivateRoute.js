import {Outlet, Navigate} from 'react-router-dom';
import React from 'react'
import DashboardLayout from '../layouts/dashboard';
import { getLocalStorageItem } from '../utils/getLocalStorage';

const PrivateRoute = () => {
    const authToken = getLocalStorageItem("userToken"); 
    return authToken ? <DashboardLayout>
                            <Outlet />
                        </DashboardLayout> : <Navigate to="/" />;
}

export default PrivateRoute