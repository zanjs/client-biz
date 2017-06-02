import React from 'react';

export default class MessageDetail extends React.Component {
  componentWillMount() {
    console.log(this.props);
    if (this.props.match.path === '/dashboard') {

    }
  }
  render() {
    return (
      <div>
        message
      </div>
    );
  }
};

