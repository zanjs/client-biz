import React from 'react';
import {MailBox} from "./MailBox";
import {ProcurementBox} from "./ProcurementBox";
import {SaleBox} from "./SaleBox";

export default class MainBoard extends React.PureComponent {
  render() {
    return (
      <div className="main-board">
        {/*<button className="drawer-overlay" onClick={this.props.closeDetailDrawer}/>*/}
        <MailBox openDetailDrawer={this.props.openDetailDrawer}
                 closeDetailDrawer={this.props.closeDetailDrawer}/>
        <ProcurementBox openDetailDrawer={this.props.openDetailDrawer}
                        closeDetailDrawer={this.props.closeDetailDrawer}/>
        <SaleBox openDetailDrawer={this.props.openDetailDrawer}
                 closeDetailDrawer={this.props.closeDetailDrawer}/>
      </div>
    );
  }
}
