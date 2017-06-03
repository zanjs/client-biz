import React from 'react';
import {BoxHeader} from "../../../components/BoxHeader";
import {getProcurementMessag} from "../../../services/message";
import {MessageItem} from "../../../components/ListItem";
import {ProcurementMessagType} from "../../../services/data-type";

export class ProcurementBox extends React.PureComponent {
  state = {
    messagesFilterValue: 0,
    messages: [],
  };
  selections = ['全部未读', '我负责的', '我参与的', '@我的', '待处理', '已读'];
  async componentWillMount() {
    try {
      const messages = await getProcurementMessag();
      this.setState({ messages });
    } catch (e) {}
  }
  selectionCount = (index) => {
    const {messages} = this.state;
    switch (index) {
      default: return messages.length;
      case 0: return messages.filter(m => !m.read).length;
      case 1: return messages.filter(m => (!m.read && m.type === ProcurementMessagType.INCHARGE)).length;
      case 2: return messages.filter(m => (!m.read && m.type === ProcurementMessagType.PARTICIPANT)).length;
      case 3: return messages.filter(m => (!m.read && m.type === ProcurementMessagType.CONTACTME)).length;
      case 4: return messages.filter(m => (!m.read && m.type === ProcurementMessagType.PENDING)).length;
      case 5: return messages.filter(m => m.read).length;
    }
  };
  get messagesDS() {
    const {messagesFilterValue, messages} = this.state;
    switch (messagesFilterValue) {
      default: return messages;
      case 0: return messages.filter(m => !m.read);
      case 1: return messages.filter(m => (!m.read && m.type === ProcurementMessagType.INCHARGE));
      case 2: return messages.filter(m => (!m.read && m.type === ProcurementMessagType.PARTICIPANT));
      case 3: return messages.filter(m => (!m.read && m.type === ProcurementMessagType.CONTACTME));
      case 4: return messages.filter(m => (!m.read && m.type === ProcurementMessagType.PENDING));
      case 5: return messages.filter(m => m.read);
    }
  };

  onSelect = e => this.setState({messagesFilterValue: parseInt(e.target.value, 10)});
  render() {
    return (
      <div className="board-layout message-box">
        <BoxHeader title="采购任务" selections={this.selections} onSelect={this.onSelect} selectionCount={this.selectionCount}/>
        <div className="message-list">
          {this.messagesDS.map((messages, index) => <MessageItem message={messages} key={index}/>)}
          {!this.messagesDS.length && <p>暂无内容</p>}
        </div>
      </div>
    );
  }
}
