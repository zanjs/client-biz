import React from 'react';
import {observable, action, runInAction} from 'mobx';
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
        } else {
          Toast.show(resp.msg || '抱歉，获取单据失败，请检查网络连接稍后重试');
          DrawerStore.onClose();
        }
      });
    } catch (e) {
      console.log(e, 'load bill detail');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
  };
}

@observer
export class Detail extends React.PureComponent {
  store = new DetailStore();
  componentWillMount() {
    this.store.load(this.props.message);
  }
  render() {
    const {detail} = this.store;
    if (!detail) return (<div style={{textAlign: 'center'}}><CircularProgress style={{marginTop: '40%'}}/></div>);
    return (
      <div>
        <DetailHeader onClose={this.props.close} detail={detail} isMail={this.store.isMail}/>
        {!this.store.isMail && detail.bill_no && <Comments billNo={detail.bill_no}/>}
      </div>
    );
  }
}

