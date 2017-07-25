import React from 'react';
import { observable, computed, action, runInAction} from 'mobx';
import { observer } from 'mobx-react';
import {MessageItem} from "../../components/ListItem";
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import BillSvc from '../../services/bill';
import {ToastStore as Toast} from "../../components/Toast";

class SearchState {
  @observable searchedBillNo = '';
  @observable searchResult = null;
  @observable searching = false;

  @computed get searchValidated() {
    return !!this.searchedBillNo;
  }

  @action setSearchNo = val => this.searchedBillNo = val;

  @action search = async () => {
    if (this.searching || !this.searchValidated) return;
    this.searching = true;
    try {
      const resp = await BillSvc.getBill(this.searchedBillNo);
      runInAction('after search', () => {
        if (resp.code === '0') {
          Toast.show('搜索成功');
          this.searchResult = resp.data.head;
        } else {
          this.searchResult = null;
          Toast.show(resp.msg || '抱歉，搜索失败，请刷新页面后重新尝试');
        }
      });
    } catch (e) {
      console.log(e, 'search fin bill');
      Toast.show('抱歉，发生未知错误，请刷新页面后重新尝试');
    }
    this.searching = false;
  }
}

@observer
export default class SearchBill extends React.PureComponent {
  store = new SearchState();

  render() {
    const {isProcurement, title} = this.props;
    return (
      <div className="board-search">
        <h3>{title}</h3>
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
          <div style={{width: 400, marginTop: 20}}>
            <MessageItem message={this.store.searchResult} isProcurement={isProcurement}/>
          </div>
        )}
      </div>
    );
  }
}
