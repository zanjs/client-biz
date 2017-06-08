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
    drawerWidth: 0,
    detailId: null,
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
      case 0: return <MainBoard closeDetailDrawer={this.closeDetailDrawer}
                                openDetailDrawer={this.openDetailDrawer}/>;
      case 1: return <ProcurementBoard closeDetailDrawer={this.closeDetailDrawer}
                                       openDetailDrawer={this.openDetailDrawer}/>;
      case 2: return <SaleBoard closeDetailDrawer={this.closeDetailDrawer}
                                openDetailDrawer={this.openDetailDrawer}/>;
      case 3: return <Calendar />;
      default: return;
    }
  };
  openDetailDrawer = (detailType, detailId) => {
    let drawerWidth = 0;
    switch (detailType) {
      default: return;
      case DetailContentType.ANNOUNCE:
      case DetailContentType.APPEAL:
        drawerWidth = 480;
        break;
      case DetailContentType.PROCUREMENT_ORDER:
      case DetailContentType.SALE_ORDER:
        drawerWidth = 600;
        break;
    }
    this.setState({openDrawer: true, drawerWidth, detailId});
  };

  closeDetailDrawer = () => this.setState({openDrawer: false, drawerWidth: 0, detailId: null});

  render() {
    const {detailId, drawerWidth, openDrawer} = this.state;
    return (
      <div className="work-panel">
        <this.TabBar/>
        <this.PanelContent />
        <Drawer
          width={drawerWidth}
          openSecondary={true}
          open={openDrawer}
          docked={false}
          overlayStyle={{backgroundColor: 'transparent'}}
          onRequestChange={open => this.setState({openDrawer: open})}>
          <Detail id={detailId} close={this.closeDetailDrawer}/>
        </Drawer>
      </div>
    );
  }
}
