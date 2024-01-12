import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Route element={element} />
  ) : (
    <Navigate to="/login" replace state={{ from: '/' }} />
  );
};

export default PrivateRoute;
