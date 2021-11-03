/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';

import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
import DashboardAnalyticsView from './views/DashboardAnalytics';
import DashboardDefaultView from './views/DashboardDefault';
import OverviewView from './views/Overview';
import PresentationView from './views/Presentation';

import Register from 'views/Register';
import Login from 'views/Login';
import TripList from 'views/TravelManagement/TripList';
import TripArchived from 'views/TravelManagement/TripArchived';
import CreateTrip from 'views/TravelManagement/CreateTrip';
import EditTrip from 'views/TravelManagement/EditTrip';
import Calendar from 'views/Calendar';
import Changelog from 'views/Changelog';
import Chat from 'views/Chat';
import InvoiceDetails from 'views/InvoiceDetails';
import KanbanBoard from 'views/KanbanBoard';
import Mail from 'views/Mail';
import CustomerManagementList from 'views/CustomerManagementList';
import CustomerCreate from 'views/CustomerManagementList/CustomerCreate';
import CustomerManagementDetails from 'views/CustomerManagementDetails';
import ProjectManagementList from 'views/ProjectManagementList';
import OrderManagementList from 'views/OrderManagementList';
import OrderManagementDetails from 'views/OrderManagementDetails';
import Profile from 'views/Profile';
import ProjectCreate from 'views/ProjectCreate';
import ProjectDetails from 'views/ProjectDetails';
import ProjectList from 'views/ProjectList';
import Settings from 'views/Settings';
import SocialFeed from 'views/SocialFeed';
import GettingStarted from 'views/GettingStarted';

const routes = [
  {
    path: '/',
    exact: true,
    component: () =>
      localStorage.token ? (
        <Redirect to="/dashboards" />
      ) : (
        <Redirect to="/auth/login" />
      )
  },
  {
    path: '/auth',
    component: AuthLayout,
    routes: [
      {
        path: '/auth/login',
        exact: true,
        component: () =>
          localStorage.token ? <Redirect to="/dashboards" /> : <Login />
      },
      {
        path: '/auth/register',
        exact: true,
        component: () =>
          localStorage.token ? <Redirect to="/dashboards" /> : <Register />
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('views/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('views/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('views/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      {
        path: '/travel/triplist',
        exact: true,
        component: () => <TripList />
      },
      {
        path: '/travel/triparchive',
        exact: true,
        component: () => <TripArchived />
      },
      {
        path: '/travels/trip/create',
        exact: true,
        component: () => <CreateTrip />
      },
      {
        path: '/travels/trip/edit/:id',
        exact: true,
        component: () => <EditTrip />
      },
      {
        path: '/calendar',
        exact: true,
        component: () => <Calendar />
      },
      {
        path: '/changelog',
        exact: true,
        component: () => <Changelog />
      },
      {
        path: '/chat',
        exact: true,
        component: () => <Chat />
      },
      {
        path: '/chat/:id',
        exact: true,
        component: () => <Chat />
      },
      {
        path: '/dashboards',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <DashboardAnalyticsView />
          )
      },
      {
        path: '/dashboards/default',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <DashboardDefaultView />
          )
      },
      {
        path: '/invoices/:id',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <InvoiceDetails />
          )
      },
      {
        path: '/kanban-board',
        exact: true,
        component: () => <KanbanBoard />
      },
      {
        path: '/mail',
        exact: true,
        component: () => <Mail />
      },
      {
        path: '/management/customers',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <CustomerManagementList />
          )
      },
      {
        path: '/management/customer/create',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <CustomerCreate />
          )
      },
      {
        path: '/management/customers/:id',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <CustomerManagementDetails />
          )
      },
      {
        path: '/management/customers/:id/:tab',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <CustomerManagementDetails />
          )
      },
      {
        path: '/management/projects',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <ProjectManagementList />
          )
      },
      {
        path: '/management/orders',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <OrderManagementList />
          )
      },
      {
        path: '/management/orders/:id',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <OrderManagementDetails />
          )
      },
      {
        path: '/overview',
        exact: true,
        component: () => <OverviewView />
      },
      {
        path: '/presentation',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <PresentationView />
          )
      },
      {
        path: '/profile/:id',
        exact: true,
        component: () => <Profile />
      },
      {
        path: '/profile/:id/:tab',
        exact: true,
        component: () => <Profile />
      },
      {
        path: '/projects/create',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <ProjectCreate />
          )
      },
      {
        path: '/projects/:id',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <ProjectDetails />
          )
      },
      {
        path: '/projects/:id/:tab',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <ProjectDetails />
          )
      },
      {
        path: '/projects',
        exact: true,
        component: () => <ProjectList />
      },
      {
        path: '/settings',
        exact: true,
        component: () => <Settings />
      },
      {
        path: '/settings/:tab',
        exact: true,
        component: () => <Settings />
      },
      {
        path: '/social-feed',
        exact: true,
        component: () => <SocialFeed />
      },
      {
        path: '/getting-started',
        exact: true,
        component: () =>
          !localStorage.token ? (
            <Redirect to="/auth/login" />
          ) : (
            <GettingStarted />
          )
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  }
];

export default routes;
