import React from 'react';
import { observer } from 'mobx-react';
import {observable, computed, action, runInAction} from 'mobx';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import {BizDialog} from "../../components/Dialog";
import {ToastStore as Toast} from "../../components/Toast";
import {CURRENCY} from '../../services/bill';
import FinancailSvc from '../../services/financialBill';
import {detailStore} from "../../components/Detail";

class AddFinancialBillState {
  @observable bill_no = '';
  @observable settle_type = '';
  @observable invoice_type = '';
  @observable relative_mer_id = '';
  @observable currency = '';
  @observable pay_type = '';
  @observable tax_flag = '';
  @observable total_amount = '';
  @observable invoiced_amount = '';
  @observable pay_amount = '';
  @observable settle_list = [];

  @observable editingSettleItem = {};
  @observable openSettleItemDialog = false;

  constructor() {
    const billData = detailStore.detail;
    this.bill_no = billData.head.bill_no;
    this.settle_type = billData.isProcurement ? 0 : 1;
    this.relative_mer_id = billData.head.mer_id;
    this.currency = billData.head.currency;
    this.pay_type = billData.head.pay_type;
    this.tax_flag = billData.head.tax_flag;
    this.total_amount = billData.head.amount;
  }

  @computed get validated() {
    const settleTypeValidate = (this.settle_type === 0 || this.settle_type === 1);
    const invoiceTypeValidated = (this.invoice_type === 0 || this.invoice_type === 1);
    return (!!this.bill_no && settleTypeValidate && invoiceTypeValidated && !!this.relative_mer_id && !!this.currency &&
      !!this.pay_type && !!this.total_amount && !!this.invoiced_amount && !!this.pay_amount &&
      !!this.settle_list.length);
  }

  @action setKey = (key, val) => this[key] = val;

  @action handleOpenSettleDialog = item => {
    this.editingSettleItem = item ? {line_no: item.line_no, settle_amount: item.settle_amount} : {};
    this.openSettleItemDialog = true;
  };

  @action handleCloseSettleDialog = () => {
    this.editingSettleItem = {};
    this.openSettleItemDialog = false;
  };

  @action deleteSettleItem = item => {
    this.settle_list = this.settle_list.filter(si => si.line_no !== item.line_no);
  };

  @action setSettleItem = (key, value) => {
    if (key === 'settle_amount') value = value && parseFloat(value);
    this.editingSettleItem[key] = value;
    this.editingSettleItem = {...this.editingSettleItem};
  };

  @computed get editingValidated() {
    const {line_no, settle_amount} = this.editingSettleItem;
    return !!line_no && !!settle_amount;
  };

  @action confirmSettleItem = () => {
    if (!this.editingValidated) return;
    const index = this.settle_list.findIndex(item => item.line_no === this.editingSettleItem.line_no);
   this.editingSettleItem.source_no = this.bill_no;
    if (index === -1) {
      this.settle_list = [...this.settle_list, this.editingSettleItem]
    } else {
      this.settle_list[index] = this.editingSettleItem;
      this.settle_list = [...this.settle_list];
    }
    this.openSettleItemDialog = false;
    this.editingSettleItem = {}
  };


  @action submit = async () => {
    if (this.submitting || !this.validated) return;
    this.submitting = true;
    try {
      const total_amount = parseFloat(this.total_amount);
      const invoiced_amount = parseFloat(this.invoiced_amount);
      const pay_amount = parseFloat(this.pay_amount);
      const resp = await FinancailSvc.create(this.bill_no, this.settle_type, this.invoice_type, this.relative_mer_id,
        this.currency, this.pay_type, this.tax_flag, total_amount, invoiced_amount, pay_amount, this.settle_list);
      runInAction('after create bill', () => {
        if (resp.code === '0') {
          Toast.show('创建成功');
          BizDialog.onClose();
        } else Toast.show(resp.msg || '抱歉，创建失败，请稍后重试');
      });
    } catch (e) {
      console.log(e, 'submit add partner');
      Toast.show('抱歉，发生未知错误，请稍后重试');
    }
    this.submitting = false;
  };
}

@observer
export default class AddFinancialBill extends React.PureComponent {
  store = new AddFinancialBillState();

  get currency() {
    let text = '';
    CURRENCY.forEach(c => {
      if (c.value === this.store.currency) text = c.name;
    });
    return text;
  }

  get payType() {
    let text = '';
    switch (this.store.pay_type) {
      default: text = '未设置'; break;
      case 1: text = '现款现结'; break;
      case 2: text = '月结'; break;
    }
    return text;
  }

