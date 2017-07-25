import React from 'react';
import { observable, computed, action, runInAction} from 'mobx';
import { observer, inject} from 'mobx-react';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import BillIcon from 'material-ui/svg-icons/editor/attach-money';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import FinancialSvc from '../../../services/financialBill';
import {ToastStore as Toast} from "../../../components/Toast";
import {BizDialog} from "../../../components/Dialog";
import FinancialDetail, {FinancialDrawer} from "./Detail";
// import {DrawerStore} from "../../../components/Drawer";

class SaleBillStore {
  @observable DS = [];
  @observable recordCount = 0;
  @observable pageNo = 1;
  @observable hasMore = false;
  @observable landed = false;
  @observable loading = false;
  @observable searchedBillNo = '';
  @observable searchResult = null;
  @observable searching = false;
  pageSize = 20;

  @computed get searchValidated() {
    return !!this.searchedBillNo;
  }

  @action setSearchNo = val => this.searchedBillNo = val;

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
  };

  @action abort = async (item) => {
    if (this.aborting) return;
    if (!item.confirm_status || !item.relative_confirm_status) {
      Toast.show('只有在双方都取消确认的情况下才能作废');
      return;
    }
    this.aborting = true;
    try {
      const resp = await FinancialSvc.abort(item.bill_no);
      runInAction('after abort', () => {
        if (resp.code === '0') {
          Toast.show('当前单据已废弃');
          this.DS = this.DS.filter(ds => item.bill_no !== ds.bill_no);
        } else Toast.show(resp.msg || '抱歉，作废失败，请刷新页面后重试');
      });
    } catch (e) {
      console.log(e, 'aborting fin bill');
      Toast.show('抱歉，发生未知错误，请刷新页面后重新尝试');
    }
    this.aborting = false;
  };

  @action search = async () => {
    if (this.searching || !this.searchValidated) return;
    this.searching = true;
    try {
      const resp = await FinancialSvc.getBill(this.searchedBillNo);
      runInAction('after search', () => {
        if (resp.code === '0') {
          Toast.show('搜索成功');
          this.searchResult = resp.data.head;
        } else Toast.show(resp.msg || '抱歉，搜索失败，请刷新页面后重新尝试');
      });
    } catch (e) {
      console.log(e, 'search fin bill');
      Toast.show('抱歉，发生未知错误，请刷新页面后重新尝试');
    }
    this.searching = false;
  }
}

const SaleStore = new SaleBillStore();

@inject('user')
@observer
export default class FinancialBoard extends React.PureComponent {
  store = SaleStore;
  async componentWillMount() {
    this.store.load();
  }
  loadMore = () => {
    if (!this.store.hasMore) return;
    this.store.load();
  };

  render() {
    return (
      <div className="bill-board financial-board">
        <DataList listData={this.store.DS} landed={this.store.landed} loadMore={this.loadMore}
                  abort={this.store.abort} hasMore={this.store.hasMore}/>
        <div style={{flex: 1}}>
          <h3>查找结算单</h3>
          <TextField
            floatingLabelText="请输入查找的单据号"
            value={this.store.searchedBillNo}
            type="number"
            onChange={e => this.store.setSearchNo(e.target.value)}
            style={{marginRight: 20}}
          />
          <RaisedButton label="查找" primary={this.store.searchValidated} icon={<SearchIcon />}
                        disabled={!this.store.searchValidated} onTouchTap={this.store.search}/>
          <br/>
          {this.store.searching && <CircularProgress size={28} style={{display: 'block', margin: '20px auto'}}/>}
          {this.store.searchResult && (
            <ListItem
              leftIcon={<BillIcon />}
              style={{backgroundColor: '#FFF', marginTop: 10, width: 400}}
              rightIconButton={(
                <IconMenu iconButtonElement={iconButtonElement}>
                  <MenuItem onTouchTap={FinancialDrawer.onOpen.bind(null, this.store.searchResult)}>查看详情</MenuItem>
                  {/*<MenuItem onTouchTap={() => DrawerStore.onOpen({...this.store.searchResult, isProcurement: this.store.searchResult.settle_type === 0})}>查看源单据</MenuItem>*/}
                  <MenuItem onTouchTap={this.store.abort.bind(null, this.store.searchResult)}>作废</MenuItem>
                </IconMenu>
              )}
              primaryText={`单据号: ${this.store.searchResult.bill_no}`}
              secondaryText={<p>
                  <span style={{color: darkBlack}}>
                    合作商户：{this.store.searchResult.mer_name}
                  </span><br />
                创建时间: {this.store.searchResult.create_time}
              </p>}
              secondaryTextLines={2}
            />
          )}
        </div>
        <FinancialDetail />
      </div>
    );
  }
}


const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="操作"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const DataList = ({listData, landed, loadMore, hasMore, abort}) => {
  return (
    <List style={{width: 400, marginRight: 10}}>
      <div style={{backgroundColor: '#FFF'}}>
        <Subheader>财务结算单</Subheader>
        {!landed && <CircularProgress size={28} style={{display: 'block', margin: '0 auto 20px auto'}}/>}
        {!(listData && listData.length) && landed && <p className="none-data"
                                                        style={{textAlign: 'center', paddingBottom: 20, color: '#CCC'}}>尚未生成结算单</p>}
        {(listData && listData.length > 0) && <Divider inset={true} />}
      </div>
      <div style={{overflowY: 'auto', overflowX: 'hidden',backgroundColor: '#FFF'}}>
        {
          listData && listData.map((item, index) => (
            <div key={index}>
              <ListItem
                leftIcon={<BillIcon />}
                rightIconButton={(
                  <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem onTouchTap={FinancialDrawer.onOpen.bind(null, item)}>查看详情</MenuItem>
                    {/*<MenuItem onTouchTap={() => DrawerStore.onOpen({...item, isProcurement: item.settle_type === 0})}>查看源单据</MenuItem>*/}
                    <MenuItem onTouchTap={abort.bind(null, item)}>作废</MenuItem>
                  </IconMenu>
                )}
                primaryText={`单据号: ${item.bill_no}`}
                secondaryText={<p>
                  <span style={{color: darkBlack}}>
                    合作商户：{item.mer_name}
                  </span><br />
                  创建时间: {item.create_time}
                </p>}
                secondaryTextLines={2}
              />
              {(listData.length && ((listData.length - 1) !== index)) && <Divider inset={true} />}
            </div>
          ))
        }
        <div style={{backgroundColor: '#FFF', textAlign: 'right'}}>
          <Divider inset={true} />
          {hasMore && <FlatButton label="加载更多" primary={true} onTouchTap={loadMore}/>}
        </div>
      </div>
    </List>
  );
};