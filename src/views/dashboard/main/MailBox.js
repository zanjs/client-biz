import React from 'react';
import {observer} from 'mobx-react';
import {BoxHeader} from "../../../components/BoxHeader";
import {MessageItem} from "../../../components/ListItem";
import FlatButton from 'material-ui/FlatButton';
import mailsStore from "../../stores/mailList";
import Toast from "../../../components/Toast";

class MailBox extends React.PureComponent {
  store = mailsStore;
  state = {
    mailFilterValue: 0,
  };
  // selections = ['全部未读', '未读公告', '未读投诉', '已读'];
  selections = ['全部未读', '已读'];
  componentWillMount() {
    this.store.load(this.onToast);
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
  onToast = txt => this.refs.toast && this.refs.toast.show(txt);

  onSelect = e => this.setState({mailFilterValue: parseInt(e.target.value, 10)});
  render() {
    return (
      <div className="board-layout message-box">
        <BoxHeader title="收件箱" selections={this.selections} onSelect={this.onSelect} selectionCount={this.selectionCount}/>
        <div className="message-list">
          {this.mailDS.map((mail, index) => <MessageItem message={mail} key={index} openDetail={this.props.openDetailDrawer}/>)}
          {!this.mailDS.length && <p className="none-data">暂无邮件</p>}
          {this.store.hasMore && <FlatButton label="加载更多" style={{color: '#999'}}
                                             onTouchTap={() => this.store.load(this.onToast)}/>}
        </div>
        <Toast ref="toast"/>
      </div>
    );
  }
}

export default observer(MailBox);