  render() {
    return (
      <form onSubmit={this.store.submit}>
        <TextField floatingLabelText="单据号" value={this.store.bill_no} disabled style={{marginRight: 20}}/>
        <TextField floatingLabelText="关联商户ID" value={this.store.relative_mer_id} disabled style={{marginRight: 20}}/>
        <TextField floatingLabelText="币种" value={this.currency} disabled style={{marginRight: 20}}/>
        <TextField floatingLabelText="付款方式" value={this.payType} disabled style={{marginRight: 20}}/>
        <TextField floatingLabelText="含税标志" value={this.store.tax_flag ? '含税' : '不含税'} disabled style={{marginRight: 20}}/>
        <TextField floatingLabelText="开票总金额"
                   value={this.store.total_amount}
                   style={{marginRight: 20}}
                   type="number"
                   onChange={e => this.store.setKey('total_amount', e.target.value)}/>
        <SelectField
          floatingLabelText="结算类型" disabled
          value={this.store.settle_type}
          style={{marginRight: 20}}>
          <MenuItem value={0} primaryText="采购付款" />
          <MenuItem value={1} primaryText="销售" />
        </SelectField>
        <SelectField
          floatingLabelText="发票类型"
          value={this.store.invoice_type}
          onChange={(event, index, val) => this.store.setKey('invoice_type', val)}
          style={{marginRight: 20}}>
          <MenuItem value={0} primaryText="蓝色发票" />
          <MenuItem value={1} primaryText="红字发票(冲减)" />
        </SelectField>
        <TextField floatingLabelText="供应商已开票金额"
                   value={this.store.invoiced_amount}
                   style={{marginRight: 20}}
                   type="number"
                   onChange={e => this.store.setKey('invoiced_amount', e.target.value)}/>
        <TextField floatingLabelText="客户已付款金额"
                   value={this.store.pay_amount}
                   style={{marginRight: 20}}
                   type="number"
                   onChange={e => this.store.setKey('pay_amount', e.target.value)}/>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>物料行号</TableHeaderColumn>
              <TableHeaderColumn>结算金额</TableHeaderColumn>
              <TableHeaderColumn style={{width: 80}}>操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover displayRowCheckbox={false}>
            {this.store.settle_list.map((item, key) => (
              <TableRow key={key}>
                <TableRowColumn>{item.line_no}</TableRowColumn>
                <TableRowColumn>{item.settle_amount}</TableRowColumn>
                <TableRowColumn style={{width: 80}}>
                  <button className="btn-material-action" onClick={e => {
                    e.preventDefault();
                    this.store.handleOpenSettleDialog(item);
                  }}>
                    修改
                  </button>
                  <button className="btn-material-action" onClick={e => {
                    e.preventDefault();
                    this.store.deleteSettleItem(item);
                  }}>
                    删除
                  </button>
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div style={{textAlign: 'right'}}>
          <FloatingActionButton mini={true} style={{marginTop: 20}} onTouchTap={this.store.handleOpenSettleDialog}>
            <ContentAdd />
          </FloatingActionButton>
        </div>
        <br/>
        <div style={{textAlign: 'right'}}>
          <RaisedButton style={{ marginTop: 20 }} label={this.store.submitting ? null : '确认'}
                        icon={this.store.submitting ? <CircularProgress size={28}/> : null}
                        primary={this.store.validated}
                        disabled={!this.store.validated}
                        onClick={this.store.submit} />
          <RaisedButton style={{ marginTop: 20, marginLeft: 20 }} label="取消"
                        primary={false} onClick={BizDialog.onClose} />
        </div>
        <Dialog
          title='编辑结算明细行'
          titleStyle={{fontSize: 18}}
          modal={false}
          autoScrollBodyContent
          open={this.store.openSettleItemDialog}
          onRequestClose={this.store.handleCloseSettleDialog}>
            <form onSubmit={this.store.confirmSettleItem}>
              <SelectField
                floatingLabelText="行号"
                value={this.store.editingSettleItem.line_no || ''}
                onChange={(event, index, val) => this.store.setSettleItem('line_no', val)}
                style={{marginRight: 20}}>
                {detailStore.confirmedItemDS.map((item, index) => (
                  <MenuItem value={item.line_no} primaryText={item.line_no} key={index}/>
                ))}
              </SelectField><br/>
              <TextField floatingLabelText="结算金额"
                         value={this.store.editingSettleItem.settle_amount || ''}
                         style={{marginRight: 20}}
                         type="number"
                         onChange={e => this.store.setSettleItem('settle_amount', e.target.value)}/>
              <div style={{textAlign: 'right'}}>
                <RaisedButton style={{ marginTop: 20 }} label='确认'
                              primary={this.store.editingValidated}
                              disabled={!this.store.editingValidated}
                              onClick={this.store.confirmSettleItem} />
                <RaisedButton style={{ marginTop: 20, marginLeft: 20 }} label="取消"
                              primary={false} onClick={this.store.handleCloseSettleDialog} />
              </div>
            </form>
        </Dialog>
      </form>
    )
  }
}
