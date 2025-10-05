import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTE_CONFIGS } from '../config/routes.config';
import { APP_ROUTES } from '../types/routes';
import { ProtectedRoute } from './routes/RouteGuards';
import { DashboardLayout } from './layout/DashboardLayout';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to={APP_ROUTES.DASHBOARD} replace />} />
      
      {/* Protected routes with layout */}
      <Route
        path="/*"
        element={
          <DashboardLayout>
            <Routes>
              {ROUTE_CONFIGS.map((route) => (
                <Route
                  key={route.path}
                  path={route.path.replace('/', '')} // Remove leading slash for nested routes
                  element={
                    <ProtectedRoute requiredRoles={route.roles}>
                      <route.element />
                    </ProtectedRoute>
                  }
                />
              ))}
            </Routes>
          </DashboardLayout>
        }
      />
    </Routes>
  );
};