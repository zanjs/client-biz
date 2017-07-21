import React from 'react';
import { observable, action, runInAction} from 'mobx';
import { observer } from 'mobx-react';
import {MessageItem} from "../../../components/ListItem";
import FlatButton from 'material-ui/FlatButton';
import FinancialSvc from '../../../services/financialBill';
import {ToastStore as Toast} from "../../../components/Toast";

class SaleBillStore {
  @observable DS = [];
  @observable recordCount = 0;
  @observable pageNo = 1;
  @observable hasMore = false;
  @observable landed = false;
  @observable loading = false;
  pageSize = 20;

  @action refresh = () => {
    this.hasMore = false;
    this.pageNo = 1;
    this.load();
  };

  @action load = async () => {
    if (this.loading) return;
    this.loading = true;
    const pageNo = this.pageNo > 1 ? this.pageNo : null;
    try {
      const resp = await FinancialSvc.getBillList(pageNo, this.pageSize);
      runInAction('after load list', () => {
        if (resp.code === '0' && resp.data) {
          this.DS = this.pageNo > 1 ? [...this.DS, ...resp.data] : resp.data;
          this.recordCount = (resp.data.pagination && resp.data.pagination.record_count) || 0;
          this.hasMore = this.DS.length < this.recordCount;
          if (this.hasMore) this.pageNo++;
        } else Toast.show(resp.msg || '抱歉，发生未知错误，请检查网络连接稍后重试');
      })
    } catch (e) {
      console.log(e, 'load financial list');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.loading = false;
    if (!this.landed) this.landed = true;
  }
}

const SaleStore = new SaleBillStore();

@observer
export default class FinancialBoard extends React.PureComponent {
  store = SaleStore;
  async componentWillMount() {
    this.store.load();
  }

  render() {
    return (
      <div className="bill-board">
        <div className="bill-header">
          <div className="header-left">
            <p className="title">财务结算</p>
          </div>
        </div>
        <div className="bill-list">
          {!this.store.DS.length && <p className="none-data">暂无结算单</p>}
          {this.store.DS.map((data, index) => (
            <MessageItem message={data} key={index}/>
          ))}
          <div style={{width: '100%', textAlign: 'right'}}>
            {this.store.hasMore && <FlatButton label="加载更多" primary onTouchTap={this.store.load}/>}
          </div>
        </div>
      </div>
    );
  }
}
