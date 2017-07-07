import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import Snackbar from 'material-ui/Snackbar';

class Store {
  @observable message = '';
  @observable duration = 2000;
  @computed get open() {
    return !!this.message;
  }

  @action show = (message, duration = 2000) => {
    this.message = message;
    this.duration = duration;
  };
  @action close = () => this.message = '';
}

export const ToastStore = new Store();

const Toast = observer(() => (
  <Snackbar
    open={ToastStore.open}
    message={ToastStore.message}
    autoHideDuration={ToastStore.duration}
    onRequestClose={ToastStore.close}
  />
));

export default Toast;