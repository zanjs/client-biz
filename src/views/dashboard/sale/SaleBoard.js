import React from 'react';
import { observable, action, runInAction} from 'mobx';
import { observer } from 'mobx-react';
import {MessageItem} from "../../../components/ListItem";
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import BillSvc from '../../../services/bill';
import {ToastStore as Toast} from "../../../components/Toast";
import SearchBill from '../../items/SearchBill';

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
      const resp = await BillSvc.getBillList(2, pageNo, this.pageSize);
      runInAction('after load list', () => {
        if (resp.code === '0' && resp.data.list) {
          this.DS = this.pageNo > 1 ? [...this.DS, ...resp.data.list] : resp.data.list;
          this.recordCount = (resp.data.pagination && resp.data.pagination.record_count) || 0;
          this.hasMore = this.DS.length < this.recordCount;
          if (this.hasMore) this.pageNo++;
        } else Toast.show(resp.msg || '抱歉，发生未知错误，请检查网络连接稍后重试');
      })
    } catch (e) {
      console.log(e, 'load procurement bill');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.loading = false;
    if (!this.landed) this.landed = true;
  }
}

const SaleStore = new SaleBillStore();

@observer
export default class SaleBoard extends React.PureComponent {
  store = SaleStore;
  state = {openFollowActions: false};
  async componentWillMount() {
    this.store.load();
  }

  // selections = ['全部未读', '我负责的', '我参与的', '待处理', '已读'];
  // onSelect = e => this.setState({filterValue: parseInt(e.target.value, 10)});

  static styles = {
    smallIcon: {
      width: 24,
      height: 24,
      fontSize: 20,
      color: '#797979',
    },
    small: {
      width: 30,
      height: 30,
      padding: 4,
    },
  };

  ActionButton = ({icon, action, tooltip}) => (
    <IconButton
      iconClassName="material-icons"
      onClick={action}
      tooltip={tooltip}
      iconStyle={SaleBoard.styles.smallIcon}
      style={SaleBoard.styles.small}>
      {icon}
    </IconButton>
  );

  FollowActions = () => (
    <div style={{marginLeft: 5}}>
      <RaisedButton
        onTouchTap={this.handleFollowActions}
        style={{height: 26, fontSize: 12}}
        label="后续操作"/>
      <Popover
        open={this.state.openFollowActions}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={this.handleFollowActionsClose}>
        <Menu>
          <MenuItem primaryText="发货" />
          <MenuItem primaryText="退货处理" />
          <MenuItem primaryText="生成结算单" />
          <MenuItem primaryText="完成" />
          <MenuItem primaryText="取消" />
        </Menu>
      </Popover>
    </div>
  );
  handleFollowActions = (event) => {
    event.preventDefault();

    this.setState({
      openFollowActions: true,
      anchorEl: event.currentTarget,
    });
  };

  handleFollowActionsClose = () => {
    this.setState({
      openFollowActions: false,
    });
  };

  onSend = () => alert('send');
  onSave = () => alert('save');
  onAttach = async () => {
    if (!window.FileReader) {
      return;
    }
    if (this.uploading) return;
    const files = await new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => resolve(e.target.files);
      input.click();
    });
    const file = files[0];
    this.uploading = true;
    const data = new FormData();
    data.append('uploadfile', file);
    try {
      // const resp = await uploadFile(data);
    } catch (e) {
      console.log(e);
    }
    this.uploading = false;
  };
  onCopy = () => alert('copy');
  onShare = () => alert('share');

  render() {
    return (
      <div className="bill-board sale-bill">
        <div>
          <div className="bill-header">
            <div className="header-left">
              <p className="title">销售业务</p>
              {/*<SelectItem selections={this.selections} selectionCount={this.selectionCount} onSelect={this.onSelect}/>*/}
            </div>
            {/*<div className="header-right">*/}
            {/*<this.ActionButton icon='send' action={this.onSend}/>*/}
            {/*<this.ActionButton icon='save' action={this.onSave}/>*/}
            {/*<this.ActionButton icon='attachment' action={this.onAttach}/>*/}
            {/*<this.ActionButton icon='content_copy' action={this.onCopy}/>*/}
            {/*<this.FollowActions/>*/}
            {/*<this.ActionButton icon='share' action={this.onShare}/>*/}
            {/*</div>*/}
          </div>
          <div className="bill-list">
            {!this.store.DS.length && <p className="none-data">暂无业务单据</p>}
            {this.store.DS.map((data, index) => (
              <MessageItem message={data} key={index}/>
            ))}
            <div style={{width: '100%', textAlign: 'right'}}>
              {this.store.hasMore && <FlatButton label="加载更多" primary onTouchTap={this.store.load}/>}
            </div>
          </div>
        </div>
        <SearchBill title="查找销售单据"/>
      </div>
    );
  }
}
