import React from 'react';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
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

  static styles = {
    smallIcon: {
      width: 24,
      height: 24,
      fontSize: 22,
      color: '#4A4A4A',
    },
    small: {
      width: 30,
      height: 30,
      padding: 4,
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

  ActionButton = ({icon, action}) => (
    <IconButton
      iconClassName="material-icons"
      onClick={action}
      iconStyle={DetailHeader.styles.smallIcon}
      style={DetailHeader.styles.small}>
      {icon}
    </IconButton>
  );

  onReply = () => alert('reply');
  onReplyAll = () => alert('replyAll');
  onForward = () => alert('forward');
  onAttach = () => alert('attach');
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

  FollowActions = () => (
    <div className="btn-actions">
      <span>后续操作</span>
      <i className="trangle"/>
      {
        this.props.detail.type === DetailContentType.PROCUREMENT_ORDER ? <div className="follow-actions">
          <button className="btn-action">已发货</button>
          <button className="btn-action">收货</button>
          <button className="btn-action">退货</button>
          <button className="btn-action">生成结算单</button>
          <button className="btn-action">完成</button>
          <button className="btn-action">取消</button>
        </div> : <div className="follow-actions">
          <button className="btn-action">生成框架协议</button>
          <button className="btn-action">生成订单</button>
          <button className="btn-action">完成</button>
        </div>
      }
    </div>
  );

  TitleItem = () => {
    const {detail} = this.props;
    if (detail.type === DetailContentType.ANNOUNCE || detail.type === DetailContentType.APPEAL) {
      return (
        <div className="detail-title message">
          <div>
            <p className="detail-label">{detail.type === DetailContentType.ANNOUNCE ? '公告' : '投诉'}</p>
            <this.ActionButton icon='reply' action={this.onReply}/>
            <this.ActionButton icon='reply_all' action={this.onReplyAll}/>
            <this.ActionButton icon='forward' action={this.onForward}/>
            <this.ActionButton icon='attachment' action={this.onAttach}/>
          </div>
          <this.ActionButton icon='close' action={this.props.onClose}/>
        </div>
      );
    } else {
      return (
        <div className="detail-title order">
          <p className="detail-label">{detail.label}: {detail.order_no}</p>
          <div>
            <this.ActionButton icon='send' action={this.onSend}/>
            <this.ActionButton icon='save' action={this.onSave}/>
            <this.ActionButton icon='attachment' action={this.onAttach}/>
            <this.ActionButton icon='content_copy' action={this.onCopy}/>
            <this.FollowActions/>
            <this.ActionButton icon='share' action={this.onShare}/>
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
            <button onClick={this.onChangeChargePerson}>
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
            <button onClick={this.onAddFollowers}>
              <FontIcon className="material-icons" color="#333" style={{fontSize: 16}}>add_circle_outline</FontIcon>
            </button>
          </div>
        </div>
        <div className="line"/>
        <p className="message-content">{detail.content}</p>
      </div>
    );
  };

  SelectItem = ({selections, onSelect, defaultSelected}) => (
    <select onChange={onSelect} className="styled-select slate order" style={{backgroundColor: '#FFF', width: 80}} defaultValue={defaultSelected}>
      {
        selections.map(((selection, index) => <option value={index} key={index}>{selection}</option>))
      }
    </select>
  );

  CURRENCY_SELECTIONS = ['CNY', 'USD', 'EUR', 'JPY'];
  PAYMENT_SELECTIONS = ['预付', '现款现结', '10天', '30天', '60天', '90天', '分期', '自定义'];
  PRICE_TYPE_SELECTION = ['单价', '总价', '金额'];

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
          <this.ActionButton icon='note_add' action={this.onAddNote}/>
        </div>
        <div className="member-relatives">
          <p>负责人：</p>
          <div style={{flex: 1}}>
            <p>{detail.in_charge && detail.in_charge.display_name} / {detail.in_charge && detail.in_charge.position}</p>
            <button onClick={this.onChangeChargePerson}>
              <FontIcon className="material-icons" color="#333" style={{fontSize: 14}}>autorenew</FontIcon>
            </button>
          </div>
          <p>关注人：</p>
          <div style={{flex: 2}}>
            <p>
              {detail.follower && detail.follower.map((f, index) => (
                <span key={index}>{f.display_name} / {f.position}{index === (detail.follower.length - 1) ? null : '；'}</span>
              ))}
            </p>
            <button onClick={this.onAddFollowers}>
              <FontIcon className="material-icons" color="#333" style={{fontSize: 16}}>add_circle_outline</FontIcon>
            </button>
          </div>
        </div>
        <div className="select-actions">
          <div>
            <span>币种: </span>
            <this.SelectItem selections={this.CURRENCY_SELECTIONS} defaultSelected={detail.currency} onSelect={this.onCurrencyChange}/>
          </div>
          <div>
            <span>付款条件: </span>
            <this.SelectItem selections={this.PAYMENT_SELECTIONS}
                             defaultSelected={this.PAYMENT_SELECTIONS.findIndex(p => p === detail.payment)}
                             onSelect={this.onPaymentChange}/>
          </div>
          <div>
            <span>输入单价: </span>
            <this.SelectItem selections={this.PRICE_TYPE_SELECTION}
                             defaultSelected={this.PAYMENT_SELECTIONS.findIndex(p => p === detail.price_type)}
                             onSelect={this.onPriceTypeChange}/>
          </div>
          <RadioButtonGroup name="tax-radios" defaultSelected={detail.tax ? 0 : 1} className="tax-radios" onChange={this.onTaxChange}>
            <RadioButton value={0} label="含税" iconStyle={{marginRight: 5}} labelStyle={{color: '#999'}} style={{width: 90}}/>
            <RadioButton value={1} label="不含税" iconStyle={{marginRight: 5}} labelStyle={{color: '#999'}} style={{marginLeft: -30}}/>
          </RadioButtonGroup>
        </div>
        <div className="flex-row" style={{justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #E6E6E6'}}>
          <p className="total-price-txt">总价：{`${detail.total_price}`.replace(/\d{1,3}(?=(\d{3})+$)/g,function(s){ return s+',' })}</p>
          <div className="flex-row">
            <button className="btn-change-discount" onClick={() => alert('change discount')}>￥</button>
            <p>-5%</p>
          </div>
          <div/>
          {/*<label><input type="checkbox" name="goods-item"/> OK</label>*/}
        </div>
        <this.GoodsTable />
        <button onClick={() => alert('insert table')}>
          <FontIcon className="material-icons" color="#333" style={{fontSize: 16}}>add_circle_outline</FontIcon>
        </button>
      </div>
    );
  };

  GoodsTable = () => {
    const {detail} = this.props;
    const {styles} = DetailHeader;
    return (
      <Table className="goods-table" multiSelectable>
        <TableHeader enableSelectAll>
          <TableRow>
            <TableHeaderColumn style={{...styles.noPadding, width: 30}}>行号</TableHeaderColumn>
            <TableHeaderColumn style={styles.noPadding}>物料号</TableHeaderColumn>
            {detail.type === DetailContentType.SALE_ORDER &&
              <TableHeaderColumn style={styles.noPadding}>客户物料号</TableHeaderColumn>
            }
            <TableHeaderColumn style={styles.noPadding}>物料名称</TableHeaderColumn>
            <TableHeaderColumn style={styles.noPadding}>规格备注</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 30}}>数量</TableHeaderColumn>
            <TableHeaderColumn style={{...styles.noPadding, width: 30}}>单位</TableHeaderColumn>
            <TableHeaderColumn style={styles.noPadding}>单价</TableHeaderColumn>
            <TableHeaderColumn style={styles.noPadding}>金额</TableHeaderColumn>
            <TableHeaderColumn style={styles.noPadding}>交期/收货</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {detail.goods_list && detail.goods_list.map((item, index) => (
            <TableRow key={index}>
              <TableRowColumn style={{...styles.noPadding, width: 30}}>{item.line_no}</TableRowColumn>
              <TableRowColumn style={styles.noPadding}>{item.goods_no}</TableRowColumn>
              {detail.type === DetailContentType.SALE_ORDER &&
                <TableHeaderColumn style={styles.noPadding}>{item.client_goods_no}</TableHeaderColumn>
              }
              <TableRowColumn style={styles.noPadding}>{item.name}</TableRowColumn>
              <TableRowColumn style={styles.noPadding}>{item.size}</TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 30}}>{item.count}</TableRowColumn>
              <TableRowColumn style={{...styles.noPadding, width: 30}}>{item.unit}</TableRowColumn>
              <TableRowColumn style={styles.noPadding}>{item.unit_price}{item.discount}</TableRowColumn>
              <TableRowColumn style={styles.noPadding}>{item.total_price}</TableRowColumn>
              <TableRowColumn style={styles.noPadding}>{formatTime(item.due_date, 'YYYY/M/D')}</TableRowColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  onCurrencyChange = e => {
    this.props.detail.currency = parseInt(e.target.value, 10);
  };

  onPaymentChange = e => {
    this.props.detail.payment = this.PAYMENT_SELECTIONS[parseInt(e.target.value, 10)];
  };

  onPriceTypeChange = e => {
    this.props.detail.price_type = this.PRICE_TYPE_SELECTION[parseInt(e.target.value, 10)];
  };

  onTaxChange = (e, v) => {
    this.props.detail.tax = (v === 0);
  };

  render() {
    const {detail} = this.props;
    const isOrder = detail.type === DetailContentType.PROCUREMENT_ORDER || detail.type === DetailContentType.SALE_ORDER;
    return (
      <div className="detail-header">
        <this.TitleItem />
        {isOrder ? <this.OrderInfo /> : <this.MessageInfo />}
      </div>
    );
  }
}