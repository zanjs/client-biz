import React from 'react';

export class Comments extends React.PureComponent {
  state={
    tabValue: 0,
  };
  componentWillMount() {
    console.log(this.props.id);
  }
  render() {
    const {tabValue} = this.state;
    return (
      <div className="comment-area">
        <div>评论区</div>
      </div>
    );
  }
}