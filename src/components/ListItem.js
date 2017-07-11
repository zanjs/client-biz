import React from 'react';
import {TagType, DetailContentType} from "../services/data-type";

export class MessageItem extends React.PureComponent {
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
      <div className="message-item" style={{marginBottom: 5}}>
        <input type="checkbox"/>
        <div className="message-detail" onClick={() => this.props.openDetail(DetailContentType.DETAIL, message)}
             style={{display: 'block', marginLeft: 5}}>
          <p className="message-title">{message.content}</p>
          <p className="message-content">{message.create_time}</p>
          <div className="message-bottom">
            <div>
              {message.tags && message.tags.map((tag, index) => <p
                key={index} className="tag" style={this.getTagStyle(tag)}>{tag}</p>)}
            </div>
            <p className="source">来自：{message.mer_name}</p>
          </div>
        </div>
      </div>
    );
  }
}
