import React from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin'; // fix react onTouchTap events(button & drawer component...)
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppComponent from './App';
import './App.less';

injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <AppComponent />
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
