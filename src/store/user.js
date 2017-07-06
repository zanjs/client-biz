import { observable, computed, action } from 'mobx';
import Storage from '../utils/storage';
import {accountService} from '../services/account';

export default class UserStore {
  @observable user = { current: Storage.getValue('user') };
  constructor() {
    const user = Storage.getValue('user');
    if (user) {
      accountService.getProfile(Storage.getValue('token')).then(resp => {
        if (resp.code === '0') {
          this.user.current = resp.data;
          Storage.updateUser(resp.data);
        } else {
          this.logout();
          window.location.replace('/');
        }
      });
    }
  }
  @computed get isLoggedIn() {
    return !!Storage.getValue('token');
  }
  @action update(user) {
    Storage.updateUser(user);
    this.user.current = user;
  }
  @action logout() {
    this.user.current = null;
    Storage.resetToken();
  }
  @action login(token, user, account) {
    this.user.current = user;
    Storage.setUser(token, user, account);
  }
}