import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import SelectField from 'material-ui/SelectField';
import FontIcon from 'material-ui/FontIcon';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {DetailContentType} from "../services/data-type";
import {formatTime} from "../utils/time";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

export class DetailHeader extends React.PureComponent {

  constructor(props) {
    super(props);
    const {detail} = props;
    const defaultPayment = (detail && this.PAYMENT_SELECTIONS.findIndex(p => p === detail.payment)) || 0;
    const defaultPriceType = (detail && this.PRICE_TYPE_SELECTION.findIndex(p => p === detail.price_type)) || 0;
    const defaultCurrency = (detail && detail.currency) || 0;
    this.state = {
      priceType: defaultPriceType,
      currency: defaultCurrency,
      payment: defaultPayment,
      openFollowActions: false,
      openEditDialog: false,
    };
    this.focusGoodData = null;
    this.editRowNumber = null;
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
      whiteSpace: 'normal',
      overflow: 'visible',
      textOverflow: 'clip',
    },
    styleLineNo: {
      width: 30,
    },
  };

  ActionButton = ({icon, action, tooltip}) => (
    <IconButton
      iconClassName="material-icons"
      onClick={action}
      tooltip={tooltip}
      iconStyle={DetailHeader.styles.smallIcon}
      style={DetailHeader.styles.small}>
      {icon}
    </IconButton>
  );

  onReply = () => alert('reply');
  onReplyAll = () => alert('replyAll');
  onForward = () => alert('forward');
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
  onChangeChargePerson = () => alert('onChangeChargePerson');
  onAddFollowers = () => {
    this.props.detail.follower.push({display_name: '肖益龙', position: '总经理'});
    this.forceUpdate();
  };

  onSend = () => alert('send');
  onSave = () => alert('save');
  onCopy = () => alert('copy');
  onShare = () => alert('share');
  onAddNote = () => alert('add note');

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
        { this.props.detail.type === DetailContentType.PROCUREMENT_ORDER ? <Menu>
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
  );

  TitleItem = () => {
    const {detail} = this.props;
    if (detail.type === DetailContentType.ANNOUNCE || detail.type === DetailContentType.APPEAL) {
      return (
        <div className="detail-title message">
          <p className="detail-label">{detail.type === DetailContentType.ANNOUNCE ? '公告' : '投诉'}</p>
          <div>
            <this.ActionButton icon='reply' tooltip='回复' action={this.onReply}/>
            <this.ActionButton icon='reply_all' tooltip='回复全部' action={this.onReplyAll}/>
            <this.ActionButton icon='forward' tooltip='转发' action={this.onForward}/>
            <this.ActionButton icon='attachment' tooltip='附件' action={this.onAttach}/>
            <IconButton
              iconClassName="material-icons"
              onClick={this.props.onClose}
              iconStyle={DetailHeader.styles.smallIcon}
              style={{...DetailHeader.styles.small, marginLeft: 20}}>
              {'close'}
            </IconButton>
          </div>
        </div>
      );
    } else {
      return (
        <div className="detail-title order">
          <p className="detail-label">{detail.label}: {detail.order_no}</p>
          <div>
            <this.ActionButton icon='send' tooltip='发送' action={this.onSend}/>
            <this.ActionButton icon='save' tooltip='保存' action={this.onSave}/>
            <this.ActionButton icon='attachment' tooltip='附件' action={this.onAttach}/>
            <this.ActionButton icon='content_copy' tooltip='复制' action={this.onCopy}/>
            <this.FollowActions/>
            <this.ActionButton icon='share' tooltip='分享' action={this.onShare}/>
            <IconButton
              iconClassName="material-icons"
              onClick={this.props.onClose}
              iconStyle={DetailHeader.styles.smallIcon}
              style={{...DetailHeader.styles.small, marginLeft: 20}}>
              {'close'}
            </IconButton>
          </div>
        </div>
      );
    }
  };

  MessageInfo = () => {
    const {detail} = this.props;
    return (
      <div className="message-info-item">
        <div className="title-container">
          <p className="detail-title-txt">{detail.title}</p>
          <p className="detail-time-txt">{formatTime(detail.timestamp, "YYYY-MM-D h:mm")}</p>
        </div>
        <div className="sender-info-item">
          <p>来自客户：</p>
          <p className="company-txt">{detail.sender && detail.sender.company}</p>
          <p>发件人: {detail.sender && detail.sender.display_name} / {detail.sender && detail.sender.position}</p>
        </div>
        <div className="member-relatives">
          <p>负责人：</p>
          <div>
            <p>{detail.in_charge && detail.in_charge.display_name} / {detail.in_charge && detail.in_charge.position}</p>
            <button onClick={this.onChangeChargePerson} style={{marginLeft: 5}}>
              <FontIcon className="material-icons" color="#333" style={{fontSize: 14}}>autorenew</FontIcon>
            </button>
          </div>
        </div>
        <div className="member-relatives">
          <p>关注人：</p>
          <div>
            <p>
              {detail.follower && detail.follower.map((f, index) => (
                <span key={index}>{f.display_name} / {f.position}{index === (detail.follower.length - 1) ? null : '；'}</span>
              ))}
            </p>
            <button onClick={this.onAddFollowers} style={{marginLeft: 5}}>
              <FontIcon className="material-icons" color="#333" style={{fontSize: 16}}>add_circle_outline</FontIcon>
            </button>
          </div>
        </div>
        <div className="line"/>
        <p className="message-content">{detail.content}</p>
      </div>
    );
  };

  CURRENCY_SELECTIONS = ['CNY', 'USD', 'EUR', 'JPY'];
  PAYMENT_SELECTIONS = ['预付', '现款现结', '10天', '30天', '60天', '90天', '分期', '自定义'];
  PRICE_TYPE_SELECTION = ['单价', '总价', '金额'];

  SelectItem = ({selections, onSelect, width=100, hintTxt, value=0}) => (
    <SelectField floatingLabelText={hintTxt} value={value} onChange={onSelect} style={{width}}>
      { selections.map(((selection, index) => <MenuItem value={index} primaryText={selection} key={index}/>)) }
    </SelectField>
  );

  onCurrencyChange = (event, index, value) => {
    this.props.detail.currency = value;
    this.setState({currency: value});
  };

  onPaymentChange = (event, index, value) => {
    this.props.detail.payment = this.PAYMENT_SELECTIONS[value];
    this.setState({payment: value});
  };

  onPriceTypeChange = (event, index, value) => {
    this.props.detail.price_type = this.PRICE_TYPE_SELECTION[value];
    this.setState({priceType: value});
  };

  onTaxChange = (e, v) => {
    this.props.detail.tax = (v === 0);
  };

  OrderInfo = () => {
    const {detail} = this.props;
    if (!detail.order_no) return;
    const isProcurement = detail.type === DetailContentType.PROCUREMENT_ORDER;
    return (
      <div className="order-info-item">
        <div className="order-source">
          <p style={{maxWidth: 260}}>{isProcurement ? '供应商：' : '客户：'}{detail.supplier.company}</p>
          <p style={{maxWidth: 160}}>{detail.supplier.display_name} / {detail.supplier.position}</p>
          <p>{formatTime(detail.timestamp, "YYYY-MM-D h:mm")}</p>
          <this.ActionButton icon='note_add' tooltip='添加备注' action={this.onAddNote}/>
        </div>
        <div className="member-relatives" style={{marginTop: 10}}>
          <p>负责人：</p>
          <div>
            <p>{detail.in_charge && detail.in_charge.display_name} / {detail.in_charge && detail.in_charge.position}</p>
            <button onClick={this.onChangeChargePerson} style={{marginLeft: 5}}>
              <FontIcon className="material-icons" color="#333" style={{fontSize: 14}}>autorenew</FontIcon>
            </button>
          </div>
        </div>
        <div className="member-relatives" style={{marginTop: 10, marginBottom: 5}}>
          <p>关注人：</p>
          <div>
            <p>
              {detail.follower && detail.follower.map((f, index) => (
                <span key={index}>{f.display_name} / {f.position}{index === (detail.follower.length - 1) ? null : '；'}</span>
              ))}
            </p>
            <button onClick={this.onAddFollowers} style={{marginLeft: 5}}>
              <FontIcon className="material-icons" color="#333" style={{fontSize: 16}}>add_circle_outline</FontIcon>
            </button>
          </div>
        </div>
        <div className="select-actions" style={{marginBottom: 10}}>
          <div style={{flex: 1}}>
            <this.SelectItem selections={this.CURRENCY_SELECTIONS}
                             hintTxt="币种: "
                             width={90}
                             value={this.state.currency}
                             onSelect={this.onCurrencyChange}/>
          </div>
          <div style={{flex: 1}}>
            <this.SelectItem selections={this.PAYMENT_SELECTIONS}
                             hintTxt="付款条件: "
                             width={120}
                             value={this.state.payment}
                             onSelect={this.onPaymentChange}/>
          </div>
          <div style={{flex: 1}}>
            <this.SelectItem selections={this.PRICE_TYPE_SELECTION}
                             hintTxt="输入单价: "
                             width={90}
                             value={this.state.priceType}
                             onSelect={this.onPriceTypeChange}/>
          </div>
        </div>
        <RadioButtonGroup name="tax-radios" defaultSelected={detail.tax ? 0 : 1} className="tax-radios" onChange={this.onTaxChange}>
          <RadioButton value={0} label="含税" iconStyle={{marginRight: 5}} labelStyle={{color: '#999', fontSize: 12}} style={{}}/>
          <RadioButton value={1} label="不含税" iconStyle={{marginRight: 5}} labelStyle={{color: '#999', fontSize: 12}} style={{marginLeft: -50}}/>
        </RadioButtonGroup>
        <div className="flex-row" style={{justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #E6E6E6'}}>
          <p className="total-price-txt">总价：{`${detail.total_price}`.replace(/\d{1,3}(?=(\d{3})+$)/g,function(s){ return s+',' })}</p>
          <div className="flex-row">
            <button className="btn-change-discount" onClick={() => alert('change discount')}>￥</button>
            <p>-5%</p>
          </div>
          <div/>
        </div>
        <this.GoodsTable />
        <button onClick={this.handleAddGoods} className="btn-add-goods" style={{marginLeft: 10}}>
          <FontIcon className="material-icons" color="#333" style={{fontSize: 16}}>add_circle_outline</FontIcon>
        </button>
      </div>
    );
  };

  handleAddGoods = () => {
    this.isCreateGood = true;
    this.handleDialogOpen();
  };


  onCellClick = (row,column) => {
    if (column > -1) {
      this.focusGoodData = this.props.detail.goods_list[row];
      this.editRowNumber = row;
      this.handleDialogOpen();
    }
  };

  GoodsTable = () => {
    const {detail} = this.props;
    const {styles} = DetailHeader;
    return (
      <Table className="goods-table" multiSelectable onCellClick={this.onCellClick}>
        <TableHeader enableSelectAll>
          <TableRow>
            <TableHeaderColumn style={{...styles.noPadding, width: 26}}>行号</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 40}}>物料号</TableHeaderColumn>
            {detail.type === DetailContentType.SALE_ORDER &&
              <TableHeaderColumn style={{...styles.noPadding, width: 70}}>客户物料号</TableHeaderColumn>
            }
            <TableHeaderColumn style={styles.noPadding}>物料名称</TableHeaderColumn>
            <TableHeaderColumn style={styles.noPadding}>规格备注</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 30}}>数量</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 30}}>单位</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 40}}>单价</TableHeaderColumn>
            <TableHeaderColumn style={styles.noPadding}>金额</TableHeaderColumn>
            <TableHeaderColumn style={styles.noPadding}>交期/收货</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover>
          {detail.goods_list && detail.goods_list.map((item, index) => (
            <TableRow key={index} selectable={true}>
              <TableRowColumn style={{...styles.noPadding, width: 20}}>{item.line_no || 0}</TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 40}}>{item.goods_no || 0}</TableRowColumn>
              {
                detail.type === DetailContentType.SALE_ORDER && <TableRowColumn
                style={{...styles.noPadding, width: 70}}>{item.client_goods_no || 0}</TableRowColumn>
              }
              <TableRowColumn style={styles.noPadding}>{item.name || '暂无'}</TableRowColumn>
              <TableRowColumn style={styles.noPadding}>{item.size || '暂无'}</TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 30}}>{item.count || 0}</TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 30}}>{item.unit || '暂无'}</TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 40}}>{item.unit_price || 0}{item.discount}</TableRowColumn>
              <TableRowColumn style={styles.noPadding}>{item.total_price}</TableRowColumn>
              <TableRowColumn style={styles.noPadding}>{item.due_date ? formatTime(item.due_date, 'YYYY/M/D') : '暂无'}</TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  EditGoodsDialog = () => {
    const {detail} = this.props;
    const title = this.focusGoodData ? '编辑' : '创建';
    if (this.isCreateGood) this.focusGoodData = {};
    const actions = [
      <FlatButton
        label="确认"
        primary={true}
        keyboardFocused={false}
        onTouchTap={this.submitEdit}
      />,
      <FlatButton
        label="取消"
        primary={false}
        keyboardFocused={true}
        onTouchTap={this.handleDialogClose}
      />,
    ];
    return (
      <Dialog
        title={title}
        actions={actions}
        modal={false}
        autoScrollBodyContent
        open={this.state.openEditDialog}
        onRequestClose={this.handleDialogClose}>
        <div className="edit-form">
          <TextField floatingLabelText="行号" className="edit-field"
                     defaultValue={this.focusGoodData && this.focusGoodData.line_no}
                     onChange={(e, value) => this.focusGoodData.line_no = parseInt(value, 10)}/>
          <TextField floatingLabelText="物料号" className="edit-field"
                     defaultValue={this.focusGoodData && this.focusGoodData.goods_no}
                     onChange={(e, value) => this.focusGoodData.goods_no = parseInt(value, 10)}/>
          {detail.type === DetailContentType.SALE_ORDER && <TextField floatingLabelText="客户物料号"
                                                                      className="edit-field"
                                                                      defaultValue={this.focusGoodData && this.focusGoodData.client_goods_no}
                                                                      onChange={(e, value) => this.focusGoodData.client_goods_no = parseInt(value, 10)}/>}
          <TextField floatingLabelText="物料名称" className="edit-field"
                     defaultValue={this.focusGoodData && this.focusGoodData.name}
                     onChange={(e, value) => this.focusGoodData.name = value}/>
          <TextField floatingLabelText="规格备注" className="edit-field"
                     defaultValue={this.focusGoodData && this.focusGoodData.size}
                     onChange={(e, value) => this.focusGoodData.size = value}/>
          <TextField floatingLabelText="数量" className="edit-field"
                     defaultValue={this.focusGoodData && this.focusGoodData.count}
                     onChange={(e, value) => this.focusGoodData.count = parseInt(value, 10)}/>
          <TextField floatingLabelText="单位" className="edit-field"
                     defaultValue={this.focusGoodData && this.focusGoodData.unit}
                     onChange={(e, value) => this.focusGoodData.unit = value}/>
          <TextField floatingLabelText="单价" className="edit-field"
                     defaultValue={this.focusGoodData && this.focusGoodData.unit_price}
                     onChange={(e, value) => this.focusGoodData.unit_price = parseInt(value, 10)}/>
          <TextField floatingLabelText="金额" className="edit-field"
                     defaultValue={this.focusGoodData && this.focusGoodData.total_price}
                     onChange={(e, value) => this.focusGoodData.total_price = parseInt(value, 10)}/>
          <DatePicker floatingLabelText="交期/收货" className="edit-field"
                      defaultDate={this.focusGoodData && this.focusGoodData.due_date && new Date(this.focusGoodData.due_date)}
                      onChange={(e, value) => this.focusGoodData.due_date = new Date(value).getTime()}/>
        </div>
      </Dialog>
    )
  };

  submitEdit = () => {
    if (this.isCreateGood) {
      this.props.detail.goods_list.push(this.focusGoodData);
    } else {
      this.props.detail.goods_list[this.editRowNumber] = {...this.props.detail.goods_list[this.editRowNumber], ...this.focusGoodData}
    }
    this.handleDialogClose();
  };

  handleDialogOpen = () => {
    this.setState({openEditDialog: true});
  };

  handleDialogClose = () => {
    this.focusGoodData = null;
    this.editRowNumber = null;
    this.isCreateGood = false;
    this.setState({openEditDialog: false});
  };

  render() {
    const {detail} = this.props;
    const isOrder = detail.type === DetailContentType.PROCUREMENT_ORDER || detail.type === DetailContentType.SALE_ORDER;
    return (
      <div className="detail-header">
        <this.TitleItem />
        {isOrder ? <this.OrderInfo /> : <this.MessageInfo />}
        <this.EditGoodsDialog />
      </div>
    );
  }
}