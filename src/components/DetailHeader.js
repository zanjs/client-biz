import React from 'react';
import {observer, inject} from 'mobx-react';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import SelectField from 'material-ui/SelectField';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import AddMail from "../views/items/AddMail";
import AddMaterial from "../views/items/AddMaterial";
import {BizDialog, ComfirmDialog} from "./Dialog";
import {CURRENCY} from "../services/bill";
import {detailStore} from "./Detail";
import MemberStore from "../views/stores/merchantMember";

@inject('user')
@observer
export class DetailHeader extends React.PureComponent {
  store = detailStore;

  constructor(props) {
    super(props);
    this.state = {
      openFollowActions: false,
      openMemberListDialog: false,
    };
  }

  componentWillMount() {
    MemberStore.load();
  }

  static styles = {
    smallIcon: {
      width: 24,
      height: 24,
      fontSize: 22,
      color: '#d9d7d3',
    },
    small: {
      width: 30,
      height: 30,
      padding: 4,
      marginLeft: 5,
    },
    noPadding: {
      padding: 0,
      paddingLeft: 0,
      paddingRight: 0,
      wordBreak: 'normal',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center'
    },
    styleLineNo: {
      width: 30,
    },
  };

  ActionButton = ({icon, action, tooltip, active}) => (
    <IconButton
      iconClassName="material-icons"
      onClick={action}
      tooltip={tooltip}
      iconStyle={{...DetailHeader.styles.smallIcon, color: active ? '#189acf' : '#d9d7d3'}}
      style={DetailHeader.styles.small}>
      {icon}
    </IconButton>
  );

  onSend = () => alert('send');
  onSave = () => this.store.update();
  onCopy = () => alert('copy');
  onShare = () => alert('share');
  onAddNote = () => alert('add note');
  onClose = () => {
    if (this.store.shouldSaveBill) {
      BizDialog.onOpen('未保存修改，是否直接退出？', <ComfirmDialog submitAction={() => {
        BizDialog.onClose();
        this.props.onClose();
      }}/>)
    } else {
      this.props.onClose();
    }
  };

