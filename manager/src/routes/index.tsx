import React from 'react';
import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Errors = React.lazy(() => import('@/pages/Errors'));
const Performance = React.lazy(() => import('@/pages/Performance'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const Alerts = React.lazy(() => import('@/pages/Alerts'));

const Loading = () => <div>加载中...</div>;

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: (
      <React.Suspense fallback={<Loading />}>
        <Dashboard />
      </React.Suspense>
    ),
  },
  {
    path: '/errors',
    element: (
      <React.Suspense fallback={<Loading />}>
        <Errors />
      </React.Suspense>
    ),
  },
  {
    path: '/performance',
    element: (
      <React.Suspense fallback={<Loading />}>
        <Performance />
      </React.Suspense>
    ),
  },
  {
    path: '/alerts',
    element: (
      <React.Suspense fallback={<Loading />}>
        <Alerts />
      </React.Suspense>
    ),
  },
  {
    path: '/settings',
    element: (
      <React.Suspense fallback={<Loading />}>
        <Settings />
      </React.Suspense>
    ),
  },
]; 