import React from 'react';
import {getSaleMessages} from "../../../services/message";
import {MessageItem} from "../../../components/ListItem";
import {SelectItem} from "../../../components/BoxHeader"
import {SaleMessagType} from "../../../services/data-type";
import IconButton from 'material-ui/IconButton';

export default class SaleBoard extends React.PureComponent {
  state = {
    listDS: [],
    filterValue: 0,
  };
  async componentWillMount() {
    const listDS = await getSaleMessages();
    this.setState({ listDS });
  }

  selections = ['全部未读', '我负责的', '我参与的', '待处理', '已读'];
  selectionCount = (index) => {
    const {listDS} = this.state;
    switch (index) {
      default: return listDS.length;
      case 0: return listDS.filter(m => !m.read).length;
      case 1: return listDS.filter(m => (!m.read && m.type === SaleMessagType.INCHARGE)).length;
      case 2: return listDS.filter(m => (!m.read && m.type === SaleMessagType.PARTICIPANT)).length;
      case 3: return listDS.filter(m => (!m.read && m.type === SaleMessagType.PENDING)).length;
      case 4: return listDS.filter(m => m.read).length;
    }
  };
  get DS() {
    const {filterValue, listDS} = this.state;
    switch (filterValue) {
      default: return listDS;
      case 0: return listDS.filter(m => !m.read);
      case 1: return listDS.filter(m => (!m.read && m.type === SaleMessagType.INCHARGE));
      case 2: return listDS.filter(m => (!m.read && m.type === SaleMessagType.PARTICIPANT));
      case 3: return listDS.filter(m => (!m.read && m.type === SaleMessagType.PENDING));
      case 4: return listDS.filter(m => m.read);
    }
  };
  onSelect = e => this.setState({filterValue: parseInt(e.target.value, 10)});

  static styles = {
    smallIcon: {
      width: 24,
      height: 24,
      fontSize: 20,
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
      iconStyle={SaleBoard.styles.smallIcon}
      style={SaleBoard.styles.small}>
      {icon}
    </IconButton>
  );

  FollowActions = () => (
    <div className="btn-actions">
      <span>后续操作</span>
      <i className="trangle"/>
      <div className="follow-actions">
        <button className="btn-action">发货</button>
        <button className="btn-action">退货处理</button>
        <button className="btn-action">生成结算单</button>
        <button className="btn-action">完成</button>
        <button className="btn-action">取消</button>
      </div>
    </div>
  );

  onSend = () => alert('send');
  onSave = () => alert('save');
  onInsert = () => alert('insert');
  onCopy = () => alert('copy');
  onShare = () => alert('share');

  render() {
    return (
      <div className="procurement-board">
        <div className="procurement-header">
          <div className="header-left">
            <p className="title">销售业务</p>
            <SelectItem selections={this.selections} selectionCount={this.selectionCount} onSelect={this.onSelect}/>
          </div>
          <div className="header-right">
            <this.ActionButton icon='send' action={this.onSend}/>
            <this.ActionButton icon='save' action={this.onSave}/>
            <this.ActionButton icon='attachment' action={this.onInsert}/>
            <this.ActionButton icon='content_copy' action={this.onCopy}/>
            <this.FollowActions/>
            <this.ActionButton icon='share' action={this.onShare}/>
          </div>
        </div>
        <div className="procurement-list">
          {
            this.DS.map((data, index) => (
              <div key={index} className="procurement-item">
                <div style={{width: 260}}><MessageItem message={data}/></div>
                <div className="message-detail" style={{marginLeft: 5, textAlign: 'center'}}>
                  <p style={{fontSize: 14}}>单据详情</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
