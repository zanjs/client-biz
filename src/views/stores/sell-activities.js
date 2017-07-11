import {computed, action, runInAction, extendObservable} from 'mobx';
import homeSvc from "../../services/home";
import Storage from '../../utils/storage';
import {ToastStore as Toast} from "../../components/Toast";

class SellActivitiesStore {
  constructor() {
    extendObservable(this, {
      messageList: [],
      recordCount: 0,
      pageNo: 1,
      hasMore: true,
      unReadListDS: computed(() => this.messageList.filter(item => !item.read_flag)),
      isReadListDS: computed(() => this.messageList.filter(item => item.read_flag === 1)),
      inChargeListDS: computed(() => this.messageList.filter(item => !item.read_flag && (item.user_id === Storage.getValue('user').id))),
      participantListDS: computed(() => this.messageList.filter(item => !item.read_flag && (item.user_id !== Storage.getValue('user').id))),
    });
  }
  pageSize = 20;

  load = action(async () => {
    if (this.loading || !this.hasMore) return;
    this.loading = true;
    const pageNo = this.pageNo > 1 ? this.pageNo : null;
    try {
      const resp = await homeSvc.getSellList(pageNo, this.pageSize);
      // console.log(resp, 'sell store');
      runInAction('after load list', () => {
        if (resp.code === '0' && resp.data.list) {
          this.messageList = this.pageNo > 1 ? [...this.messageList, ...resp.data.list] : resp.data.list;
          this.recordCount = (resp.data.pagination && resp.data.pagination.record_count) || 0;
          this.hasMore = this.messageList.length < this.recordCount;
          if (this.hasMore) this.pageNo++;
        }
      })
    } catch (e) {
      Toast.show('抱歉，发生未知错误，请稍后重试');
    }
    this.loading = false;
  })
}
const activitiesStore = new SellActivitiesStore();
export default activitiesStore;
