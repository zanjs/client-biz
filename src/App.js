import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import { routes, RouteWithSubRoutes } from "./router";


const App = () => (
  <Router>
    <div>
      {routes.map((route, i) => (<RouteWithSubRoutes key={i} {...route}/>))}
    </div>
  </Router>
);
export default App
