import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// * pages
import Login from '../pages/Login';
import Page404 from '../pages/Page404';

const AuthRoute = () => (
  <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  </>
);

export default AuthRoute;
