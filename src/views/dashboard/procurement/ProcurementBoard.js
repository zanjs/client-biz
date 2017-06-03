import React from 'react';
import {getProcurementMessag} from "../../../services/message";
import {MessageItem} from "../../../components/ListItem";
import {SelectItem} from "../../../components/BoxHeader"
import {ProcurementMessagType, ProcurementType} from "../../../services/data-type";
import IconButton from 'material-ui/IconButton';

export default class ProcurementBoard extends React.PureComponent {
  state = {
    listDS: [],
    filterValueA: 0,
    filterValueB: 0,
  };
  async componentWillMount() {
    const listDS = await getProcurementMessag();
    this.setState({ listDS });
  }
  selectionsA = ['全部', '待确认', '已确认', '未收货', '未结算', '未付款', '已付款', '已完成', '已取消'];
  selectionsB = ['全部未读', '我负责的', '我参与的', '@我的', '待处理', '已读'];
  actionSelections = ['后续操作', '收货', '退货', '生成结算单', '完成', '取消'];
  selectionCountB = (index) => {
    const {listDS} = this.state;
    switch (index) {
      default: return 0;
      case 0: return listDS.filter(m => !m.read).length;
      case 1: return listDS.filter(m => (!m.read && m.type === ProcurementMessagType.INCHARGE)).length;
      case 2: return listDS.filter(m => (!m.read && m.type === ProcurementMessagType.PARTICIPANT)).length;
      case 3: return listDS.filter(m => (!m.read && m.type === ProcurementMessagType.CONTACTME)).length;
      case 4: return listDS.filter(m => (!m.read && m.type === ProcurementMessagType.PENDING)).length;
      case 5: return listDS.filter(m => m.read).length;
    }
  };
  selectionCountA = (index) => {
    const {listDS} = this.state;
    switch (index) {
      default: return 0;
      case 0: return listDS.length;
      case 1: return listDS.filter(m => (m.main_type === ProcurementType.TO_CONFIRM)).length;
      case 2: return listDS.filter(m => (m.main_type === ProcurementType.CONFIRMED)).length;
      case 3: return listDS.filter(m => (m.main_type === ProcurementType.TO_RECEIVE)).length;
      case 4: return listDS.filter(m => (m.main_type === ProcurementType.TO_BALANCE)).length;
      case 5: return listDS.filter(m => (m.main_type === ProcurementType.TO_PAY)).length;
      case 6: return listDS.filter(m => (m.main_type === ProcurementType.COMPLETED)).length;
      case 7: return listDS.filter(m => (m.main_type === ProcurementType.CANCELED)).length;
    }
  };
  get DS() {
    const {filterValueA, filterValueB, listDS} = this.state;
    const DS_B = (
      function() {
        switch (filterValueB) {
          default: return listDS;
          case 0: return listDS.filter(m => !m.read);
          case 1: return listDS.filter(m => (!m.read && m.type === ProcurementMessagType.INCHARGE));
          case 2: return listDS.filter(m => (!m.read && m.type === ProcurementMessagType.PARTICIPANT));
          case 3: return listDS.filter(m => (!m.read && m.type === ProcurementMessagType.CONTACTME));
          case 4: return listDS.filter(m => (!m.read && m.type === ProcurementMessagType.PENDING));
          case 5: return listDS.filter(m => m.read);
        }
      }
    )();
    const DS_A = (
      function () {
        switch (filterValueA) {
          default: return listDS;
          case 0: return listDS;
          case 1: return listDS.filter(m => (m.main_type === ProcurementType.TO_CONFIRM));
          case 2: return listDS.filter(m => (m.main_type === ProcurementType.CONFIRMED));
          case 3: return listDS.filter(m => (m.main_type === ProcurementType.TO_RECEIVE));
          case 4: return listDS.filter(m => (m.main_type === ProcurementType.TO_BALANCE));
          case 5: return listDS.filter(m => (m.main_type === ProcurementType.TO_PAY));
          case 6: return listDS.filter(m => (m.main_type === ProcurementType.COMPLETED));
          case 7: return listDS.filter(m => (m.main_type === ProcurementType.CANCELED));
        }
      }
    )();
    return DS_A.filter(data => DS_B.includes(data));
  };
  onSelectB = e => this.setState({filterValueB: parseInt(e.target.value, 10)});
  onSelectA = e => this.setState({filterValueA: parseInt(e.target.value, 10)})

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
      iconStyle={ProcurementBoard.styles.smallIcon}
      style={ProcurementBoard.styles.small}>
      {icon}
    </IconButton>
  );

  FollowActions = () => (
    <div className="btn-actions">
      <span>后续操作</span>
      <i className="trangle"/>
      <div className="follow-actions">
        <button className="btn-action">收货</button>
        <button className="btn-action">退货</button>
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
            <p className="title">采购任务</p>
            <SelectItem selections={this.selectionsA} selectionCount={this.selectionCountA} onSelect={this.onSelectA}/>&nbsp;
            <SelectItem selections={this.selectionsB} selectionCount={this.selectionCountB} onSelect={this.onSelectB}/>
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
