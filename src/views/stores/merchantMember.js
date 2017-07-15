import {observable, computed, action, runInAction} from 'mobx';
import MerchantSvc from '../../services/merchant';
import BaseSvc from '../../services/baseData';
import {ToastStore as Toast} from "../../components/Toast";

class MerchantMemberStore {
  @observable members = [];
  @observable loading = false;

  @computed get memberList() {
    // return this.members.filter(m => !!m.status);
    return this.members;
  }

  @action load = async () => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await MerchantSvc.getUserListByMerchant();
      runInAction('after load', () => {
        if (resp.code === '0' && resp.data) this.members = [...resp.data];
      });
    } catch (e) {
      console.log(e, 'load merchant member list');
      Toast.show('抱歉，发生未知错误，请刷新页面稍后重试')
    }
    this.loading = false;
  };
  @action delete = async (user) => {
    if (!user) return;
    try {
      const resp = BaseSvc.delUser(user.user_id);
      runInAction('after delete user', () => {
        if (resp.code === '0') {
          this.members = this.members.filter(m => m.user_id !== user.user_id);
          Toast.show('删除成功');
        } else Toast.show(resp.msg || '抱歉，删除失败，请刷新页面稍后重试');
      })
    } catch (e) {
      console.log(e, 'delete user from merchant');
      Toast.show('抱歉，发生未知错误，请刷新页面稍后重试');
    }
  };
  @action updateUser = user => {
    this.members.forEach(member => {
      if (member.user_id === user.user_id) member = user;
    });
    console.log(this.members);
    // this.members = [...this.members];
  }
}

export default new MerchantMemberStore();