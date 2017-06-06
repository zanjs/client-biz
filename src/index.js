import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppComponent from './App';
import AppStore from './reducers/index';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './App.css';

const store = createStore(AppStore);

const App = () => (
  <MuiThemeProvider>
    <AppComponent store={store}/>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
