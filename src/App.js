import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { routes, RouteWithSubRoutes } from "./router";
import UserStore from './store/user';


const App = () => {
  const userStore = new UserStore();
  return (
    <Provider user={userStore} >
      <Router>
        <Switch>
          {routes.map((route, i) => (<RouteWithSubRoutes key={i} {...route}/>))}
        </Switch>
      </Router>
    </Provider>
  )
};
export default App
