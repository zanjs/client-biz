import React from 'react';
import {getSaleMessages} from "../../../services/message";
import {MessageItem} from "../../../components/ListItem";
import {SelectItem} from "../../../components/BoxHeader"
import {SaleMessagType} from "../../../services/data-type";
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';

export default class SaleBoard extends React.PureComponent {
  state = {
    listDS: [],
    filterValue: 0,
    openFollowActions: false,
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
      color: '#797979',
    },
    small: {
      width: 30,
      height: 30,
      padding: 4,
    },
  };

  ActionButton = ({icon, action, tooltip}) => (
    <IconButton
      iconClassName="material-icons"
      onClick={action}
      tooltip={tooltip}
      iconStyle={SaleBoard.styles.smallIcon}
      style={SaleBoard.styles.small}>
      {icon}
    </IconButton>
  );

  FollowActions = () => (
    <div style={{marginLeft: 5}}>
      <RaisedButton
        onTouchTap={this.handleFollowActions}
        style={{height: 26, fontSize: 12}}
        label="后续操作"/>
      <Popover
        open={this.state.openFollowActions}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={this.handleFollowActionsClose}>
        <Menu>
          <MenuItem primaryText="发货" />
          <MenuItem primaryText="退货处理" />
          <MenuItem primaryText="生成结算单" />
          <MenuItem primaryText="完成" />
          <MenuItem primaryText="取消" />
        </Menu>
      </Popover>
    </div>
  );
  handleFollowActions = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      openFollowActions: true,
      anchorEl: event.currentTarget,
    });
  };

  handleFollowActionsClose = () => {
    this.setState({
      openFollowActions: false,
    });
  };

  onSend = () => alert('send');
  onSave = () => alert('save');
  onAttach = async () => {
    if (!window.FileReader) {
      return;
    }
    if (this.uploading) return;
    const files = await new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => resolve(e.target.files);
      input.click();
    });
    const file = files[0];
    this.uploading = true;
    const data = new FormData();
    data.append('uploadfile', file);
    try {
      // const resp = await uploadFile(data);
    } catch (e) {
      console.log(e);
    }
    this.uploading = false;
  };
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
            <this.ActionButton icon='attachment' action={this.onAttach}/>
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
