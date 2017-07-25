import React from 'react';
import { observable, computed, action, runInAction} from 'mobx';
import { observer } from 'mobx-react';
import Drawer from 'material-ui/Drawer';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import {BizDialog, ComfirmDialog} from "../../../components/Dialog";
import FinancialSvc from '../../../services/financialBill';
import {ToastStore as Toast} from "../../../components/Toast";
import {CURRENCY} from "../../../services/bill";

class DrawerState {
  @observable open = false;
  @observable detail = null;
  @observable invoiced_amount = '';
  @observable pay_amount = '';
  @observable settle_list = [];
  @observable editingSettleItem = {};
  @observable openSettleItemDialog = false;
  @observable confirm_status = 0;
  bill_no = null;

  @computed get needSaveChange() {
    const invoicedChanged = (this.invoiced_amount !== this.detail.head.invoiced_amount);
    const payChanged = (this.pay_amount !== this.detail.head.pay_amount);
    let settleListChanged = false;
    this.detail.settle_list.forEach(origin => {
      const index = this.settle_list.findIndex(item => item.line_no === origin.line_no);
      const current = this.settle_list[index];
      if (current.settle_amount !== origin.settle_amount) settleListChanged = true;
    });
    return invoicedChanged || payChanged || settleListChanged;
  }

  @action setKey = (key, val) => this[key] = val ? parseFloat(val) : '';

  @action onOpen = (bill) => {
    if (!bill || !bill.bill_no) return;
    this.bill_no = bill.bill_no;
    this.load();
    this.open = true;
  };

  @action onClose = () => {
    this.open = false;
    this.detail = null;
    BizDialog.onClose();
  };

  @action load = async () => {
    if (this.loading || !this.bill_no) return;
    this.loading = true;
    try {
      const resp = await FinancialSvc.getBill(this.bill_no);
      runInAction('after load detail', () => {
        if (resp.code === '0') {
          this.detail = resp.data;
          this.confirm_status = this.detail.head.confirm_status;
          this.invoiced_amount = this.detail.head.invoiced_amount;
          this.pay_amount = this.detail.head.pay_amount;
          this.settle_list = [...this.detail.settle_list];
        } else {
          Toast.show(resp.msg || '抱歉，获取结算单失败，请刷新页面后重新尝试');
          this.open = false;
        }
      });
    } catch (e) {
      console.log(e, 'load financial bill');
      Toast.show('抱歉，发生未知错误，请刷新页面后重新尝试');
    }
    this.loading = false;
  };

  @action save = async () => {
    if (this.saving || !this.needSaveChange) return;
    this.saving = true;
    try {
      const invoiced_amount = parseFloat(this.invoiced_amount);
      const pay_amount = parseFloat(this.pay_amount);
      const resp = await FinancialSvc.update(this.bill_no, invoiced_amount, pay_amount, this.settle_list);
      runInAction('after update bill', () => {
        if (resp.code === '0') {
          Toast.show('更新成功');
          this.detail.settle_list = [...this.settle_list];
          this.detail.head.invoiced_amount = parseFloat(this.invoiced_amount);
          this.detail.head.pay_amount = parseFloat(this.pay_amount);
          this.detail = {...this.detail};
        } else Toast.show(resp.msg || '抱歉，更新结算单失败，请刷新页面后重新尝试');
      });
    } catch (e) {
      console.log(e, 'saving fin bill');
      Toast.show('抱歉，发生未知错误，请刷新页面后重新尝试');
    }
    this.saving = false;
  };

  @action handleOpenSettleDialog = item => {
    this.editingSettleItem = item ? {line_no: item.line_no, settle_amount: item.settle_amount} : {};
    this.openSettleItemDialog = true;
  };

  @action handleCloseSettleDialog = () => {
    this.editingSettleItem = {};
    this.openSettleItemDialog = false;
  };

  @computed get editingValidated() {
    const {line_no, settle_amount} = this.editingSettleItem;
    return !!line_no && !!settle_amount;
  };

  @action setSettleItem = (key, value) => {
    if (key === 'settle_amount') value = value && parseFloat(value);
    this.editingSettleItem[key] = value;
    this.editingSettleItem = {...this.editingSettleItem};
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

  @action onCheck = async (value) => {
    // TODO
    this.confirm_status = (value ? 1 : 0);
  }
}

export const FinancialDrawer = new DrawerState();

@observer
export default class FinancialDetail extends React.PureComponent {
  store = FinancialDrawer;

  static styles = {
    smallIcon: {
      width: 24,
      height: 24,
      fontSize: 22,
      color: '#d9d7d3',
    },
    small: {
      width: 30,
      height: 30,
      padding: 4,
      marginLeft: 5,
    },
  };

  onRequestChange = () => {
    if (this.store.needSaveChange) {
      BizDialog.onOpen('是否不保存改动直接退出？', <ComfirmDialog submitAction={this.store.onClose}/>);
      return;
    }
    this.store.onClose();
  };

  get currency() {
    let text = '';
    CURRENCY.forEach(c => {
      if (c.value === this.store.detail.head.currency) text = c.name;
    });
    return text;
  }

  get payType() {
    let text = '';
    switch (this.store.detail.head.pay_type) {
      default: text = '未设置'; break;
      case 1: text = '现款现结'; break;
      case 2: text = '月结'; break;
    }
    return text;
  }

