import React from 'react';
import {observable, computed, action, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import CircularProgress from 'material-ui/CircularProgress';
import {Comments} from "./Comments"
import {DetailHeader} from "./DetailHeader";
import {DrawerStore} from "./Drawer";
import BillSvc from '../services/bill';
import {ToastStore as Toast} from "./Toast";

class DetailStore {
  @observable detail = null;
  @observable isMail = false;
  @observable currency = '';
  @observable pay_type = '';
  @observable tax_flag = 0;
  @observable valid_begin_time = '';
  @observable valid_end_time = '';
  @observable priority = [];
  @observable item_list = [];
  @observable modifiedList = [];
  @observable notice_list = [];
  @observable isNoticeChanged = false;
  @observable comfirmedItems = [];
  @observable currentComfirmedItems = [];
  @observable openEditItemDialog = false;
  @observable editingMaterial = null;
  @observable confirm_status = 0;

  @computed get confirmedItemDS() {
    const items = [];
    this.comfirmedItems.forEach(index => items.push(this.item_list[index]));
    return items;
  }

  @computed get comfirmedItemChanged() {
    if (this.comfirmedItems.length !== this.currentComfirmedItems.length) return true;
    let result = false;
    this.currentComfirmedItems.forEach(item => {
      if (this.comfirmedItems.findIndex(i => i === item) === -1) result = true;
    });
    return result;
  }

  @computed get shouldSaveBill() {
    return this.isNoticeChanged || !!this.modifiedList.length || this.comfirmedItemChanged;
  }

  @computed get lockModifyBill() {
    return !!this.confirm_status || (this.detail && !!this.detail.head.relative_confirm_status);
  }

  @action setConfirmedItem = value => {
    if (value === 'all') {
      this.item_list.forEach((item, index) => {
        if (this.detail.isProcurement && item.relative_confirm_status === 0) {
          Toast.show(`第${index + 1}行物料需要供应商先确认后，方可确认`);
          this.currentComfirmedItems = [...this.comfirmedItems];
        } else this.currentComfirmedItems.push(index);
      });
    } else if (value === 'none') {
      this.currentComfirmedItems = [];
    } else {
      this.currentComfirmedItems = [];
      value.forEach(item => {
        if (this.item_list[item].relative_confirm_status === 0 && this.detail.isProcurement) {
          Toast.show(`第${item + 1}行物料需要供应商先确认后，方可确认`);
        } else this.currentComfirmedItems.push(item);
      });
    }
  };

  @action openItemDialog = item => {
    if (item) this.editingMaterial = item;
    this.openEditItemDialog = true;
  };

  @action closeItemDialog = () => {
    this.editingMaterial = null;
    this.openEditItemDialog = false;
  };

  @action addMaterialItem = item => {
    this.item_list = [...this.item_list, item];
    if (this.modifiedList.findIndex(item => item === 'item_list') === -1) this.modifiedList.push('item_list');
  };
  @action deleteMaterialItem = item => {
    this.item_list = this.item_list.filter(raw => raw.item_id !== item.item_id);
    if (this.modifiedList.findIndex(item => item === 'item_list') === -1) this.modifiedList.push('item_list');
  };
  @action updateMaterialItem = item => {
    const index = this.item_list.findIndex(r => r.item_id === item.item_id);
    if (index > -1) {
      this.item_list[index] = item;
    }
    if (this.modifiedList.findIndex(item => item === 'item_list') === -1) this.modifiedList.push('item_list');
  };

  @action setKey = (key, val) => {
    this[key] = val;
    const {head} = this.detail;
    if (this[key] !== head[key]) {
      if (this.modifiedList.findIndex(item => item === key) === -1) this.modifiedList = [...this.modifiedList, key];
    } else {
      this.modifiedList = this.modifiedList.filter(item => item !== key);
    }
  };

  @action updateFollow = (user, isFollowed) => {
    user.id = user.user_id;
    user.name = user.user_name;
    if (isFollowed) {
      this.notice_list = [...this.notice_list, user];
    } else {
      this.notice_list = this.notice_list.filter(item => item.id !== user.id);
    }
    const historyNoticeList = this.detail.head.notice_list;
    let isIncreased = false;
    let isDecreased = false;
    this.notice_list.forEach(n => {
      if (historyNoticeList.findIndex(hn => hn.id === n.id) === -1) isIncreased = true;
    });
    historyNoticeList.forEach((hn => {
      if (this.notice_list.findIndex(n => n.id === hn.id) === -1) isDecreased = true;
    }));
    this.isNoticeChanged = isIncreased || isDecreased;
  };

  @action updateNoticeList = async () => {
    if (!this.isNoticeChanged || this.noticeListUpdating) return;
    this.noticeListUpdating = true;
    try{
      const {head} = this.detail;
      const notice_list = [];
      this.notice_list.forEach(user => notice_list.push(user.id));
      const resp = await BillSvc.setNoticeList(head.bill_no, notice_list.join(','));
      runInAction('after update notice list', () => {
        if (resp.code === '0') {
          Toast.show('关注列表已更新');
          this.isNoticeChanged = false;
        } else Toast.show(resp.msg || '抱歉，更新关注列表失败，请刷新页面稍后重试');
      });
    } catch (e) {
      console.log(e, 'update notice list');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.noticeListUpdating = false;
  };

  @action load = async (item) => {
    if (item && item.hasOwnProperty('mail_title')) {
      this.detail = item;
      this.isMail = true;
      return;
    }
    DrawerStore.setWidth(620);
    if (!item || !item.bill_no) {
      DrawerStore.onClose();
      return;
    }
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await BillSvc.getBill(item.bill_no);
      runInAction('after load bill detail', () => {
        if (resp.code === '0') {
          this.detail = resp.data;
          const {head, bodies} = resp.data;
          this.currency = head.currency;
          this.pay_type = head.pay_type;
          this.tax_flag = head.tax_flag;
          this.valid_begin_time = head.valid_begin_time;
          this.valid_end_time = head.valid_end_time;
          this.priority = head.priority;
          this.notice_list = head.notice_list;
          this.confirm_status = head.confirm_status;
          this.item_list = [...bodies];
          this.item_list.forEach((item, index) => {
            if (!!item.confirm_status) this.comfirmedItems.push(index);
          });
          this.currentComfirmedItems = [...this.comfirmedItems];
          this.detail.isProcurement = item.isProcurement;
        } else {
          Toast.show(resp.msg || '抱歉，获取单据失败，请检查网络连接稍后重试');
          DrawerStore.onClose();
        }
      });
      this.loading = false;
    } catch (e) {
      console.log(e, 'load bill detail');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
  };

  @action update = () => {
    if (!this.shouldSaveBill) {
      Toast.show('单据没有被修改，无需保存');
      return;
    }
    if (!!this.modifiedList.length) this.updateBill();
    if (this.isNoticeChanged) this.updateNoticeList();
    if (this.comfirmedItemChanged) this.updateBillItemsConfirmed();
  };

  @action updateBillItemsConfirmed = async () => {
    const currentItems = [...this.currentComfirmedItems];
    const historyItems = [...this.comfirmedItems];
    const toBeConfirmedItems = [];
    const toBeCanceledItems = [];
    currentItems.forEach(c => {
      if (historyItems.findIndex(hc => hc === c) === -1) toBeConfirmedItems.push(this.item_list[c]);
    });
    historyItems.forEach(hc => {
      if (currentItems.findIndex(c => c === hc) === -1) toBeCanceledItems.push(this.item_list[hc]);
    });
    let confirmResp = null;
    let unConfrimResp = null;
    if (!!toBeConfirmedItems.length) confirmResp = await this.confirmBillItem(toBeConfirmedItems);
    else confirmResp = {finished: true};
    if (!!toBeCanceledItems.length) unConfrimResp = await this.unConfirmBillItem(toBeCanceledItems);
    else unConfrimResp = {finished: true};

    if (confirmResp.finished && unConfrimResp.finished) {
      this.comfirmedItems = [...this.currentComfirmedItems];
      Toast.show('更新物料状态成功');
    } else Toast.show('抱歉，更新物料确认情况失败，请刷新页面后重新尝试');
  };

  @action confirmBillItem = async (items) => {
    if (this.comfirming || !items) return;
    this.comfirming = true;
    try {
      const resp = await BillSvc.confirmItem(this.detail.head.bill_no, items);
      runInAction('after confirm item', () => {
        if (resp.code === '0') {
          // Toast.show('确认物料成功');
        } else Toast.show(resp.msg || '抱歉，确认物料失败，请刷新页面后重新尝试');
      })
    } catch (e) {
      console.log(e, 'confirm bill item');
    }
    this.comfirming = false;
    return {finished: true};
  };

  @action unConfirmBillItem = async (items) => {
    if (this.unComfirming || !items) return;
    this.unComfirming = true;
    try {
      const resp = await BillSvc.cancelConfirmItem(this.detail.head.bill_no, items);
      runInAction('after unConfirm item', () => {
        if (resp.code === '0') {
          // Toast.show('确认物料成功');
        } else Toast.show(resp.msg || '抱歉，取消确认物料失败，请刷新页面后重新尝试');
      })
    } catch (e) {
      console.log(e, 'confirm bill item');
    }
    this.unComfirming = false;
    return {finished: true};
  };

  @action updateBill = async () => {
    if (this.updating) return;
    this.updating = true;
    try {
      const {head} = this.detail;
      const resp = await BillSvc.update(head.bill_no, this.pay_type, this.valid_begin_time,
        this.valid_end_time, this.priority, this.item_list);
      runInAction('after update bill', () => {
        if (resp.code === '0') {
          Toast.show('保存成功');
          this.modifiedList = [];
        } else Toast.show(resp.msg || '抱歉, 保存单据失败，请刷新页面后重新尝试');
      });
    } catch (e) {
      console.log(e, 'update bill');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.updating = false;
  };

  @action confirmBill = async () => {
    if (this.confirmingBill || !!this.confirm_status) return;
    this.confirmingBill = true;
    try {
      const resp = await BillSvc.confirmBill(this.detail.head.bill_no);
      runInAction('after confirm bill', () => {
        if (resp.code === '0') {
          this.confirm_status = 1;
          Toast.show('确认单据成功');
        } else Toast.show(resp.msg || '抱歉，确认单据失败，请刷新页面后重新尝试')
      })
    } catch (e) {
      console.log(e, 'comirm bill');
    }
    this.confirmingBill = false;
  };

  @action cancelConfirmBill = async () => {
    if (this.cancelConfirmingBill || !this.confirm_status) return;
    this.cancelConfirmingBill = true;
    try {
      const resp = await BillSvc.cancelConfirmBill(this.detail.head.bill_no);
      runInAction('after confirm bill', () => {
        if (resp.code === '0') {
          this.confirm_status = 0;
          Toast.show('取消确认单据成功');
        } else Toast.show(resp.msg || '抱歉，取消确认单据失败，请刷新页面后重新尝试')
      })
    } catch (e) {
      console.log(e, 'cancel comirm bill');
    }
    this.cancelConfirmingBill = false;
  };

  @action clear = () => {
    this.detail = null;
    this.isMail = false;
    this.currency = '';
    this.pay_type = '';
    this.tax_flag = 0;
    this.valid_begin_time = '';
    this.valid_end_time = '';
    this.priority = [];
    this.item_list = [];
    this.modifiedList = [];
    this.notice_list = [];
    this.isNoticeChanged = false;
    this.comfirmedItems = [];
    this.currentComfirmedItems = [];
    this.openEditItemDialog = false;
    this.editingMaterial = null;
    this.confirm_status = 0;
  }
}

export const detailStore = new DetailStore();

@observer
export class Detail extends React.PureComponent {
  store = detailStore;
  componentWillMount() {
    this.store.load(this.props.message);
  }
  componentWillUnmount() {
    this.store.clear();
  }
  render() {
    const {detail} = this.store;
    if (!detail) return (<div style={{textAlign: 'center'}}><CircularProgress style={{marginTop: '40%'}}/></div>);
    return (
      <div>
        <DetailHeader onClose={this.props.close} detail={detail} isMail={this.store.isMail}/>
        {!this.store.isMail && detail.head.bill_no && <Comments billNo={detail.head.bill_no}/>}
      </div>
    );
  }
}

