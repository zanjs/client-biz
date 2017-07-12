import React from 'react';
import {observer} from 'mobx-react';
import {BoxHeader} from "../../../components/BoxHeader";
import {MessageItem} from "../../../components/ListItem";
import FlatButton from 'material-ui/FlatButton';
import ProcurementActivitiesStore from "../../stores/procurement-activies";

@observer
export default class ProcurementBox extends React.PureComponent {
  store = ProcurementActivitiesStore;
  state = {
    messagesFilterValue: 0,
  };
  // selections = ['全部未读', '我负责的', '我参与的', '@我的', '待处理', '已读'];
  selections = ['全部未读', '我负责的', '我参与的', '已读'];
  componentWillMount() {
    this.store.load();
  }
  selectionCount = (index) => {
    const {purchaseList, unReadListDS, isReadListDS, inChargeListDS, participantListDS} = this.store;
    switch (index) {
      default: return purchaseList.length;
      case 0: return unReadListDS.length;
      case 1: return inChargeListDS.length;
      case 2: return participantListDS.length;
      // case 3: return purchaseList.filter(m => (!m.read_flag && m.type === ProcurementMessagType.CONTACTME)).length;
      // case 4: return purchaseList.filter(m => (!m.read_flag && m.type === ProcurementMessagType.PENDING)).length;
      case 3: return isReadListDS.length;
    }
  };
  get messagesDS() {
    const {messagesFilterValue} = this.state;
    const {purchaseList, unReadListDS, isReadListDS, inChargeListDS, participantListDS} = this.store;
    switch (messagesFilterValue) {
      default: return purchaseList;
      case 0: return unReadListDS;
      case 1: return inChargeListDS;
      case 2: return participantListDS;
      // case 3: return purchaseList.filter(m => (!m.read && m.type === ProcurementMessagType.CONTACTME));
      // case 4: return purchaseList.filter(m => (!m.read && m.type === ProcurementMessagType.PENDING));
      case 3: return isReadListDS;
    }
  };

  onSelect = e => this.setState({messagesFilterValue: parseInt(e.target.value, 10)});
  render() {
    return (
      <div className="board-layout message-box">
        <BoxHeader title="采购动态" selections={this.selections} onSelect={this.onSelect}
                   selectionCount={this.selectionCount}/>
        <div className="message-list">
          {this.messagesDS.map((messages, index) => <MessageItem message={messages} key={index}/>)}
          {!this.messagesDS.length && <p className="none-data">暂无内容</p>}
          {this.store.hasMore && <FlatButton label="加载更多" style={{color: '#999'}}
                                              onTouchTap={this.store.load}/>}
        </div>
      </div>
    );
  }
}
