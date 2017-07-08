import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import {BizDialog} from "../../components/Dialog";
import {ToastStore} from "../../components/Toast";
import merchantSvc from '../../services/merchant';

export default class DialogForm extends React.PureComponent {
  state = {value: '', submitting: false};
  render() {
    const {type, hintTxt, submitTxt} = this.props;
    const {value} = this.state;
    let onTouchTap = null;
    switch (type) {
      default: return null;
      case 'invite':
        onTouchTap = this.submitInviteUser;
        break;
      case 'apply':
        onTouchTap = this.submitJoinMerchant;
        break;
    }
    return (
      <form onSubmit={this.onTouchTap} style={{paddingTop: 10}}>
        <TextField hintText={hintTxt} value={value} type="text" onChange={e => this.setState({ value: e.target.value })}/>
        <RaisedButton label={this.state.submitting ? null : submitTxt} primary={true} style={{marginLeft: 20}}
                      onTouchTap={onTouchTap} disabled={!value}
                      icon={this.state.submitting ? <CircularProgress size={28}/> : null}/>
      </form>
    );
  }

  submitJoinMerchant = async (e) => {
    e.preventDefault();
    const {submitting, value} = this.state;
    if (submitting) return;
    this.setState({ submitting: true });
    try {
      const resp = await merchantSvc.applyMerchant(`${value}`);
      if (resp.code === '0') {
        ToastStore.show('已提交申请，请等待或联系商户通过');
        BizDialog.onClose();
      } else ToastStore.show(resp.msg || '提交失败，请检查商户ID后重试');
    } catch (e) {
      console.log(e, 'apply merchant');
      ToastStore.show('抱歉，发生未知错误，请稍后重试');
    }
    this.setState({ submitting: false });
  };

  submitInviteUser = async (e) => {
    e.preventDefault();
    const {submitting, value} = this.state;
    if (submitting) return;
    this.setState({ submitting: true });
    try {
      const resp = await merchantSvc.inviteUser(value);
      console.log(resp);
      if (resp.code === '0') {
        ToastStore.show('已发送邀请，请等待或联系用户确认');
        BizDialog.onClose();
      } else ToastStore.show(resp.msg || '提交失败，请检查用户ID后重试');
    } catch (e) {
      console.log(e, 'invite user');
      ToastStore.show('抱歉，发生未知错误，请稍后重试');
    }
    this.setState({ submitting: false });
  };
}