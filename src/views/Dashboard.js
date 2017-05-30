import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
);

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
);

export default class Dashboard extends React.Component {
  render() {
    console.log(this.props);
    return (
      <div>
        <ul>
          <li><Link to="/dashboard/main">Home</Link></li>
          <li><Link to="/dashboard/about">About</Link></li>
          <li><Link to="/dashboard/topics">Topics</Link></li>
        </ul>

        <hr color="#EBEBEB"/>

        <Route exact path="/dashboard/main" component={Home}/>
        <Route path="/dashboard/about" component={About}/>
        <Route path="/dashboard/topics" component={Topics}/>
      </div>
    );
  }
};
