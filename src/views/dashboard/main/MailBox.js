import React from 'react';
import {observer} from 'mobx-react';
import {BoxHeader} from "../../../components/BoxHeader";
import FlatButton from 'material-ui/FlatButton';
import mailsStore from "../../stores/mailList";
import AddMail from "../../items/AddMail";
import {BizDialog} from "../../../components/Dialog";
import {DrawerStore} from "../../../components/Drawer";

class MailBox extends React.PureComponent {
  store = mailsStore;
  state = {
    mailFilterValue: 0,
  };
  // selections = ['全部未读', '未读公告', '未读投诉', '已读'];
  selections = ['全部未读', '已读'];
  componentWillMount() {
    this.store.load();
  }
  selectionCount = (index) => {
    const {mails, unReadListDS, isReadListDS} = this.store;
    switch (index) {
      default: return mails.length;
      case 0: return unReadListDS.length;
      // case 1: return mails.filter(m => (!m.read && m.type === MailType.ANNOUNCEMENT)).length;
      // case 2: return mails.filter(m => (!m.read && m.type === MailType.APPEAL)).length;
      case 1: return isReadListDS.length;
    }
  };
  get mailDS() {
    const {mailFilterValue} = this.state;
    const {mails, unReadListDS, isReadListDS} = this.store;
    switch (mailFilterValue) {
      default: return mails;
      case 0: return unReadListDS;
      // case 1: return mails.filter(m => (!m.read && m.type === MailType.ANNOUNCEMENT));
      // case 2: return mails.filter(m => (!m.read && m.type === MailType.APPEAL));
      case 1: return isReadListDS;
    }
  };

  onSelect = e => this.setState({mailFilterValue: parseInt(e.target.value, 10)});
  render() {
    return (
      <div className="board-layout message-box">
        <BoxHeader title="收件箱" selections={this.selections} onSelect={this.onSelect} selectionCount={this.selectionCount}/>
        <div className="message-list">
          {this.mailDS.map((mail, index) => <MessageItem message={mail} key={index}/>)}
          {!this.mailDS.length && <p className="none-data">暂无邮件</p>}
          {this.store.hasMore && <FlatButton label="加载更多" style={{color: '#999'}}
                                             onTouchTap={this.store.load}/>}
          <div style={{width: '100%', textAlign: 'right'}}>
            <FlatButton label="发送邮件" primary onTouchTap={() => BizDialog.onOpen('发送邮件', <AddMail />)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default observer(MailBox);

const PriorityType = {
  'NOT_IMPORTENT': 'NOT_IMPORTENT',
  'IMPORTENT': 'IMPORTENT',
  'VERY_IMPORTENT': 'VERY_IMPORTENT',
  'HURRY': 'HURRY',
  'VERY_HURRY': 'VERY_HURRY',
};

@observer
class MessageItem extends React.PureComponent {
  getTagStyle = tag => {
    const {IMPORTENT, VERY_IMPORTENT, HURRY, VERY_HURRY} = PriorityType;
    let color = null;
    let backgroundColor = null;
    switch (tag) {
      default: backgroundColor = '#fffd38'; color = '#4A4A4A'; break;
      // case NOT_IMPORTENT: backgroundColor = '#fffd38'; color = '#4A4A4A'; break;
      case IMPORTENT:
      case HURRY: backgroundColor = '#fffd38'; color = '#4A4A4A'; break;
      case VERY_IMPORTENT:
      case VERY_HURRY: backgroundColor = '#fc0d1b'; color = '#FFF'; break;
    }
    return {backgroundColor, color};
  };
  getTagTxt = tag => {
    const {NOT_IMPORTENT, IMPORTENT, VERY_IMPORTENT, HURRY, VERY_HURRY} = PriorityType;
    switch (tag) {
      default: return '';
      case NOT_IMPORTENT: return '不重要';
      case IMPORTENT: return '重要';
      case VERY_IMPORTENT: return '非常重要';
      case HURRY: return '紧急';
      case VERY_HURRY: return '非常紧急';
    }
  };
  render() {
    const {message} = this.props;
    return (
      <div className="message-item" style={{marginBottom: 5}}>
        <input type="checkbox" onChange={e => mailsStore.setRead(message)}
               checked={!!message.read_flag}
               disabled={!!message.read_flag}/>
        <div className="message-detail" onClick={() => DrawerStore.onOpen(message)}
             style={{display: 'block', marginLeft: 5}}>
          <p className="message-title">{message.mail_title}</p>
          <p className="message-content">{message.mail_content}</p>
          <div className="message-bottom">
            <div>
              {message.priority && message.priority.split(',').filter(tag => tag !== 'NOT_IMPORTENT').map((tag, index) => <p
                key={index} className="tag" style={this.getTagStyle(tag)}>{this.getTagTxt(tag)}</p>)}
            </div>
            <p className="source">来自：{message.sender_name} （id: {message.sender}）</p>
          </div>
        </div>
      </div>
    );
  }
}