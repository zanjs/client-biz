import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { RouteWithSubRoutes } from "../router/index";
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import merchantSvc from "../services/merchant";
import AddMerchant from "./items/AddMerchant";
import ProfileDialog from "./items/ProfileDialog";
import Toast, {ToastStore} from "../components/Toast";
import {DialogComponent, BizDialog} from "../components/Dialog";

@inject('user')
@observer
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    if (!props.user.isLoggedIn) window.location.replace('/');
  }
  async componentWillMount() {
    if (this.props.match.path === '/dashboard') {
      this.props.history.push('/dashboard/main');
    }
  }
  reLogin = () => {
    this.props.user.logout();
    window.location.replace('/');
  };
  render() {
    const {routes, user} = this.props;
    console.log(user.user.current);
    return (
      <div className="dashboard">
        <DashboardNav currentUser={user.user.current} logout={this.reLogin}/>
        {routes && routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        ))}
        <Toast />
        <DialogComponent />
      </div>
    );
  }
}

@withRouter
class DashboardNav extends React.Component {
  state = { openQuickCreateMenu: false };

  componentWillMount() {
    const noneMerchant = !this.props.currentUser.mer_id;
    if (noneMerchant) {
      const content = (<div className="dialogActions">
        <RaisedButton label="加入商户" primary={true} style={{margin: 12, flex: 1}} onTouchTap={this.handleOpenJoinMerchantDialog}/>
        <RaisedButton label="创建商户" secondary={true} style={{margin: 12, flex: 1}} onTouchTap={this.handleOpenCreateMerchantDialog}/>
      </div>);
      BizDialog.onOpen('请选择', content);
    }
  }

  // 打开创建商户dialog
  handleOpenCreateMerchantDialog = () => {
    BizDialog.onOpen('创建商户', <AddMerchant close={BizDialog.onClose}/>);
    this.setState({openQuickCreateMenu: false});
  };

  // 打开加入商户dialog
  handleOpenJoinMerchantDialog = () => {
    BizDialog.onOpen('加入商户', <DialogForm type='apply' hintTxt="请输入商户的ID" submitTxt="申请"/>);
    this.setState({ openQuickCreateMenu: false });
  };

  // 打开邀请用户dialog
  inviteUser = () => {
    BizDialog.onOpen('邀请用户', <DialogForm type='invite' hintTxt="请输入用户的账号" submitTxt="邀请"/>);
    this.setState({ openQuickCreateMenu: false });
  };

  // 打开个人资料dialog
  handleOpenProfileDialog = () => BizDialog.onOpen('个人资料', <ProfileDialog user={this.props.currentUser}/>);

  handleQuickCreate = event => {
    event.preventDefault();
    this.setState({ openQuickCreateMenu: true, quickCreateAnchorEl: event.currentTarget });
  };

  handleQuickCreateRequestClose = () => this.setState({ openQuickCreateMenu: false });

  render() {
    const {openQuickCreateMenu, quickCreateAnchorEl} = this.state;
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
                quickCreateAction.map((item, index) => <MenuItem primaryText={item.name} onClick={item.action}
                                                               key={index}/>)
              }
            </Menu>
          </Popover>
          <div className="btn-setting">
            <div className="btn-link">
              <span className="display-name">{(currentUser && currentUser.name.slice(0, 2))}</span>
            </div>
            <div className="popover-menu">
              <RaisedButton label="查看个人资料" style={{width: 150}} onTouchTap={this.handleOpenProfileDialog}/>
              <RaisedButton label="退出" style={{width: 150}} onTouchTap={this.props.logout}/>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

const LinkButton = ({icon, text, to}) => (
  <Link className="icon-button" to={to}>
    <i className="material-icons">{icon}</i>
    <p>{text}</p>
  </Link>
);

class DialogForm extends React.PureComponent {
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