import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {DetailContentType} from "../services/data-type";
import {formatTime} from "../utils/time";

export class DetailHeader extends React.PureComponent {

  static styles = {
    smallIcon: {
      width: 24,
      height: 24,
      fontSize: 22,
    },
    small: {
      width: 30,
      height: 30,
      padding: 4,
    },
  };

  ActionButton = ({icon, action}) => (
    <IconButton
      iconClassName="material-icons"
      onClick={action}
      iconStyle={DetailHeader.styles.smallIcon}
      style={DetailHeader.styles.small}>
      {icon}
    </IconButton>
  );

  onReply = () => alert('reply');
  onReplyAll = () => alert('replyAll');
  onForward = () => alert('forward');
  onAttach = () => alert('attach');
  onChangeChargePerson = () => alert('onChangeChargePerson');
  onAddFollowers = () => {
    this.props.detail.follower.push({display_name: '肖益龙', position: '总经理'});
    this.forceUpdate();
  };

  TitleItem = () => {
    const {detail} = this.props;
    if (detail.type === DetailContentType.ANNOUNCE || detail.type === DetailContentType.APPEAL) {
      return (
        <div className="detail-title message">
          <div>
            <p className="detail-label">{detail.type === DetailContentType.ANNOUNCE ? '公告' : '投诉'}</p>
            <this.ActionButton icon='reply' action={this.onReply}/>
            <this.ActionButton icon='reply_all' action={this.onReplyAll}/>
            <this.ActionButton icon='forward' action={this.onForward}/>
            <this.ActionButton icon='attachment' action={this.onAttach}/>
          </div>
          <div>
            <this.ActionButton icon='close' action={this.props.onClose}/>
          </div>
        </div>
      );
    }
    return null;
  };

  MessageInfo = () => {
    const {detail} = this.props;
    return (
      <div className="message-info-item">
        <div className="title-container">
          <p className="detail-title-txt">{detail.title}</p>
          <p className="detail-time-txt">{formatTime(detail.timestamp)}</p>
        </div>
        <div className="sender-info-item">
          <p>来自客户：</p>
          <p className="company-txt">{detail.sender && detail.sender.company}</p>
          <p>发件人: {detail.sender && detail.sender.display_name} / {detail.sender && detail.sender.position}</p>
        </div>
        <div className="message-relatives">
          <p>负责人：</p>
          <div>
            <p>{detail.in_charge && detail.in_charge.display_name} / {detail.in_charge && detail.in_charge.position}</p>
            <button onClick={this.onChangeChargePerson}>
              <FontIcon className="material-icons" color="#333" style={{fontSize: 14}}>autorenew</FontIcon>
            </button>
          </div>
        </div>
        <div className="message-relatives">
          <p>负责人：</p>
          <div>
            <p>
              {detail.follower && detail.follower.map((f, index) => (
                <span key={index}>{f.display_name} / {f.position}{index === (detail.follower.length - 1) ? null : '；'}</span>
              ))}
            </p>
            <button onClick={this.onAddFollowers}>
              <FontIcon className="material-icons" color="#333" style={{fontSize: 16}}>add_circle_outline</FontIcon>
            </button>
          </div>
        </div>
        <div className="line"/>
        <p className="message-content">{detail.content}</p>
      </div>
    );
  };
  OrderInfo = () => {};

  render() {
    const {detail} = this.props;
    return (
      <div className="detail-header">
        <this.TitleItem />
        <this.MessageInfo />
      </div>
    );
  }
}