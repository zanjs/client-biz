import {observable, computed, action, runInAction, extendObservable} from 'mobx';
import mailSvc from "../../services/mail";
// import store from "../../reducers";

class MailListStore {
  constructor() {
    extendObservable(this, {
      mails: [],
      recordCount: 0,
      pageNo: 1,
      hasMore: false,
      unReadListDS: computed(() => this.mails.filter(item => !item.read_flag)),
      isReadListDS: computed(() => this.mails.filter(item => item.read_flag === 1)),
    });
  }
  pageSize = 20;

  load = action(async (errCallback) => {
    if (this.loading) return;
    this.loading = true;
    const pageNo = this.pageNo > 1 ? this.pageNo : null;
    try {
      const resp = await mailSvc.getMailList(0, null, pageNo, this.pageSize);
      console.log(resp, 'mail');
      runInAction('after load list', () => {
        if (resp.code == 0 && resp.data.list) {
          this.mails = this.pageNo > 1 ? [...this.mails, ...resp.data.list] : resp.data.list;
          this.recordCount = resp.data.pagination && resp.data.pagination.record_count || 0;
          this.hasMore = this.mails.length < this.recordCount;
          this.pageNo++;
        }
      })
    } catch (e) {
      errCallback && errCallback('抱歉，发生未知错误，请稍后重试');
    }
    this.loading = false;
  })
}
const mailsStore = new MailListStore();
export default mailsStore;
