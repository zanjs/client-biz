import React from 'react';
import { observer, inject } from 'mobx-react';
import {observable, computed, action, runInAction} from 'mobx';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import DatePicker from 'material-ui/DatePicker';
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
import BillSvc from '../../services/bill';
import Checkbox from 'material-ui/Checkbox';
import MemberStore from "../stores/merchantMember";
import AddMaterial from "./AddMaterial";

class AddBillState {
  @observable bill_type = null;
  @observable relative_mer_id = '';
  @observable currency = null;
  @observable pay_type = null;
  @observable tax_flag = null;
  @observable tax_rate = '';
  @observable valid_begin_time = '';
  @observable valid_end_time = '';
  @observable notice_list = [];
  @observable content = '';
  @observable priorityA = null;
  @observable priorityB = null;
  @observable item_list = [{}, {}];
  @observable openMemberListDialog = false;
  @observable openAddItemDialog = false;
  @observable editingMaterial = {};

  @computed get noticeNameStr() {
    const nameArr = this.notice_list.map(item => item.user_name);
    return nameArr.join(', ');
  }

  @computed get noticeIdStr() {
    const idArr = this.notice_list.map(item => item.user_id);
    return idArr.join(', ');
  }

  // constructor(bill = {}) {}

  @action setKey = (key, val) => this[key] = val;
  @action closeMemberDialog = () => this.openMemberListDialog = false;
  @action openMemberDialog = () => this.openMemberListDialog = true;
  @action openItemDialog = () => this.openAddItemDialog = true;
  @action closeItemDialog = () => this.openAddItemDialog = false;

  @action getBillNo = async () => {
    if (this.getting) return;
    this.getting = true;
    let bill_no = '';
    try {
      const key = '9deb17fa79572cdbe980ff9257009edd7fdb8a50';
      const resp = await BillSvc.getBillNo(key);
      console.log(resp);
      runInAction('after get no', () => {
        if (resp.code === '0') {
          bill_no = resp.data.bill_no;
        } else Toast.show(resp.msg || '抱歉，操作失败，请稍后重试');
      });
    } catch (e) {
      console.log(e, 'get bill no');
      Toast.show('抱歉，发生未知错误，请稍后重试');
    }
    return bill_no;
  };

