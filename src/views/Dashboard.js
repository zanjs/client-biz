import React from 'react';
import {
  Link,
  Redirect,
} from 'react-router-dom';
import FontIcon from 'material-ui/FontIcon';
import {RouteWithSubRoutes} from "../router/index";

export default class Dashboard extends React.Component {
  componentWillMount() {
    console.log(this.props);
    if (this.props.match.path === '/dashboard') {

    }
  }
  render() {
    // console.log(this.props);
    const {routes, match} = this.props;
    // if (match.path === '/dashboard') {
    //   return <Redirect to/>
    // }
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
