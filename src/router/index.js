import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Login from '../views/Login';
import Dashboard from '../views/Dashboard';
import {
  MainDashboard,
  Analysis,
  Partner,
  Product,
  Search,
} from '../views/dashboard/index';

const routes = [
  {
    path: '/',
    component: Login,
    exact: true,
  },
  {
    path: '/dashboard',
    component: Dashboard,
    routes: [
      {
        path: '/dashboard/main',
        component: MainDashboard,
        exact: true,
      },
      {
        path: '/dashboard/search',
        component: Search,
      },
      {
        path: '/dashboard/partner',
        component: Partner,
      },
      {
        path: '/dashboard/product',
        component: Product,
      },
      {
        path: '/dashboard/analysis',
        component: Analysis,
      }
    ],
  },
  {
    path: '/home',
  }
];

const RouteWithSubRoutes = (route) => (
  <Route path={route.path} exact={route.exact} render={props => (
    // pass the sub-routes down to keep nesting
    <route.component {...props} routes={route.routes}/>
  )}/>
);

export {
  routes,
  RouteWithSubRoutes,
}