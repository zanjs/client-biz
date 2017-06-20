import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import { RouteWithSubRoutes } from "../router/index";
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { logout, updateUser } from '../actions/account';
import {accountService} from "../services/account";

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
    } catch (e) {
      console.log(e, 'update user in dashboard');
      this.props.logout();
      window.location.replace('/');
    }
  }
  render() {
    const {routes, currentUser, logout} = this.props;
    return (
      <div className="dashboard">
        <DashboardNav currentUser={currentUser} logout={logout}/>
        {routes && routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        ))}
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

class DashboardNavItem extends React.Component {
  state = {
    openQuickCreateMenu: false,
  };
  logout = () => {
    this.props.logout();
    window.location.replace('/');
  };
  handleQuickCreate = event => {
    event.preventDefault();
    this.setState({ openQuickCreateMenu: true, quickCreateAnchorEl: event.currentTarget });
  };
  handleQuickCreateRequestClose = () => this.setState({ openQuickCreateMenu: false });
  createMerchant = () => this.props.history.push('/add_merchant');
  inviteUser = () => alert('邀请用户');

  render() {
    const {currentUser} = this.props;
    const quickCreateAction = currentUser && currentUser.mer_id ? [
      {name: "创建商户", action: this.createMerchant},
      {name: "邀请用户", action: this.inviteUser},
    ] : [
      {name: "创建商户", action: this.createMerchant},
    ];
    return (
      <nav className="board-nav">
        <div>
          <p className="logo">Biz</p>
          <LinkButton icon='dashboard' text='我的' to="/dashboard/main"/>
          <LinkButton icon='search' text='搜索' to="/dashboard/search"/>
          <LinkButton icon='person' text='伙伴' to="/dashboard/partner"/>
          <LinkButton icon='archive' text='产品' to="/dashboard/product"/>
          <LinkButton icon='trending_up' text='分析' to="/dashboard/analysis"/>
        </div>
        <div>
          <button className="btn-link" onClick={this.handleQuickCreate}>
            <i className="material-icons" style={{fontSize: 30}}>add_circle_outline</i>
          </button>
          <Popover
            open={this.state.openQuickCreateMenu}
            anchorEl={this.state.quickCreateAnchorEl}
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
              <span className="display-name">{(currentUser && currentUser.display_name) || '我'}</span>
            </div>
            <div className="popover-menu">
              <RaisedButton label="退出" style={{width: 150}} onClick={this.logout}/>
            </div>
          </div>
        </div>
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
