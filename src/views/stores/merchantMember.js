import {observable, action, runInAction} from 'mobx';
import MerchantSvc from '../../services/merchant';

class MerchantMemberStore {
  @observable memberList = [];
  @observable loading = false;
  @action load = async () => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await MerchantSvc.getUserListByMerchant();
      runInAction('after load', () => {
        if (resp.code === '0' && resp.data) this.memberList = [...resp.data];
      });
      console.log(resp);
    } catch (e) {
      console.log(e, 'load merchant member list');
    }
    this.loading = false;
  }
}

export default new MerchantMemberStore();