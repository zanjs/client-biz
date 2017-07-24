import React from 'react';
import { observer } from 'mobx-react';
import {observable, computed, action, runInAction} from 'mobx';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {ToastStore as Toast} from "../../components/Toast";
import BillSvc from '../../services/bill';
import {BizDialog} from "../../components/Dialog";
import {detailStore} from "../../components/Detail";

class ManageBillItemState {
  @observable submitting = false;
  @observable submitLineNo = [];
  @observable submitQuatity = {};

  @computed get submitItems() {
    const items = [];
    this.submitLineNo.forEach(no => {
      detailStore.confirmedItemDS.forEach(item => {
        if (item.line_no === no) items.push(item);
      })
    });
    return items;
  }

  @computed get validated() {
    let quantityValidated = true;
    this.submitItems.forEach(item => {
      const quantity = this.submitQuatity[item.line_no];
      if (!quantity || quantity > item.quantity || quantity <= 0) quantityValidated = false;
    });
    return !!this.submitLineNo.length && quantityValidated;
  }

  @action setKey = (key, val) => {
    this[key] = val;
    this.submitQuatity = {};
  };

  @action setQuatity = (target, value) => {
    this.submitQuatity[target] = (value && parseFloat(value)) || '';
    this.submitQuatity = {...this.submitQuatity};
  };

  @action submit = async () => {
    const billNo = detailStore.detail.head.bill_no;
    if (this.submitting || !this.validated || !billNo) return;
    this.submitting = true;
    try {
      const line_no = this.submitLineNo.join(',');
      let quantity = '';
      this.submitLineNo.forEach(no => quantity += this.submitQuatity[no]);
      const resp = await BillSvc.sendItem(billNo, line_no, quantity);
      runInAction('after submit send', () => {
        if (resp.code === '0') {
          Toast.show('发货成功');
        }
        else Toast.show(resp.msg || '抱歉，发货失败，请稍后重试');
      })
    } catch (e) {
      console.log(e, 'submit send item');
      Toast.show('抱歉，发生未知错误，请稍后重试');
    }
    this.submitting = false;
  };
}

@observer
class ManageBillItem extends React.PureComponent {
  store = new ManageBillItemState();
  billStore = detailStore;
  render() {
    return (
      <form onSubmit={this.store.submit}>
        <SelectField
          floatingLabelText="需要发货的物料行号"
          value={this.store.submitLineNo}
          style={{width: '100%'}}
          multiple={true}
          onChange={(event, index, val) => this.store.setKey('submitLineNo', val)}
        >
          {this.billStore.confirmedItemDS.map((item, index) => (
            <MenuItem value={item.line_no} primaryText={item.line_no} insetChildren={true}
                      checked={this.store.submitLineNo.findIndex(no => no === item.line_no) > -1}
                      key={index}/>
          ))}
        </SelectField><br/>
        {this.store.submitItems.map((item, index) => (
          <TextField floatingLabelText={`行号: ${item.line_no} 发货数量`}
          value={this.store.submitQuatity[item.line_no] || ''} style={{marginRight: 20}} type="number"
          errorText={this.store.submitQuatity[item.line_no] > item.quantity ? '发货数量不能超过订货数量' : null}
          onChange={(e, value) => this.store.setQuatity(item.line_no, value)} key={index}/>
          ))}
        <div style={{textAlign: 'right'}}>
          <RaisedButton style={{ marginTop: 20 }} label={this.store.submitting ? null : '提交'}
                        icon={this.store.submitting ? <CircularProgress size={28}/> : null}
                        primary={!!this.store.validated} disabled={!this.store.validated}
                        onClick={this.store.submit} />
          <RaisedButton style={{ marginTop: 20, marginLeft: 20 }} label="取消"
                        primary={false} onClick={BizDialog.onClose} />
        </div>
      </form>
    )
  }
}

export default ManageBillItem;