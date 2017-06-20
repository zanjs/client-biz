import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {loginAction} from '../../actions/account';
import {accountService} from "../../services/account";
import Toast from "../../components/Toast";


class LoginContainer extends React.Component {
  state={
    username: this.props.account.account || '',
    password: this.props.account.password || '',
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
    return (nameValidated && passwordValidated);
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

  login = async (e) => {
    e.preventDefault();
    if (this.submiting) return;
    this.submiting = true;
    const {username, password} = this.state;
    const {loginAction} = this.props;
    try {
      const resp = await accountService.login(username, password);
      if (resp.code == 0) {
        const token = resp.data.access_token;
        const userData = await accountService.getProfile(resp.data.access_token);
        const account = {account: username, password};
        loginAction(userData.data, token, account);
        const data = {user: userData.data, token, account};
        localStorage.setItem('bizUser', JSON.stringify(data));
        this.props.history.replace('/dashboard/main');
      } else {
        this.refs.toast.show('登录失败, 请稍后重试');
      }
    } catch (e) {
      console.log(e, 'login');
      this.refs.toast.show('抱歉，发生未知错误，请稍后重试');
    }
    this.submiting = false;
  };

  render() {
    const { username, password, error } = this.state;
    if (this.props.isLoggedIn) {
      return (<Redirect to={'/dashboard/main'}/>);
    }

    return (
      <div className="layout layout-login">
       <div className="title">
         <FontIcon className="material-icons">home</FontIcon>
         <Link to='/' className="title-txt">BizLink</Link>
       </div>
       <div className="card">
         <h4>登录</h4>
         <from onSubmit={this.login} className="form-login">
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
           <div className="actions">
             <Link to="/register" className="link-register">注册新用户</Link>
           </div>
         </from>
       </div>
       <Toast ref="toast"/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    account: state.account.account,
    isLoggedIn: state.account.token,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    loginAction: (user, token) => { dispatch(loginAction(user, token)); }
  }
};

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
export default Login;

