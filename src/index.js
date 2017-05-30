import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppComponent from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './App.css';

const App = () => (
  <MuiThemeProvider>
    <AppComponent/>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