  render() {
    const {detail} = this.store;
    return (
      <Drawer
        width={592}
        openSecondary={true}
        open={this.store.open}
        docked={false}
        onRequestChange={this.onRequestChange}>
        {!this.store.detail ? (<div style={{textAlign: 'center'}}><CircularProgress style={{marginTop: '40%'}}/></div>) : (
          <div>
            <div className="detail-title">
              <p className="detail-label">单据号: {this.store.detail.head.bill_no}</p>
              <div>
                <IconButton
                  iconClassName="material-icons"
                  onClick={this.store.save}
                  tooltip='保存'
                  iconStyle={{...FinancialDetail.styles.smallIcon, color: this.store.needSaveChange ? '#189acf' : '#d9d7d3'}}
                  style={FinancialDetail.styles.small}>
                  {'save'}
                </IconButton>
                <IconButton
                  iconClassName="material-icons"
                  onClick={this.onRequestChange}
                  iconStyle={FinancialDetail.styles.smallIcon}
                  style={{...FinancialDetail.styles.small, marginLeft: 20}}>
                  {'close'}
                </IconButton>
              </div>
            </div>
            <div style={{paddingLeft: 20}}>
              <TextField floatingLabelText="合作商户" value={detail.head.mer_name} disabled style={{marginRight: 20}}/>
              <TextField floatingLabelText="合作商户ID" value={detail.head.mer_id} disabled style={{marginRight: 20}}/>
              <Checkbox
                label={this.store.confirm_status === 1 ? '取消确认结算单' : '确认结算单'}
                checked={this.store.confirm_status === 1}
                onCheck={(e, v) => this.store.onCheck(v)}
                style={{display: 'inline-block', width: '49%', marginTop: 10}}
              />
              <Checkbox
                label="合作商户确认状态"
                checked={detail.head.relative_confirm_status === 1}
                disabled
                style={{display: 'inline-block', width: '49%', marginTop: 10}}
              />
              <br/>
              <TextField floatingLabelText="供应商已开票金额"
                         value={this.store.invoiced_amount || '未设置'}
                         style={{marginRight: 20}}
                         type="number"
                         onChange={e => this.store.setKey('invoiced_amount', e.target.value)}/>
              <TextField floatingLabelText="客户已付款金额"
                         value={this.store.pay_amount || '未设置'}
                         style={{marginRight: 20}}
                         type="number"
                         onChange={e => this.store.setKey('pay_amount', e.target.value)}/>
              <TextField floatingLabelText="开票总金额"
                         value={detail.head.total_amount || ''}
                         style={{marginRight: 20}}
                         type="number"
                         disabled
                         onChange={e => this.store.setKey('total_amount', e.target.value)}/>
              <TextField floatingLabelText="币种" value={this.currency} disabled style={{marginRight: 20}}/>
              <TextField floatingLabelText="付款方式" value={this.payType} disabled style={{marginRight: 20}}/>
              <TextField floatingLabelText="含税标志" value={detail.head.tax_flag ? '含税' : '不含税'} disabled style={{marginRight: 20}}/>
              <SelectField
                floatingLabelText="结算类型" disabled
                value={detail.head.settle_type}
                style={{marginRight: 20}}>
                <MenuItem value={0} primaryText="采购付款" />
                <MenuItem value={1} primaryText="销售" />
              </SelectField>
              <SelectField
                floatingLabelText="发票类型" disabled
                value={detail.head.invoice_type}
                style={{marginRight: 20}}>
                <MenuItem value={0} primaryText="蓝色发票" />
                <MenuItem value={1} primaryText="红字发票(冲减)" />
              </SelectField>
              <TextField floatingLabelText="创建时间" value={detail.head.create_time} disabled style={{marginRight: 20}}/>
              <TextField floatingLabelText="更新时间" value={detail.head.update_time || '暂无'} disabled style={{marginRight: 20}}/>
              <br/><br/>
              <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                  <TableRow>
                    <TableHeaderColumn>物料行号</TableHeaderColumn>
                    <TableHeaderColumn>结算金额</TableHeaderColumn>
                    <TableHeaderColumn style={{width: 40, textAlign: 'center'}}>操作</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody showRowHover displayRowCheckbox={false}>
                  {this.store.settle_list.map((item, key) => (
                    <TableRow key={key}>
                      <TableRowColumn>{item.line_no}</TableRowColumn>
                      <TableRowColumn>{item.settle_amount}</TableRowColumn>
                      <TableRowColumn style={{width: 40}}>
                        <button className="btn-material-action" onClick={e => {
                          e.preventDefault();
                          this.store.handleOpenSettleDialog(item);
                        }}>
                          修改
                        </button>
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Dialog
              title='编辑结算明细行'
              titleStyle={{fontSize: 18}}
              modal={false}
              autoScrollBodyContent
              open={this.store.openSettleItemDialog}
              onRequestClose={this.store.handleCloseSettleDialog}>
              <form onSubmit={this.store.confirmSettleItem}>
                <TextField floatingLabelText="行号" value={this.store.editingSettleItem.line_no} disabled style={{marginRight: 20}}/>
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
          </div>
        )}
      </Drawer>
    );
  }
}
