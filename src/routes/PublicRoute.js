import {Outlet, Navigate} from 'react-router-dom';
import React from 'react'
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import {getLocalStorageItem} from '../utils/getLocalStorage';

const PublicRoute = () => {
    const auth = getLocalStorageItem("userToken"); 
    return auth ? <Navigate to="/" /> : 
                <Outlet />
}

export default PublicRoute