import React from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {accountService} from "../../services/account";
import Toast, {ToastStore} from "../../components/Toast";

@inject('user')
@observer
export default class Register extends React.Component {
  state={
    username: '',
    password: '',
    account: '',
    error: {
      account: '',
      username: '',
      password: '',
    },
    submitting: false,
  };
  get validated() {
    const {account, username, password} = this.state;
    const nameValidated = username.trim().length > 0;
    const accountValidated = account.trim().length > 0;
    const passwordValidated = password.trim().length > 5 && password.trim().length <= 20;
    return (accountValidated && nameValidated && passwordValidated);
  }

  checkName = () => {
    const {username} = this.state;
    const error = {...this.state.error, username: ''};
    if (!(username.trim() || username)) {
      error.username = '用户名不能为空';
    } else if(username.trim().length < 1) {
      error.username = '用户名不能少于1个字';
    } else {
      if (this.state.error.username.length) this.setState({ error });
      return;
    }
    this.setState({ error });
  };

  checkAccount = () => {
    const {account} = this.state;
    const error = {...this.state.error, account: ''};
    if (!(account.trim() || account)) {
      error.account = '账号不能为空';
    } else if(account.trim().length < 1) {
      error.account = '账号不能少于1个字';
    } else {
      if (this.state.error.account.length) this.setState({ error });
      return;
    }
    this.setState({ error });
  };

  checkPassword = () => {
    const {password} = this.state;
    const error = {...this.state.error, password: ''};
    if (!(password.trim() || password)) {
      error.password = '密码不能为空';
    } else if(password.trim().length < 6) {
      error.password = '密码不能少于6位';
    } else {
      if (this.state.error.password.length) this.setState({ error });
      return;
    }
    this.setState({ error });
  };

  register = async (e) => {
    e.preventDefault();
    if (this.state.submitting) return;
    this.setState({ submitting: true });
    const {account, username, password} = this.state;
    try {
      const resp = await accountService.register(account, username, password);
      if (resp.code === '0') {
        const loginResp = await accountService.login(account, password);
        const token = loginResp.data.access_token;
        const userData = await accountService.getProfile(loginResp.data.access_token);
        // this.props.login(userData.data, token, {account, password});
        // const data = {user: userData.data, token, account: {account, password}};
        // localStorage.setItem('bizUser', JSON.stringify(data));
        this.props.user.login(token, userData.data, {account, password});
        this.props.history.replace('/dashboard/main');
        return;
      }
      else ToastStore.show('注册失败, 请稍后重试');
    } catch (e) {
      console.log(e, 'register');
      ToastStore.show('抱歉，发生未知错误，请稍后重试');
    }
    this.setState({ submitting: false });
  };

  render() {
    const { account, username, password, error, submitting } = this.state;
    return (
      <div className="layout register-view">
        <div className="title">
          <FontIcon className="material-icons">home</FontIcon>
          <Link to='/' className="title-txt">BizLink</Link>
        </div>
        <div className="card">
          <h4>注册</h4>
          <from onSubmit={this.register} className="form-login">
            <TextField
              hintText="请输入注册账号"
              value={account}
              type="text"
              onBlur={this.checkAccount}
              onChange={e => this.setState({ account: e.target.value })}
              errorText={error.account}
              style={{marginTop: 20}}
              className="login-input"/>
            <TextField
              hintText="请输入用户名"
              value={username}
              type="text"
              onBlur={this.checkName}
              onChange={e => this.setState({ username: e.target.value })}
              errorText={error.username}
              className="login-input"/>
            <TextField
              hintText="请输入密码"
              value={password}
              type="password"
              onBlur={this.checkPassword}
              onChange={e => this.setState({ password: e.target.value })}
              errorText={error.password}
              className="login-input"/>
            <RaisedButton label={submitting ? null : "确认"} className="btn-login" primary={this.validated}
                          disabled={!this.validated} onClick={this.register}
                          icon={submitting ? <CircularProgress size={28}/> : null}/>
            <div className="actions">
              <Link to="/" className="link-register">返回</Link>
            </div>
          </from>
        </div>
        <Toast />
      </div>
    );
  }
}
