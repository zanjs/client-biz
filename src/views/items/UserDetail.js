import React from 'react';
import {observable, action, runInAction} from 'mobx';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {BizDialog} from "../../components/Dialog";
import CircularProgress from 'material-ui/CircularProgress';
import BaseSvc from '../../services/baseData';
import {ToastStore as Toast} from "../../components/Toast";
import MerchantMenbers from '../stores/merchantMember';

class UserDetail extends React.PureComponent {
  render() {
    const {user} = this.props;
    return (
      <form>
        <TextField
          floatingLabelText="姓名"
          value={`${user.user_name || ''} (id: ${user.user_id})`}
          type="text"
          readOnly={true}
          style={{marginRight: 20}}
        />
        <TextField
          floatingLabelText="账户名"
          value={user.account}
          type="text"
          readOnly={true}
          style={{marginRight: 20}}
        />
        <TextField
          floatingLabelText="部门"
          value={`${user.dep_name || '暂无部门'} (id: ${user.dep_id || ''})`}
          type="text"
          readOnly={true}
          style={{marginRight: 20}}
        />
        {user.tel && <TextField floatingLabelText="电话号码" value={user.tel} readOnly={true} style={{marginRight: 20}}/>}
        {user.mobile && <TextField floatingLabelText="手机号" value={user.mobile} readOnly={true} style={{marginRight: 20}}/>}
        <div style={{textAlign: 'right'}}>
          <RaisedButton style={{ marginTop: 20, marginLeft: 20 }} label='关闭'
                        primary={false} onClick={BizDialog.onClose} />
        </div>
      </form>
    )
  }
}

export default UserDetail;

export class SetDepartment extends React.PureComponent {
  state = {id: null, submitting: false};
  submit = async () => {
    if (this.submitting || !this.state.id) return;
    const {user} = this.props;
    this.submitting = true;
    try {
      const resp = await BaseSvc.updateUser(user.user_name, this.state.id);
      if (resp.code === '0') {
        const newUser = {...user, dep_id: this.state.id};
        MerchantMenbers.updateUser(newUser);
        BizDialog.onClose();
        Toast.show('设置成功');
      } else Toast.show(resp.msg || '抱歉，设置失败，请刷新页面重新尝试');
    } catch (e) {
      console.log(e, 'set user department');
      Toast.show('抱歉，发生未知错误，请刷新页面稍后重试');
    }
    this.submitting = false;
  };
  render() {
    return (
      <form>
        <TextField
          floatingLabelText="用户名"
          value={this.props.user.user_name}
          type="text" readOnly
          style={{marginRight: 20}}
        />
        <TextField
          floatingLabelText="需要配置的部门id"
          value={this.state.id}
          type="number"
          onChange={e => this.setState({id: e.target.value})}
          style={{marginRight: 20}}
        />
        <div style={{textAlign: 'right'}}>
          <RaisedButton style={{ marginTop: 20 }} label={this.state.submitting ? null : '确定'}
                        icon={this.state.submitting ? <CircularProgress size={28}/> : null}
                        primary={!!this.state.id} disabled={!this.state.id}
                        onClick={this.submit} />
          <RaisedButton style={{ marginTop: 20, marginLeft: 20 }} label="取消"
                        primary={false} onClick={BizDialog.onClose} />
        </div>
      </form>
    )
  }
}