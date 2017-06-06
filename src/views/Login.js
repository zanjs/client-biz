import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {loginAction} from '../actions/account';
import {loginService} from "../services/account";


class LoginContainer extends React.Component {
  state={
    username: '',
    password: '',
    error: {
      username: '',
      password: '',
    }
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

  login = async () => {
    const {username, password} = this.state;
    const {loginAction} = this.props;
    try {
      const resp = await loginService.login(username, password);
      if (resp.success) {
        loginAction(resp.user, resp.token);
        this.props.history.replace('/dashboard');
      }
    } catch (e) {}
  };

  render() {
    const { username, password, error } = this.state;
    return (
      <div className="layout layout-login">
       <div className="title">
         <FontIcon className="material-icons">home</FontIcon>
         <Link to='/' className="title-txt">BizLink</Link>
       </div>
       <div className="card">
         <h4>登录</h4>
         <div className="form-login">
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
           <RaisedButton label="确认" className="btn-login" primary={this.validated} disabled={!this.validated} onClick={this.login}/>
         </div>
       </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginAction: (user, token) => { dispatch(loginAction(user, token)); }
  }
};

const Login = connect(null, mapDispatchToProps)(LoginContainer);
export default Login;

