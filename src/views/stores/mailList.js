import {computed, action, runInAction, extendObservable} from 'mobx';
import mailSvc from "../../services/mail";
// import Storage from '../../utils/storage';
import {ToastStore as Toast} from "../../components/Toast";

class MailListStore {
  constructor() {
    extendObservable(this, {
      mails: [],
      recordCount: 0,
      pageNo: 1,
      hasMore: false,
      unReadListDS: computed(() => this.mails.filter(item => !item.read_flag)),
      isReadListDS: computed(() => this.mails.filter(item => !!item.read_flag)),
    });
  }
  pageSize = 20;

  load = action(async () => {
    if (this.loading) return;
    this.loading = true;
    const pageNo = this.pageNo > 1 ? this.pageNo : null;
    try {
      const resp = await mailSvc.getMailList(0, null, pageNo, this.pageSize);
      runInAction('after load list', () => {
        if (resp.code === '0' && resp.data.list) {
          this.mails = this.pageNo > 1 ? [...this.mails, ...resp.data.list] : resp.data.list;
          this.recordCount = (resp.data.pagination && resp.data.pagination.record_count) || 0;
          this.hasMore = this.mails.length < this.recordCount;
          if (this.hasMore) this.pageNo++;
        }
      })
    } catch (e) {
      console.log(e, 'load mail list');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.loading = false;
  });

  @action setRead = async (message) => {
    console.log(message);
    if (!message.id || !!message.read_flag || this.submitting) return;
    this.submitting = true;
    try {
      const resp = await mailSvc.setRead(message.id);
      if (resp.code === '0') {
        this.mails.forEach(mail => {
          if (mail.id === message.id) mail.read_flag = true;
        })
      } else Toast.show(resp.msg || '抱歉，操作失败，请稍后重试');
    } catch (e) {
      console.log(e, 'set read flag');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.submitting = false;
  }
}
const mailsStore = new MailListStore();
export default mailsStore;
