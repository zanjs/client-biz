import React from 'react';
import {
  Link,
} from 'react-router-dom';
import {connect} from 'react-redux';
import {RouteWithSubRoutes} from "../router/index";
import RaisedButton from 'material-ui/RaisedButton';
import {logout} from '../actions/account';

export default class Dashboard extends React.Component {
  componentWillMount() {
    if (this.props.match.path === '/dashboard') {
      this.props.history.push('/dashboard/main');
    }
  }
  render() {
    const {routes} = this.props;
    return (
      <div className="dashboard">
        <DashboardNav />
        {routes && routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        ))}
      </div>
    );
  }
}

class Nav extends React.PureComponent {
  logout = () => {
    this.props.logout();
    localStorage.removeItem('bizUser');
    window.location.replace('/');
  };
  render() {
    const {currentUser} = this.props;
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
          <button className="btn-link">
            <i className="material-icons" style={{fontSize: 30}}>add_circle_outline</i>
          </button>
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

const LinkButton = ({icon, text, to}) => (
  <Link className="icon-button" to={to}>
    <i className="material-icons">{icon}</i>
    <p>{text}</p>
  </Link>
);

const mapStateToProps = (state) => {
  return {
    currentUser: state.account.currentUser,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout())
  }
};

const DashboardNav = connect(mapStateToProps, mapDispatchToProps)(Nav);