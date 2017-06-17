import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin'; // fix react onTouchTap events(button & drawer component...)
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppComponent from './App';
import store from './reducers/index';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './App.css';

injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <AppComponent store={store}/>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
