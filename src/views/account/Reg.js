import React from 'react';
import { Link } from 'react-router-dom';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {accountService} from "../../services/account";
import Toast from "../../components/Toast";


export default class Register extends React.Component {
  state={
    username: '',
    password: '',
    error: {
      username: '',
      password: '',
    },
    toastMessage: '',
  };
  get validated() {
    const {username, password} = this.state;
    const nameValidated = username.trim().length > 1;
    const passwordValidated = password.trim().length > 5 && password.trim().length <= 20;
    if (nameValidated && passwordValidated) return true;
    return false;
  }

  checkName = () => {
    const {username} = this.state;
    const error = {...this.state.error, username: ''};
    if (!(username.trim() || username)) {
      error.username = '用户名不能为空';
    } else if(username.trim().length < 2) {
      error.username = '用户名不能少于2个字';
    } else {
      if (this.state.error.username.length) this.setState({ error });
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
    const {username, password} = this.state;
    try {
      this.props.history.replace('/add_merchant', {username, password});
      // const resp = await accountService.register(username, password);
      // console.log(resp, 'register');
      // if (resp.code == 0) {
      //   this.props.history.replace('/add_merchant', {username, password});
      // }
      // else this.refs.toast.show('注册失败, 请稍后重试', 1000);
    } catch (e) {
      console.log(e, 'register');
      this.refs.toast.show('抱歉，发生未知错误，请稍后重试', 1000);
    }
  };

  render() {
    const { username, password, error } = this.state;
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
            <RaisedButton label="确认" className="btn-login" primary={this.validated} disabled={!this.validated} onClick={this.register}/>
            <div className="actions">
              <Link to="/" className="link-register">返回</Link>
            </div>
          </from>
        </div>
        <Toast ref="toast"/>
      </div>
    );
  }
}
