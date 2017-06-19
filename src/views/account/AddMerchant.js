import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { loginAction } from '../../actions/account';
import { accountService } from "../../services/account";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toast from "../../components/Toast";

class RegisterContainer extends React.Component {
  constructor(props) {
    super(props);
    if (!(this.props.location.state && this.props.location.state.username)) window.location.replace('/');
  }
  state = {
    mer_name: '',
    type: 0,
    indust_id: '',
    org_code: '',
    representative: '',
    establish_date: '',
    om_bank_name: '',
    bank_account: '',
    swift_code: '',
    la_bank_account: '',
    tel_list: '',
    address: '',
    error: {
      mer_name: '',
      type: 0,
      indust_id: '',
      org_code: '',
      representative: '',
      establish_date: '',
      om_bank_name: '',
      bank_account: '',
      swift_code: '',
      la_bank_account: '',
      tel_list: '',
      address: '',
    }
  };
  get validated() {
    const { mer_name, type, indust_id, org_code, representative, establish_date } = this.state;
    let allLengthChecked = false;
    switch (type) {
      case 0:
        allLengthChecked = this.hasLength(mer_name, indust_id, org_code, representative, establish_date);
        break;
      case 1:
        allLengthChecked = this.hasLength(mer_name, indust_id);
        break;
      default: break;
    }
    return allLengthChecked;
  }

  hasLength = (string, ...args) => {
    if (args) {
      args.forEach(string => {
        if (!(string && string.trim().length)) return false;
      });
    }
    return !!(string && string.trim().length);
  };

  checkName = () => {
    let err = {mer_name: ''};
    if (!this.state.mer_name.trim().length) err = {mer_name: '商户名不能为空'};
    this.setError(err);
  };
  checkIndustId = () => {
    let err = {indust_id: ''};
    if (!this.state.indust_id.trim().length) err = {indust_id: '行业类型ID不能为空'};
    this.setError(err);
  };
  checkOrgCode = () => {
    let err = {org_code: ''};
    if (this.state.type == 0 && !this.state.org_code.trim().length) err = {org_code: '组织机构代码为空'};
    this.setError(err);
  };
  checkRepresentative = () => {
    let err = {representative: ''};
    if (this.state.type == 0 && !this.state.representative.trim().length) err = {representative: '法人代表不能为空'};
    this.setError(err);
  };
  checkEstablishDate = () => {
    let err = {establish_date: ''};
    if (this.state.type == 0 && !this.state.establish_date.trim().length) err = {establish_date: '注册时间不能为空'};
    this.setError(err);
  };
  setError = (err) => {
    const error = {...this.state.error, ...err};
    this.setState({ error });
  };

  submit = async () => {
    const { username, password } = this.props.location.state;
    const { login } = this.props;
    const {mer_name, type, indust_id, org_code, representative, establish_date, om_bank_name, bank_account,
      swift_code, la_bank_account, tel_list, address} = this.state;
    try {
      const resp = await accountService.createMerchant(mer_name, type, indust_id, org_code, representative,
        establish_date, om_bank_name, bank_account, swift_code, la_bank_account, tel_list, address);
      if (resp.code == 0) {
        const loginResp = await accountService.login(username, password);
        const token = loginResp.data.access_token;
        const userData = await accountService.getProfile(loginResp.data.access_token);
        const account = {username, password};
        login(userData.data, token, account);
        const data = {user: userData.data, token, account};
        localStorage.setItem('bizUser', JSON.stringify(data));
        this.props.history.replace('/dashboard/main');
      }
    } catch (e) {
      console.log(e, 'create merchant');
      this.refs.toast.show('抱歉，发生未知错误，请稍后重试', 1000);
    }
  };

  render() {
    const { mer_name, type, indust_id, org_code, representative, establish_date, om_bank_name, bank_account,
      swift_code, la_bank_account, tel_list, address, error } = this.state;
    return (
        <div className="add-merchant">
          <div className="title">
            <FontIcon className="material-icons">home</FontIcon>
            <p className="title-txt" disabled>BizLink</p>
          </div>
          <div className="card">
            <div className="card-title">
              <h4>创建商户</h4>
              <Link to="/" className="link-back">返回</Link>
            </div>
            <form className="form-register" onSubmit={this.submit}>
              <TextField
                hintText="商户名称"
                value={mer_name}
                type="text"
                onBlur={this.checkName}
                onChange={e => this.setState({ mer_name: e.target.value })}
                errorText={error.mer_name}
                className="login-input" />
              <SelectField
                style={{ position: 'relative', top: '17px' }}
                floatingLabelText="选择类型"
                value={type}
                onChange={(event, index, type) => this.setState({ type })}
              >
                <MenuItem value={1} primaryText="个人" />
                <MenuItem value={0} primaryText="企业" />
              </SelectField>
              <TextField
                hintText="行业类型"
                value={indust_id}
                type="text"
                onBlur={this.checkIndustId}
                onChange={e => this.setState({ indust_id: e.target.value })}
                errorText={error.indust_id}
                className="login-input" />
              <TextField
                hintText={type == 0 ? "组织机构代码" : '组织机构代码 (选填)'}
                value={org_code}
                type="text"
                onBlur={this.checkOrgCode}
                onChange={e => this.setState({ org_code: e.target.value })}
                errorText={error.org_code}
                className="login-input" />
              <TextField
                hintText={type == 0 ? "法人代表" : '法人代表 (选填)'}
                value={representative}
                type="text"
                onBlur={this.checkRepresentative}
                onChange={e => this.setState({ representative: e.target.value })}
                errorText={error.representative}
                className="login-input" />
              <TextField
                hintText={type == 0 ? "公司注册时间" : '公司注册时间 (选填)'}
                value={establish_date}
                type="text"
                onBlur={this.checkEstablishDate}
                onChange={e => this.setState({ establish_date: e.target.value })}
                errorText={error.establish_date}
                className="login-input" />
              <TextField
                hintText="开户银行 (选填)"
                value={om_bank_name}
                type="text"
                onChange={e => this.setState({ om_bank_name: e.target.value })}
                errorText={error.username}
                className="login-input" />
              <TextField
                hintText="银行账号 (选填)"
                value={bank_account}
                type="text"
                onChange={e => this.setState({ bank_account: e.target.value })}
                errorText={error.bank_account}
                className="login-input" />
              <TextField
                hintText="跨境可能需要 (选填)"
                value={swift_code}
                type="text"
                onChange={e => this.setState({ swift_code: e.target.value })}
                errorText={error.swift_code}
                className="login-input" />
              <TextField
                hintText="大额行号 (选填)"
                value={la_bank_account}
                type="text"
                onChange={e => this.setState({ la_bank_account: e.target.value })}
                errorText={error.la_bank_account}
                className="login-input" />
              <TextField
                hintText="电话号码 (多个以逗号分隔, 选填)"
                value={tel_list}
                type="text"
                onChange={e => this.setState({ tel_list: e.target.value })}
                errorText={error.username}
                className="login-input" />
              <TextField
                hintText="公司地址 (选填)"
                value={address}
                type="text"
                onChange={e => this.setState({ address: e.target.value })}
                errorText={error.address}
                className="login-input" />

              <div className="actions-container">
                <RaisedButton style={{ marginTop: '20px' }} label="确认" className="btn-login"
                              primary={this.validated} disabled={!this.validated} onClick={this.submit} />
              </div>

            </form>
            <Toast ref="toast"/>
          </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user, token) => { dispatch(loginAction(user, token)); }
  }
};

const Register = connect(null, mapDispatchToProps)(RegisterContainer);
export default Register;

