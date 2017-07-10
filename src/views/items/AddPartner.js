import React from 'react';
import { observer } from 'mobx-react';
import {observable, action, runInAction} from 'mobx';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {BizDialog} from "../../components/Dialog";
import {ToastStore as Toast} from "../../components/Toast";
import BaseSvc from '../../services/baseData';
import PartnerSvc from '../../services/partner';
import partnerStore from '../stores/partners';

class AddPartnerState {
  @observable partner_id = '';
  @observable partner_flag = null;
  @observable partner_type = null;
  @observable inner_partner_id = '';
  @observable inner_partner_name = '';
  @observable tel = '';
  @observable address = '';
  @observable submitting = false;

  constructor(partner = {}) {
    this.partner_id = partner.partner_id || '';
    this.partner_flag = partner.partner_flag;
    this.partner_type = partner.partner_type;
    this.inner_partner_id = partner.inner_partner_id || '';
    this.inner_partner_name = partner.inner_partner_name || '';
    this.tel = partner.tel || '';
    this.address = partner.address || '';
  }

  submitType = {
    ADD: 0,
    MODIFY: 1,
  };

  @action setKey = (key, val) => this[key] = val;
  @action submit = async (type = this.submitType.ADD) => {
    if (this.submitting || !this.partner_id) return;
    this.submitting = true;
    try {
      const service = type === this.submitType.ADD ? PartnerSvc.invite : BaseSvc.updatePartner;
      const partner_id = parseInt(this.partner_id, 10);
      const partner_flag = parseInt(this.partner_flag , 10);
      const partner_type = parseInt(this.partner_type, 10);
      const resp = await service(partner_id, partner_flag, partner_type,
        this.inner_partner_id, this.inner_partner_name, this.tel, this.address);
      console.log(resp);
      runInAction('after submit add', () => {
        if (resp.code === '0') {
          Toast.show(type === this.submitType.ADD ? '已发送合作申请，请等待或通知对方确认' : '修改成功');
          console.log(partnerStore.DS);
          partnerStore.load();
          BizDialog.onClose();
        }
        else Toast.show(resp.msg || '抱歉，操作失败，请稍后重试');
      })
    } catch (e) {
      console.log(e, 'submit add partner');
      Toast.show('抱歉，发生未知错误，请稍后重试');
    }
    this.submitting = false;
  };
}

@observer
class AddPartner extends React.PureComponent {
  store = new AddPartnerState(this.props.partner);
  render() {
    const {partner} = this.props;
    const submitTxt = partner ? '修改' : '确认';
    const submitType = partner ? this.store.submitType.MODIFY : this.store.submitType.ADD;
    return (
      <form>
        <TextField
          floatingLabelText="合作商户ID"
          value={this.store.partner_id}
          type="number"
          readOnly={!!partner}
          onChange={e => this.store.setKey('partner_id', e.target.value)}
          style={{marginRight: 20}}
        />
        <TextField
          floatingLabelText="内部使用编码（选填）"
          value={this.store.inner_partner_id}
          type="text"
          onChange={e => this.store.setKey('inner_partner_id', e.target.value)}
          style={{marginRight: 20}}
        />
        <SelectField
          floatingLabelText="合作伙伴标识（选填）"
          value={this.store.partner_flag}
          style={{marginRight: 20}}
          onChange={(event, index, val) => this.store.setKey('partner_flag', val)}
        >
          <MenuItem value={1} primaryText="客户" />
          <MenuItem value={2} primaryText="供应商" />
          <MenuItem value={3} primaryText="客户、供应商" />
        </SelectField>
        <SelectField
          floatingLabelText="合作伙伴类型（选填）"
          value={this.store.partner_type}
          style={{marginRight: 20}}
          onChange={(event, index, val) => this.store.setKey('partner_type', val)}
        >
          <MenuItem value={1} primaryText="多个送达方" />
          <MenuItem value={2} primaryText="付款方" />
          <MenuItem value={3} primaryText="开票方" />
        </SelectField>
        <TextField
          floatingLabelText="内部使用名称（选填）"
          value={this.store.inner_partner_name}
          type="text"
          onChange={e => this.store.setKey('inner_partner_name', e.target.value)}
          style={{marginRight: 20}}
        />
        <TextField
          floatingLabelText="电话（选填）"
          value={this.store.tel}
          type="text"
          onChange={e => this.store.setKey('tel', e.target.value)}
          style={{marginRight: 20}}
        />
        <TextField
          floatingLabelText="地址（选填）"
          value={this.store.address}
          type="text"
          onChange={e => this.store.setKey('address', e.target.value)}
          style={{marginRight: 20}}
        />
        <div style={{textAlign: 'right'}}>
          <RaisedButton style={{ marginTop: 20 }} label={this.store.submitting ? null : submitTxt}
                        icon={this.store.submitting ? <CircularProgress size={28}/> : null}
                        primary={!!this.store.partner_id} disabled={!this.store.partner_id}
                        onClick={this.store.submit.bind(null, submitType)} />
          <RaisedButton style={{ marginTop: 20, marginLeft: 20 }} label="取消"
                        primary={false} onClick={BizDialog.onClose} />
        </div>
      </form>
    )
  }
}

export default AddPartner;