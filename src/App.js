import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { routes, RouteWithSubRoutes } from "./router";


const App = ({ store }) => (
  <Provider store={store}>
    <Router>
      <Switch>
        {routes.map((route, i) => (<RouteWithSubRoutes key={i} {...route}/>))}
      </Switch>
    </Router>
  </Provider>
);
export default App
