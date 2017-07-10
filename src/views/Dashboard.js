import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { RouteWithSubRoutes } from "../router/index";
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import AddMerchant from "./items/AddMerchant";
import AddBill from "./items/AddBill";
import DialogForm from "./items/DialogForm";
import ProfileDialog from "./items/ProfileDialog";
import Toast from "../components/Toast";
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

  // 打开创建单据dialog
  addBill = () => {
    BizDialog.onOpen('创建单据', <AddBill />);
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
      {name: "创建单据", action: this.addBill},
      {name: "邀请用户", action: this.inviteUser},
      {name: "加入商户", action: this.handleOpenJoinMerchantDialog},
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
          {/*<LinkButton icon='archive' text='产品' to="/dashboard/product"/>*/}
          {/*<LinkButton icon='trending_up' text='分析' to="/dashboard/analysis"/>*/}
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
