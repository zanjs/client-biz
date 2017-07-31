import React from 'react';
import {observer, inject} from 'mobx-react';
import {BoxHeader} from "../../../components/BoxHeader";
import {MessageItem} from "../../../components/ListItem";
import FlatButton from 'material-ui/FlatButton';
import sellActivitiesStore from "../../stores/sell-activities";

@inject('user')
@observer
export default class SaleBox extends React.Component {
  store = sellActivitiesStore;
  state = {
    messagesFilterValue: 0,
  };
  // selections = ['全部未读', '我负责的', '我参与的', '待处理', '已读'];
  selections = ['全部未读', '我负责的', '我参与的', '已读'];
  componentWillMount() {
    this.store.load();
  }
  selectionCount = (index) => {
    const {messageList, unReadListDS, isReadListDS, inChargeListDS, participantListDS} = this.store;
    switch (index) {
      default: return messageList.length;
      case 0: return unReadListDS.length;
      case 1: return inChargeListDS.length;
      case 2: return participantListDS.length;
      // case 3: return messages.filter(m => (!m.read && m.type === SaleMessagType.PENDING)).length;
      case 3: return isReadListDS.length;
    }
  };
  get messagesDS() {
    const {messagesFilterValue} = this.state;
    const {messageList, unReadListDS, isReadListDS, inChargeListDS, participantListDS} = this.store;
    switch (messagesFilterValue) {
      default: return messageList;
      case 0: return unReadListDS;
      case 1: return inChargeListDS;
      case 2: return participantListDS;
      // case 3: return messages.filter(m => (!m.read && m.type === SaleMessagType.PENDING));
      case 3: return isReadListDS;
    }
  };

  onSelect = e => this.setState({messagesFilterValue: parseInt(e.target.value, 10)});
  render() {
    return (
      <div className="board-layout message-box">
        <BoxHeader title="销售动态" selections={this.selections} onSelect={this.onSelect} selectionCount={this.selectionCount}/>
        <div className="message-list">
          {this.messagesDS.map((messages, index) => <MessageItem message={messages} key={index}/>)}
          {!this.messagesDS.length && <p className="none-data">
            {this.props.user.user.current.is_admin ? '管理员无法获得业务动态' : '暂无内容'}
          </p>}
          <div style={{width: '100%', textAlign: 'right'}}>
            {this.store.hasMore && <FlatButton label="加载更多" primary onTouchTap={this.store.load}/>}
          </div>
        </div>
      </div>
    );
  }
}