  @action submit = async () => {
    if (this.submitting) return;
    this.submitting = true;
    try {
      const bill_no = await this.getBillNo();
      if (!bill_no) return;
      const relative_mer_id = parseInt(this.relative_mer_id, 10);
      const bill_type = parseInt(this.bill_type, 10);
      const pay_type = parseInt(this.pay_type, 10);
      const tax_flag = parseInt(this.tax_flag, 10);
      const tax_rate = parseFloat(this.tax_rate);
      const priority = `${this.priorityA}, ${this.priorityB}`; // TODO check
      const notice_list = this.noticeIdStr;
      console.log(this.valid_begin_time, this.valid_end_time);
      const resp = await BillSvc.create(bill_no, bill_type, relative_mer_id, this.currency, pay_type,
        tax_flag, tax_rate, this.valid_begin_time, this.valid_end_time, notice_list, this.content,
        priority, this.item_list);
      console.log(resp);
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

  @action updateFollow = (member, checked) => {
    if (checked) {
      this.notice_list = [...this.notice_list, member];
    } else {
      this.notice_list = this.notice_list.filter(item => item.user_id !== member.user_id);
    }
  };

  @action addMaterialItem = item => this.item_list = this.item_list.push(item);
  @action deleteMaterialItem = item => this.item_list = this.item_list.filter(raw => raw.id !== item.id);
  @action updateMaterialItem = item => {
    this.item_list.map(rawData => {
      if (rawData.id === item.id) return item;
    });
  }
}

@inject('user')
@observer
export default class AddBill extends React.PureComponent {
  store = new AddBillState();
  currentUser = this.props.user.user.current;
  componentWillMount() {
    MemberStore.load();
  }
  render() {
    const followArray = [...this.store.notice_list];
    return (
      <form onSubmit={this.store.submit}>
        <TextField
          floatingLabelText="合作商户ID"
          value={this.store.relative_mer_id}
          type="number"
          onChange={e => this.store.setKey('relative_mer_id', e.target.value)}
          style={{marginRight: 20}}
        /><br/>
        <SelectField
          floatingLabelText="单据类型"
          value={this.store.bill_type}
          style={{marginRight: 20}}
          onChange={(event, index, val) => this.store.setKey('bill_type', val)}
        >
          <MenuItem value={1} primaryText="产能反馈单" />
          <MenuItem value={2} primaryText="询报价单" />
          <MenuItem value={3} primaryText="采购订单" />
          <MenuItem value={4} primaryText="协议" />
        </SelectField>
        <SelectField
          floatingLabelText="汇率"
          value={this.store.currency}
          style={{marginRight: 20}}
          onChange={(event, index, val) => this.store.setKey('currency', val)}
        >
          <MenuItem value='CNY' primaryText='CNY' />
          <MenuItem value='USD' primaryText='USD' />
          <MenuItem value='EUR' primaryText='EUR' />
          <MenuItem value='JPY' primaryText='JPY' />
        </SelectField>
        <SelectField
          floatingLabelText="付款方式"
          value={this.store.pay_type}
          style={{marginRight: 20}}
          onChange={(event, index, val) => this.store.setKey('pay_type', val)}
        >
          <MenuItem value={1} primaryText='现款现结' />
          <MenuItem value={2} primaryText='月结' />
        </SelectField>
        <SelectField
          floatingLabelText="含税标志"
          value={this.store.tax_flag}
          style={{marginRight: 20}}
          onChange={(event, index, val) => this.store.setKey('tax_flag', val)}
        >
          <MenuItem value={0} primaryText='不含税' />
          <MenuItem value={1} primaryText='含税' />
        </SelectField>
        {!!this.store.tax_flag && <TextField
          floatingLabelText="税率"
          value={this.store.tax_rate}
          type="number"
          onChange={e => this.store.setKey('tax_rate', e.target.value)}
          style={{marginRight: 20}}
        />}<br/>
        {this.store.bill_type === 4 && <DatePicker floatingLabelText="协议有效开始时间"
                                                   onChange={(e, value) => this.store.setKey('valid_begin_time', value)}/>}
        {this.store.bill_type === 4 && <DatePicker floatingLabelText="协议有效结束时间"
                                                   onChange={(e, value) => this.store.setKey('valid_end_time', value)}/>}
        <TextField
          floatingLabelText="单据文字内容"
          value={this.store.content}
          type="text"
          multiLine={true}
          rows={1}
          rowsMax={4}
          onChange={e => this.store.setKey('content', e.target.value)}
          style={{marginRight: 20}}
        /><br/>
        <SelectField
          floatingLabelText="重要度"
          value={this.store.priorityA}
          style={{marginRight: 20}}
          onChange={(event, index, val) => this.store.setKey('priorityA', val)}
        >
          <MenuItem value='NOT_IMPORTENT' primaryText='不重要' />
          <MenuItem value='NORMAL' primaryText='正常' />
          <MenuItem value='IMPORTENT' primaryText='重要' />
          <MenuItem value='VERY_IMPORTENT' primaryText='非常重要' />
        </SelectField>
        <SelectField
          floatingLabelText="紧急度"
          value={this.store.priorityB}
          style={{marginRight: 20}}
          onChange={(event, index, val) => this.store.setKey('priorityB', val)}
        >
          <MenuItem value='HURRY' primaryText='紧急' />
          <MenuItem value='VERY_HURRY' primaryText='非常紧急' />
        </SelectField><br/>
        <TextField
          floatingLabelText="单据关注人列表"
          value={this.store.noticeNameStr}
          type="text"
          readOnly
          style={{marginRight: 20}}
        />
        <FloatingActionButton mini={true} style={{marginRight: 20}} onTouchTap={this.store.openMemberDialog}>
          <ContentAdd />
        </FloatingActionButton><br/>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn >行号</TableHeaderColumn>
              <TableHeaderColumn>物料名称</TableHeaderColumn>
              <TableHeaderColumn >物料编码</TableHeaderColumn>
              <TableHeaderColumn >物料规格</TableHeaderColumn>
              <TableHeaderColumn >单位</TableHeaderColumn>
              <TableHeaderColumn >单价</TableHeaderColumn>
              <TableHeaderColumn >操作</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover displayRowCheckbox={false}>
            {this.store.item_list.map((item, key) => (
              <TableRow key={key}>
                <TableHeaderColumn >{item.line_no}</TableHeaderColumn>
                <TableHeaderColumn>{item.name}</TableHeaderColumn>
                <TableHeaderColumn >{item.item_code}</TableHeaderColumn>
                <TableHeaderColumn >{item.item_spec}</TableHeaderColumn>
                <TableHeaderColumn >{item.unit}</TableHeaderColumn>
                <TableHeaderColumn >{item.price}</TableHeaderColumn>
                <TableHeaderColumn >
                  <button>修改</button>
                  <button>删除</button>
                  {/*<FlatButton style={{}} label='修改'*/}
                                {/*onClick={this.store.updateMaterialItem.bind(null, item)} />*/}
                  {/*<FlatButton style={{}} label="删除"*/}
                                {/*onClick={this.store.deleteMaterialItem.bind(null, item)} />*/}
                </TableHeaderColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <FloatingActionButton mini={true} style={{marginTop: 20}} onTouchTap={this.store.openItemDialog}>
          <ContentAdd />
        </FloatingActionButton><br/>
        <div style={{textAlign: 'right'}}>
          <RaisedButton style={{ marginTop: 20 }} label={this.store.submitting ? null : '确认'}
                        icon={this.store.submitting ? <CircularProgress size={28}/> : null}
                        primary={!!(this.store.bill_type && this.store.relative_mer_id)}
                        disabled={!(this.store.bill_type && this.store.relative_mer_id)}
                        onClick={this.store.submit} />
          <RaisedButton style={{ marginTop: 20, marginLeft: 20 }} label="取消"
                        primary={false} onClick={BizDialog.onClose} />
        </div>
        <Dialog
          title='商户成员列表'
          titleStyle={{fontSize: 18}}
          modal={false}
          autoScrollBodyContent
          open={this.store.openMemberListDialog}
          onRequestClose={this.store.closeMemberDialog}>
          <div>
            {MemberStore.memberList.filter(member => member.user_id !== this.currentUser.id).map((member, key) => (
              <Checkbox label={member.user_name} key={key}
                        checked={followArray.findIndex(follow => follow.user_id === member.user_id) > -1}
                        onCheck={(event, checked) => this.store.updateFollow(member, checked)}/>
            ))}
          </div>
        </Dialog>
        <Dialog
          title='商户成员列表'
          titleStyle={{fontSize: 18}}
          modal={false}
          autoScrollBodyContent
          open={this.store.openAddItemDialog}
          onRequestClose={this.store.closeItemDialog}>
          <AddMaterial material={this.store.editingMaterial}
                       onAdd={this.store.addMaterialItem}
                       onDel={this.store.deleteMaterialItem}
                       onUpdate={this.store.updateMaterialItem}
                       onclose={this.store.closeItemDialog}/>
        </Dialog>
      </form>
    )
  }
}
