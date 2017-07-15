import React from 'react';
import {TagType} from "../services/data-type";
import {DrawerStore} from "./Drawer";

const PriorityType = {
  'NOT_IMPORTENT': 'NOT_IMPORTENT',
  'IMPORTENT': 'IMPORTENT',
  'VERY_IMPORTENT': 'VERY_IMPORTENT',
  'HURRY': 'HURRY',
  'VERY_HURRY': 'VERY_HURRY',
};

export class MessageItem extends React.PureComponent {
  getTagStyle = tag => {
    const {IMPORTENT, VERY_IMPORTENT, HURRY, VERY_HURRY} = PriorityType;
    let color = null;
    let backgroundColor = null;
    switch (tag) {
      default: backgroundColor = '#fffd38'; color = '#4A4A4A'; break;
      // case NOT_IMPORTENT: backgroundColor = '#fffd38'; color = '#4A4A4A'; break;
      case IMPORTENT:
      case HURRY: backgroundColor = '#fffd38'; color = '#4A4A4A'; break;
      case VERY_IMPORTENT:
      case VERY_HURRY: backgroundColor = '#fc0d1b'; color = '#FFF'; break;
    }
    return {backgroundColor, color};
  };
  getTagTxt = tag => {
    const {NOT_IMPORTENT, IMPORTENT, VERY_IMPORTENT, HURRY, VERY_HURRY} = PriorityType;
    switch (tag) {
      default: return '';
      case NOT_IMPORTENT: return '不重要';
      case IMPORTENT: return '重要';
      case VERY_IMPORTENT: return '非常重要';
      case HURRY: return '紧急';
      case VERY_HURRY: return '非常紧急';
    }
  };
  get billTitle() {
    const {bill_type} = this.props.message;
    const {isProcurement} = this.props;
    switch (bill_type) {
      default: return '单据';
      case 1: return '产能反馈单';
      case 2: return '询报价单';
      case 3: return isProcurement ? '采购订单' : '销售订单';
      case 4: return '协议';
    }
  }
  get sourceMerchant() {
    const {message, isProcurement} = this.props;
    if (isProcurement) return `${message.mer_name}(id: ${message.mer_id})`;
    return `${message.mer_name}(id: ${message.mer_id})`;
  }
  render() {
    const {message} = this.props;
    return (
      <div className="message-item" style={{marginBottom: 5}}>
        <input type="checkbox" style={{visibility: 'hidden'}}/>
        <div className="message-detail" onClick={() => DrawerStore.onOpen(message)}
             style={{display: 'block', marginLeft: 5}}>
          <p className="message-title">{this.billTitle}</p>
          <p className="message-content">单号：{message.bill_no}</p>
          <div className="message-bottom">
            <div>
              {message.tags && message.tags.map((tag, index) => <p
                key={index} className="tag" style={this.getTagStyle(tag)}>{this.getTagTxt(tag)}</p>)}
            </div>
            <p className="source">来自：{this.sourceMerchant}</p>
          </div>
        </div>
      </div>
    );
  }
}