  handleFollowActions = event => {
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

  onReply = () => {
    const {detail} = this.props;
    if (!detail) return;
    BizDialog.onOpen('回复邮件', <AddMail mail={{
      receiver_id: detail.sender,
      mail_title: `回复: ${detail.mail_title}`,
      // mail_content: `原文: "${detail.mail_content}"`,
    }}/>)
  };
  // onReplyAll = () => alert('replyAll');
  onForward = () => {
    const {detail} = this.props;
    if (!detail) return;
    BizDialog.onOpen('转发邮件', <AddMail mail={{
      mail_title: `转发: ${detail.mail_title}`,
      mail_content: `"原文: ${detail.mail_content}"`, // `"原文: ${detail.mail_content}"\n\n` 目前发送邮件不支持手动换行
    }}/>)
  };
  // onAttach = async () => {
  //   if (!window.FileReader) {
  //     return;
  //   }
  //   if (this.uploading) return;
  //   const files = await new Promise(resolve => {
  //     const input = document.createElement('input');
  //     input.type = 'file';
  //     input.onchange = e => resolve(e.target.files);
  //     input.click();
  //   });
  //   const file = files[0];
  //   this.uploading = true;
  //   const data = new FormData();
  //   data.append('uploadfile', file);
  //   try {
  //     // const resp = await uploadFile(data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   this.uploading = false;
  // };

  get billTitle() {
    const {bill_type, isProcurement} = this.props.detail;
    switch (bill_type) {
      default: return '单据';
      case 1: return '产能反馈单';
      case 2: return '询报价单';
      case 3: return isProcurement ? '采购订单' : '销售订单';
      case 4: return '协议';
    }
  }

  TitleItem = observer(() => {
    const {detail, isMail} = this.props;
    if (isMail) {
      return (
        <div className="detail-title message">
          <p className="detail-label">邮件</p>
          <div>
            <this.ActionButton icon='reply' tooltip='回复' action={this.onReply}/>
            {/*<this.ActionButton icon='reply_all' tooltip='回复全部' action={this.onReplyAll}/>*/}
            <this.ActionButton icon='forward' tooltip='转发' action={this.onForward}/>
            {/*<this.ActionButton icon='attachment' tooltip='附件' action={this.onAttach}/>*/}
            <IconButton
              iconClassName="material-icons"
              onClick={this.props.onClose}
              iconStyle={DetailHeader.styles.smallIcon}
              style={{...DetailHeader.styles.small, marginLeft: 10}}>
              {'close'}
            </IconButton>
          </div>
        </div>
      );
    } else {
      return (
        <div className="detail-title order">
          <p className="detail-label">{this.billTitle}: {detail.head.bill_no}</p>
          <div>
            {/*<this.ActionButton icon='send' tooltip='发送' action={this.onSend}/>*/}
            <this.ActionButton icon='save' tooltip='保存' action={this.onSave}
                               active={this.store.shouldSaveBill}/>
            {/*<this.ActionButton icon='attachment' tooltip='附件' action={this.onAttach}/>*/}
            {/*<this.ActionButton icon='content_copy' tooltip='复制' action={this.onCopy}/>*/}
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
                { this.props.detail.isProcurement ? <Menu>
                  <MenuItem primaryText="已发货" />
                  <MenuItem primaryText="收货" />
                  <MenuItem primaryText="退货" />
                  <MenuItem primaryText="生成结算单" />
                  <MenuItem primaryText="完成" />
                  <MenuItem primaryText="取消" />
                </Menu> : <Menu>
                  <MenuItem primaryText="生成框架协议" />
                  <MenuItem primaryText="生成订单" />
                  <MenuItem primaryText="完成" />
                </Menu>}
              </Popover>
            </div>
            {/*<this.ActionButton icon='share' tooltip='分享' action={this.onShare}/>*/}
            <IconButton
              iconClassName="material-icons"
              onClick={this.onClose}
              iconStyle={DetailHeader.styles.smallIcon}
              style={{...DetailHeader.styles.small, marginLeft: 20}}>
              {'close'}
            </IconButton>
          </div>
        </div>
      );
    }
  });

  MessageInfo = () => {
    const {detail} = this.props;
    return (
      <div className="message-info-item">
        <div className="title-container">
          <p className="detail-title-txt">标题: {detail.mail_title}</p>
          <p className="detail-time-txt">{detail.send_time}</p>
        </div>
        <div className="sender-info-item">
          <p>来自商户：</p>
          <p className="company-txt">{detail.sender_name} (id: {detail.sender})</p>
        </div>
        <p className="message-content" style={{color: '#333'}}>内容:</p>
        <p className="message-content" style={{color: '#333'}}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{detail.mail_content}
        </p>
      </div>
    )
  };

  OrderInfo = observer(() => {
    const {detail} = this.props;
    const {isProcurement, head} = detail;
    const currentUser = this.props.user.user.current;
    return (
      <div className="order-info-item">
        <div className="order-source">
          <p style={{maxWidth: 260}}>{isProcurement ? '供应商：' : '客户：'}{head.mer_name}</p>
          <p style={{maxWidth: 160}}>{head.user_name}</p>
          <p>{head.create_time}</p>
          {/*<this.ActionButton icon='note_add' tooltip='添加备注' action={this.onAddNote}/>*/}
        </div>
        <div className="member-relatives">
          <p>关注人：</p>
          <div>
            <p>
              {this.store.notice_list.map((item, index) => (
                <span key={index}>{item.name}{index === (this.store.notice_list.length - 1) ? null : '；'}</span>))}
            </p>
            <button onClick={() => this.setState({openMemberListDialog: true})} style={{margin: '1px 0 0 5px'}}>
              <FontIcon className="material-icons" color="#333" style={{fontSize: 16}}>add_circle_outline</FontIcon>
            </button>
            <Dialog
              title='商户成员列表'
              titleStyle={{fontSize: 18}}
              modal={false}
              autoScrollBodyContent
              open={this.state.openMemberListDialog}
              onRequestClose={() => this.setState({openMemberListDialog: false})}>
              <div>
                {MemberStore.memberList.filter(member => member.user_id !== currentUser.id).map((member, key) => (
                  <Checkbox label={member.user_name} key={key}
                            checked={this.store.notice_list.findIndex(follow => follow.id === member.user_id) > -1}
                            onCheck={(event, checked) => this.store.updateFollow(member, checked)}/>
                ))}
              </div>
            </Dialog>
          </div>
        </div>
        <div className="select-actions" style={{marginBottom: 10}}>
          <div style={{flex: 1}}>
            <SelectField floatingLabelText="币种: " value={this.store.currency} disabled
                         onChange={(e, i, v) => this.store.setKey('currency', v)} style={{width: 120}}>
              { CURRENCY.map(((c, index) => <MenuItem value={c.value} primaryText={c.name} key={index}/>)) }
            </SelectField>
          </div>
          <div style={{flex: 1}}>
            <SelectField floatingLabelText="付款方式: " value={this.store.pay_type}
                         disabled={isProcurement}
                         onChange={(e, i, v) => this.store.setKey('pay_type', v)} style={{width: 120}}>
              { ['', '现款现结', '月结'].map(((item, index) => <MenuItem value={index} primaryText={item || '暂无'} key={index}/>)) }
            </SelectField>
          </div>
        </div>
        <SelectField
          floatingLabelText="优先级(重要度与紧急度各一项)"
          value={this.store.priority}
          style={{marginBottom: 20}}
          multiple={true}
          onChange={(event, index, val) => this.store.setKey('priority', (val && val.slice(0, 2)) || "")}
        >
          <MenuItem value='NOT_IMPORTENT' primaryText='不重要' insetChildren={true}
                    checked={this.store.priority.indexOf('NOT_IMPORTENT') > -1}/>
          <MenuItem value='NORMAL' primaryText='正常' insetChildren={true}
                    checked={this.store.priority.indexOf('NORMAL') > -1}/>
          <MenuItem value='IMPORTENT' primaryText='重要' insetChildren={true}
                    checked={this.store.priority.indexOf('IMPORTENT') > -1}/>
          <MenuItem value='VERY_IMPORTENT' primaryText='非常重要' insetChildren={true}
                    checked={this.store.priority.indexOf('VERY_IMPORTENT') > -1}/>
          <MenuItem value='HURRY' primaryText='紧急' insetChildren={true}
                    checked={this.store.priority.indexOf('HURRY') > -1}/>
          <MenuItem value='VERY_HURRY' primaryText='非常紧急' insetChildren={true}
                    checked={this.store.priority.indexOf('VERY_HURRY') > -1}/>
        </SelectField><br/>
        <div className="flex-row" style={{margin: '-20px 0 20px 0'}}>
          <div style={{flex: 1}}>
            {this.store.valid_begin_time ? (
              <DatePicker floatingLabelText="协议有效开始时间"
                          disabled={isProcurement}
                          defaultDate={new Date(this.store.valid_begin_time)}
                          onChange={(e, value) => this.store.setKey('valid_begin_time', new Date(value).getTime())}/>
            ): (
              <DatePicker floatingLabelText="协议有效开始时间" disabled={isProcurement}
                          onChange={(e, value) => this.store.setKey('valid_begin_time', new Date(value).getTime())}/>
            )}

          </div>
          <div style={{flex: 1}}>
            {this.store.valid_end_time ? (
              <DatePicker floatingLabelText="协议有效结束时间"
                          disabled={isProcurement}
                          defaultDate={new Date(this.store.valid_end_time)}
                          onChange={(e, value) => this.store.setKey('valid_end_time', new Date(value).getTime())}/>
            ) : (
              <DatePicker floatingLabelText="协议有效结束时间" disabled={isProcurement}
                          onChange={(e, value) => this.store.setKey('valid_end_time', new Date(value).getTime())}/>
            )}
          </div>
        </div>
        <RadioButtonGroup name="tax-radios" defaultSelected={this.store.tax_flag} className="tax-radios">
          {/*onChange={(e, v) => this.store.setKey('tax_flag', v)}*/}
          <RadioButton value={1} label="含税" disabled iconStyle={{marginRight: 5}} labelStyle={{color: '#999', fontSize: 12}} style={{}}/>
          <RadioButton value={0} label="不含税" disabled iconStyle={{marginRight: 5}} labelStyle={{color: '#999', fontSize: 12}} style={{marginLeft: -50}}/>
        </RadioButtonGroup>
        <div className="bill-price flex-row">
          <p className="price-txt">总价：{`${head.amount}`.replace(/\d{1,3}(?=(\d{3})+$)/g,function(s){ return s+',' })}</p>
          <p className="price-txt">税率: {head.tax_rate}</p>
          <div/>
        </div>
        <this.GoodsTable />
        {
          !isProcurement && <button onClick={() => {this.store.openItemDialog()}}
                                    className="btn-add-goods" style={{marginLeft: 10}}>
            <FontIcon className="material-icons" color="#333" style={{fontSize: 16}}>add_circle_outline</FontIcon>
          </button>
        }
      </div>
    );
  });

  onCellClick = (row,column) => {
    if (this.props.detail.isProcurement) return;
    if (column > -1) {
      const itemConfirmed = (this.store.item_list[row].relative_confirm_status === 1) || (this.store.item_list[row].confirm_status === 1);
      if (!itemConfirmed) this.store.openItemDialog(this.store.item_list[row]);
    }
  };

  onRowSelection = (value) => this.store.setConfirmedItem(value);

  get enableSelectAllItem() {
    let result = true;
    if (!this.props.detail.isProcurement) return result;
    this.store.item_list.forEach(item => {
      if (item.relative_confirm_status === 0) result = false;
    });
    return result;
  }

  GoodsTable = observer(() => {
    const {detail} = this.props;
    const {styles} = DetailHeader;
    return (
      <Table className="goods-table" multiSelectable onCellClick={this.onCellClick} onRowSelection={this.onRowSelection}>
        <TableHeader enableSelectAll={this.enableSelectAllItem} >
          <TableRow>
            <TableHeaderColumn style={{...styles.noPadding, width: 40}}>行号</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 60}}>物料号</TableHeaderColumn>
            {!detail.isProcurement &&
              <TableHeaderColumn style={{...styles.noPadding, width: 60}}>客户物料号</TableHeaderColumn>
            }
            <TableHeaderColumn style={styles.noPadding}>物料名称</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 50}}>规格备注</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 50}}>数量</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 50}}>单位</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 50}}>单价</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 50}}>金额</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 70}}>交期/收货</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover deselectOnClickaway={false}>
          {this.store.item_list.map((item, index) => (
            <TableRow key={index}
                      selectable={true}
                      selected={this.store.currentComfirmedItems.findIndex(i => i === index) > -1}>
              <TableRowColumn style={{...styles.noPadding, width: 40}}>
                {/* 扩展行点击事件， 以修复点击行而不触发checkbox */}
                <div className="expend-tab-row"
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onCellClick(index, 0);}}>
                  <p>{item.line_no || '暂无'}</p>
                </div>
              </TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 60}}>
                <div className="expend-tab-row"
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onCellClick(index, 1);}}>
                  <p>{item.item_code || '暂无'}</p>
                </div>
              </TableRowColumn>
              {
                !detail.isProcurement && <TableRowColumn
                style={{...styles.noPadding, width: 60}}>
                  <div className="expend-tab-row"
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onCellClick(index, 2);}}>
                    <p>{item.source_no || '暂无'}</p>
                  </div>
                </TableRowColumn>
              }
              <TableRowColumn style={styles.noPadding}>
                <div className="expend-tab-row"
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onCellClick(index, !detail.isProcurement ? 3 : 2);}}>
                  <p>{item.item_name || '暂无'}</p>
                </div>
              </TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 50}}>
                <div className="expend-tab-row"
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onCellClick(index, !detail.isProcurement ? 4 : 3);}}>
                  <p>{item.item_spec || '暂无'}</p>
                </div>
              </TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 50}}>
                <div className="expend-tab-row"
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onCellClick(index, !detail.isProcurement ? 5 : 4);}}>
                  <p>{item.quantity || 0}</p>
                </div>
                </TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 50}}>
                <div className="expend-tab-row"
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onCellClick(index, !detail.isProcurement ? 6 : 5);}}>
                  <p>{item.unit || '暂无'}</p>
                </div>
              </TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 50}}>
                <div className="expend-tab-row"
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onCellClick(index, !detail.isProcurement ? 7 : 6);}}>
                  <p>{item.price || 0}</p>
                </div>
              </TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 50}}>
                <div className="expend-tab-row"
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onCellClick(index, !detail.isProcurement ? 8 : 7);}}>
                  <p>{item.amount}</p>
                </div>
              </TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 70}}>
                <div className="expend-tab-row"
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onCellClick(index, !detail.isProcurement ? 9 : 8);}}>
                  <p>{(item.deliver_time && item.deliver_time.split(' ')[0]) || '暂无'}</p>
                </div>
              </TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  });

  render() {
    const {isMail} = this.props;
    return (
      <div className="detail-header">
        <this.TitleItem />
        {isMail ? <this.MessageInfo /> : <this.OrderInfo />}
        <Dialog
          title='物料'
          titleStyle={{fontSize: 18}}
          modal={false}
          autoScrollBodyContent
          open={this.store.openEditItemDialog}
          onRequestClose={this.store.closeItemDialog}>
          <AddMaterial material={this.store.editingMaterial}
                       onDel={this.store.deleteMaterialItem}
                       onAdd={this.store.addMaterialItem}
                       onUpdate={this.store.updateMaterialItem}
                       onclose={this.store.closeItemDialog}/>
        </Dialog>
      </div>
    );
  }
}