import React from 'react';
import { Link } from 'react-router-dom';
import {TagType} from "../services/data-type";

export class MessageItem extends React.PureComponent {
  state={};
  getTagStyle = (tag) => {
    let color = null;
    let backgroundColor = null;
    switch (tag) {
      default: backgroundColor = '#fffd38'; color = '#4A4A4A'; break;
      case TagType.IMPORTANT: backgroundColor = '#fffd38'; color = '#4A4A4A'; break;
      case TagType.URGENT: backgroundColor = '#fc0d1b'; color = '#FFF'; break;
    }
    return {backgroundColor, color};
  };
  render() {
    const {message} = this.props;
    return (
      <Link to={`/message/${message.id}`}>
        <div className="message-item">
          <input type="checkbox"/>
          <div className="message-detail">
            <p className="message-title">{message.title}</p>
            <p className="message-content">{message.content}</p>
            <div className="message-bottom">
              <div>
                {message.tags && message.tags.map((tag, index) => <p
                  key={index} className="tag" style={this.getTagStyle(tag)}>{tag}</p>)}
              </div>
              <p className="source">来自：{message.from}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }
}