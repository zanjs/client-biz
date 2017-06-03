import React from 'react';
import {MailBox} from "./MailBox";
import {ProcurementBox} from "./ProcurementBox";
import {SaleBox} from "./SaleBox";

export default class MainBoard extends React.PureComponent {
  render() {
    return (
      <div className="main-board">
        <MailBox/>
        <ProcurementBox/>
        <SaleBox/>
      </div>
    );
  }
}
