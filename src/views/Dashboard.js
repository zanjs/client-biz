import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import { RouteWithSubRoutes } from "../router/index";
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import { logout, updateUser } from '../actions/account';
import {accountService} from "../services/account";
import merchantSvc from "../services/merchant";
import AddMerchant from "./items/AddMerchant";
import Toast from "../components/Toast";

class DashboardContainer extends React.Component {
  constructor(props) {
    super(props);
    if (!props.token) window.location.replace('/');
  }
  async componentWillMount() {
    if (this.props.match.path === '/dashboard') {
      this.props.history.push('/dashboard/main');
    }
    try {
      const resp = await accountService.getProfile(this.props.token);
      if (resp.code == 0) this.props.updateUser(resp.data);
      else this.reLogin();
    } catch (e) {
      console.log(e, 'update user in dashboard');
      this.reLogin();
    }
  }
  reLogin = () => {
    this.refs.toast.show('登录已过期，请重新登录');
    this.props.logout();
    window.location.replace('/');
  };
  render() {
    const {routes, currentUser, logout} = this.props;
    return (
      <div className="dashboard">
        <DashboardNav currentUser={currentUser} logout={logout}/>
        {routes && routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        ))}
        <Toast ref="toast"/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.account.currentUser,
    token: state.account.token,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    updateUser: user => dispatch(updateUser(user)),
  }
};

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
export default Dashboard;

const DIALOG_STATE = {
  SELECT: 0,
  CREATE_MERCHANT: 1,
  JOIN_MERCHANT: 2,
};

class DashboardNavItem extends React.Component {
  state = {
    openQuickCreateMenu: false,
    openDialog: !this.props.currentUser || !this.props.currentUser.mer_id || this.props.currentUser.mer_id === 0,
    dialogState: DIALOG_STATE.SELECT,
    dialogTitle: '请选择',
    merchantIdForApply: '',
    submitting: false,
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser && (nextProps.currentUser.mer_id !== this.props.currentUser.mer_id)) {
      const openDialog = !this.props.currentUser.mer_id || this.props.currentUser.mer_id === 0;
      this.setState({ openDialog})
    }
  }

  logout = () => {
    this.props.logout();
    window.location.replace('/');
  };
  handleRequestCloseDialog = () => this.setState({ openDialog: false, dialogTitle: '请选择', dialogState: DIALOG_STATE.SELECT });
  handleOpenCreateMerchantDialog = () => this.setState({ openDialog: true, dialogState: DIALOG_STATE.CREATE_MERCHANT, openQuickCreateMenu: false, dialogTitle: '创建商户' });
  handleOpenJoinMerchantDialog = () => this.setState({ openDialog: true, dialogState: DIALOG_STATE.JOIN_MERCHANT, openQuickCreateMenu: false, dialogTitle: '加入商户' });
  handleQuickCreate = event => {
    event.preventDefault();
    this.setState({ openQuickCreateMenu: true, quickCreateAnchorEl: event.currentTarget });
  };
  handleQuickCreateRequestClose = () => this.setState({ openQuickCreateMenu: false });
  inviteUser = () => alert('邀请用户');
  submitJoinMerchant = async (e) => {
    e.preventDefault();
    const {submitting, merchantIdForApply} = this.state;
    if (submitting) return;
    this.setState({ submitting: true });
    try {
      const resp = await merchantSvc.applyMerchant(`${merchantIdForApply}`);
      if (resp.code == 0) {
        this.refs.toast.show('已提交申请，请等待或联系商户通过');
        this.handleRequestCloseDialog();
      } else {
        this.refs.toast.show('提交失败，请检查商户ID后重试');
      }
    } catch (e) {
      console.log(e, 'apply merchant');
      this.refs.toast.show('抱歉，发生未知错误，请稍后重试');
    }
    this.setState({ submitting: false });
  };

  DialogContent = () => {
    const {dialogState, merchantIdForApply, submitting} = this.state;
    switch (dialogState) {
      default: return (
        <div className="dialogActions">
          <RaisedButton label="加入商户" primary={true} style={{margin: 12, flex: 1}} onTouchTap={this.handleOpenJoinMerchantDialog}/>
          <RaisedButton label="创建商户" secondary={true} style={{margin: 12, flex: 1}} onTouchTap={this.handleOpenCreateMerchantDialog}/>
        </div>
      );
      case DIALOG_STATE.CREATE_MERCHANT:
        return <AddMerchant close={this.handleRequestCloseDialog}/>;
      case DIALOG_STATE.JOIN_MERCHANT:
        return (
          <form onSubmit={this.submitJoinMerchant} style={{paddingTop: 10}}>
            <TextField
              hintText="请输入申请加入的商户ID"
              value={merchantIdForApply}
              type="text"
              onChange={e => this.setState({ merchantIdForApply: e.target.value })}/>
            <RaisedButton label={submitting ? null : "申请"} primary={true} style={{marginLeft: 20}}
                          onTouchTap={this.submitJoinMerchant}
                          disabled={!merchantIdForApply}
                          icon={submitting ? <CircularProgress size={28}/> : null}/>
          </form>
        )
    }
  };

  render() {
    const {openQuickCreateMenu, quickCreateAnchorEl, dialogTitle} = this.state;
    const {currentUser} = this.props;
    const quickCreateAction = currentUser && currentUser.mer_id ? [
      {name: "邀请用户", action: this.inviteUser},
    ] : [
      {name: "创建商户", action: this.handleOpenCreateMerchantDialog},
    ];
    return (
      <nav className="board-nav">
        <div>
          <p className="logo">Biz</p>
          <LinkButton icon='dashboard' text='我的' to="/dashboard/main"/>
          <LinkButton icon='search' text='查询' to="/dashboard/search"/>
          <LinkButton icon='person' text='伙伴' to="/dashboard/partner"/>
          <LinkButton icon='archive' text='产品' to="/dashboard/product"/>
          <LinkButton icon='trending_up' text='分析' to="/dashboard/analysis"/>
        </div>
        <div>
          <button className="btn-link" onClick={this.handleQuickCreate}>
            <i className="material-icons" style={{fontSize: 30}}>add_circle_outline</i>
          </button>
          <Popover
            open={openQuickCreateMenu}
            anchorEl={quickCreateAnchorEl}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleQuickCreateRequestClose}
            animation={PopoverAnimationVertical}>
            <Menu>
              {
                quickCreateAction.map((item, index) => <MenuItem primaryText={item.name}
                                                               onClick={item.action}
                                                               key={index}/>)
              }
            </Menu>
          </Popover>
          <div className="btn-setting">
            <div className="btn-link">
              <span className="display-name">{(currentUser && currentUser.name.slice(0, 2))}</span>
            </div>
            <div className="popover-menu">
              <RaisedButton label="退出" style={{width: 150}} onClick={this.logout}/>
            </div>
          </div>
        </div>
        <Dialog
          title={dialogTitle}
          titleStyle={{fontSize: 18}}
          modal={false}
          autoScrollBodyContent
          open={this.state.openDialog}
          onRequestClose={this.handleRequestCloseDialog}>
          <this.DialogContent />
        </Dialog>
        <Toast ref="toast"/>
      </nav>
    );
  }
}
const DashboardNav = withRouter(DashboardNavItem);

const LinkButton = ({icon, text, to}) => (
  <Link className="icon-button" to={to}>
    <i className="material-icons">{icon}</i>
    <p>{text}</p>
  </Link>
);
