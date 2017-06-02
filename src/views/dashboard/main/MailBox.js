import React from 'react';
import {BoxHeader} from "../../../components/BoxHeader";
import {getMails} from "../../../services/message";
import {MessageItem} from "../../../components/ListItem";
import {MailType} from "../../../services/data-type";

export class MailBox extends React.PureComponent {
  state = {
    mailFilterValue: 0,
    mails: [],
  };
  selections = ['全部未读', '未读公告', '未读投诉', '已读'];
  async componentWillMount() {
    try {
      const mails = await getMails();
      this.setState({ mails });
    } catch (e) {}
  }
  selectionCount = (index) => {
    const {mails} = this.state;
    switch (index) {
      default: return mails.length;
      case 0: return mails.filter(m => !m.read).length;
      case 1: return mails.filter(m => (!m.read && m.type === MailType.ANNOUNCEMENT)).length;
      case 2: return mails.filter(m => (!m.read && m.type === MailType.APPEAL)).length;
      case 3: return mails.filter(m => m.read).length;
    }
  };
  get mailDS() {
    const {mailFilterValue, mails} = this.state;
    switch (mailFilterValue) {
      default: return mails;
      case 0: return mails.filter(m => !m.read);
      case 1: return mails.filter(m => (!m.read && m.type === MailType.ANNOUNCEMENT));
      case 2: return mails.filter(m => (!m.read && m.type === MailType.APPEAL));
      case 3: return mails.filter(m => m.read);
    }
  };

  onSelect = e => this.setState({mailFilterValue: parseInt(e.target.value, 10)});
  render() {
    return (
      <div className="board-layout mail-box">
        <BoxHeader title="收件箱" selections={this.selections} onSelect={this.onSelect} selectionCount={this.selectionCount}/>
        <div className="message-list">
          {this.mailDS.map((mail, index) => <MessageItem message={mail} key={index}/>)}
          {!this.mailDS.length && <p>暂无消息</p>}
        </div>
      </div>
    );
  }
}
