import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import MainBoard from './main/MainBoard';
import ProcurementBoard from './procurement/ProcurementBoard';
import SaleBoard from './sale/SaleBoard';
import Calendar from './calendar/Calendar';
import Drawer from 'material-ui/Drawer';
import {DetailContentType} from "../../services/data-type";
import {Detail} from "../../components/Detail"


export default class MainDashboard extends React.PureComponent {
  state={
    activeTab: 0,
    openDrawer: false,
  };

  tabs = ['看板', '采购', '销售', '日历'];

  TabBar = () => {
    const {activeTab} = this.state;
    return (
      <div className="panel-nav">
        <a className="title">
          <FontIcon className="material-icons" color="#333">dashboard</FontIcon>
          <span>我的工作台</span>
        </a>
        <div className="tab-container">
          {this.tabs.map((tab, index) => (
            <button className={`tab${activeTab===index ? ' active' : ''}`}
                    onClick={() => this.setState({ activeTab: index })}
                    key={index}>
              {tab}
            </button>
          ))}
        </div>
        <div className="defaultRight" style={{width: 110, height: 50}}/>
      </div>
    );
  };

  PanelContent = () => {
    switch (this.state.activeTab) {
      case 0: return <MainBoard/>;
      case 1: return <ProcurementBoard/>;
      case 2: return <SaleBoard/>;
      case 3: return <Calendar />;
      default: return;
    }
  };
  drawerWidth = 480;
  detailId = null;
  openDetailDrawer = (detailType, id) => {
    // switch (detailType) {
    //   default: return;
    //   case DetailContentType.ANNOUNCE:
    //   case DetailContentType.APPEAL:
    //     this.drawerWidth = 480;
    //     break;
    //   case DetailContentType.PROCUREMENT_ORDER:
    //   case DetailContentType.SALE_ORDER:
    //     this.drawerWidth = 600;
    //     break;
    // }
    // this.detailId = id;
    console.log('open');
    this.setState({openDrawer: true});
  };

  closeDetailDrawer = () => {
    this.setState({openDrawer: false});
  };

  toggleDrawer = () => {
    console.log(this.state.openDrawer);
    this.setState({openDrawer: !this.state.openDrawer});
  };

  render() {
    console.log(this.state);
    console.log(this.state.openDrawer);
    return (
      <div className="work-panel" onClick={this.closeDetailDrawer}>
        <this.TabBar/>
        <button onClick={this.toggleDrawer}>click</button>
        <this.PanelContent />
        <Drawer
          width={480}
          openSecondary={true}
          open={this.state.openDrawer}
          onRequestChange={(open) => this.setState({openDrawer: open})}>
          <div>hhhhh</div>
        </Drawer>
      </div>
    );
  }
}
