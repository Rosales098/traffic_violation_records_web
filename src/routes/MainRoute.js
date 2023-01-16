import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserRoute from './UserRoute';
import AuthRoute from './AuthRoute';
import { getLocalStorageItem } from '../utils/getLocalStorage';

const MainRoute = () => {
  const userToken = getLocalStorageItem('userToken');

  return (
    <>
      {<UserRoute />}
      {/* <LoaderComponent /> */}
    </>
  );
};

export default MainRoute;
