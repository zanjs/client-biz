import React from 'react';
import Snackbar from 'material-ui/Snackbar';

export default class Toast extends  React.PureComponent {
  state = {
    message: '',
    duration: 2000,
  };
  show = (message, duration=2000) => {
    this.setState({ message, duration });
  };
  handleRequestClose = () => {
    this.setState({ message: '' });
  };
  render() {
    return (
      <Snackbar
        open={this.state.message !== ''}
        message={this.state.message}
        autoHideDuration={this.state.duration}
        onRequestClose={this.handleRequestClose}
      />
    );
  }
}