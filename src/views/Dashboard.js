import React from 'react';
import {
  Link,
  Redirect,
} from 'react-router-dom';
import {connect} from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import {RouteWithSubRoutes} from "../router/index";

class DashboardContainer extends React.Component {
  componentWillMount() {
    if (this.props.match.path === '/dashboard') {
      this.props.history.push('/dashboard/main');
    }
  }
  render() {
    const {routes, currentUser} = this.props;
    console.log(currentUser);
    return (
      <div className="dashboard">
        <DashboardNav />
        {routes && routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        ))}
      </div>
    );
  }
};

const DashboardNav = ({user}) => (
  <nav className="board-nav">
    <div>
      <LinkButton icon='dashboard' text='我的' to="/dashboard/main"/>
      <LinkButton icon='search' text='搜索' to="/dashboard/search"/>
      <LinkButton icon='person' text='伙伴' to="/dashboard/partner"/>
      <LinkButton icon='archive' text='产品' to="/dashboard/product"/>
      <LinkButton icon='trending_up' text='分析' to="/dashboard/analysis"/>
    </div>
    <div>
      <a className="btn-link">
        <FontIcon className="material-icons" color="#a1fffb" style={{fontSize: 50, top: 5}}>add_circle_outline</FontIcon>
      </a>
      <a className="btn-link">
        <span className="display-name">{(user && user.display_name) || '我'}</span>
      </a>
    </div>
  </nav>
);

const LinkButton = ({icon, text, to}) => (
  <Link className="icon-button" to={to}>
    <FontIcon className="material-icons" color="#a1fffb">{icon}</FontIcon>
    <p>{text}</p>
  </Link>
);

const mapStateToProps = (state) => {
  return {
    currentUser: state.account.currentUser,
  }
};

const Dashboard = connect(mapStateToProps)(DashboardContainer);
export default  Dashboard;