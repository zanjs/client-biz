import React from 'react';
import {MailBox} from "./MailBox";
import {getMails, getProcurementMessag, getSaleMessage} from "../../../services/message"

export default class MainBoard extends React.PureComponent {
  state = {};
  render() {
    return (
      <div className="main-board">
        <MailBox />
        {/*<div>采购业务</div>*/}
        {/*<div>销售业务</div>*/}
      </div>
    );
  }
}
