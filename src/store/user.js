import { observable, computed, action, runInAction } from 'mobx';
import Storage from '../utils/storage';
import {accountService} from '../services/account';
import MerchantSvc from '../services/merchant';
import {BizDialog} from "../components/Dialog";
import {ToastStore as Toast} from "../components/Toast";

export default class UserStore {
  @observable user = { current: Storage.getValue('user') };
  constructor() {
    const user = Storage.getValue('user');
    if (user) this.getUser();
  }
  @computed get isLoggedIn() {
    return !!Storage.getValue('token');
  }
  @action getUser = async () => {
    accountService.getProfile(Storage.getValue('token')).then(resp => {
      if (resp.code === '0') {
        this.user.current = resp.data;
        Storage.updateUser(resp.data);
      } else {
        this.logout();
        window.location.replace('/');
      }
    });
  };
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
  @action quiteMerchant = async () => {
    if (this.quiting) return;
    this.quiting = true;
    try {
      const resp = await MerchantSvc.quitMerchant(this.user.current.mer_id);
      runInAction('after quite', () => {
        if (resp.code === '0') {
          this.getUser();
          Toast.show('退出成功');
          BizDialog.onClose();
        } else Toast.show(resp.msg || '抱歉，退出失败，请刷新页面后重新尝试');
      });
    } catch (e) {
      console.log(e, 'quite merchat');
      Toast.show('抱歉，发生未知错误，请刷新页面后重新尝试');
    }
    this.quiting = false;
  }
}