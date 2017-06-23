import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import MainBoard from './main/MainBoard';
import ProcurementBoard from './procurement/ProcurementBoard';
import SaleBoard from './sale/SaleBoard';
import Calendar from './calendar/Calendar';
import Drawer from 'material-ui/Drawer';
import {DetailContentType} from "../../services/data-type";
import {Detail} from "../../components/Detail"
import {Tabs, Tab} from 'material-ui/Tabs';


export default class MainDashboard extends React.PureComponent {
  state={
    tabValue: 0,
    openDrawer: false,
    drawerWidth: 0,
    detailId: null,
  };

  handleTabsChange = tabValue => this.setState({ tabValue });

  TabBar = () => {
    const {tabValue} = this.state;
    const tabStyle = {color: '#777', fontSize: 16};
    return (
      <div className="panel-nav">
        <a className="title">
          <FontIcon className="material-icons" color="#333">dashboard</FontIcon>
          <span>我的工作台</span>
        </a>
        <Tabs onChange={this.handleTabsChange} value={tabValue}
              style={{flex: 1, margin: '0 20px', maxWidth: 400, minWidth: 200}}
              tabItemContainerStyle={{backgroundColor: '#FFF'}}>
          <Tab label="看板" value={0} style={tabStyle}/>
          <Tab label="采购" value={1} style={tabStyle}/>
          <Tab label="销售" value={2} style={tabStyle}/>
          <Tab label="日历" value={3} style={tabStyle}/>
        </Tabs>
        <div className="defaultRight" style={{width: 110, height: 50}}/>
      </div>
    );
  };

  PanelContent = () => {
    switch (this.state.tabValue) {
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
        drawerWidth = 500;
        break;
      case DetailContentType.PROCUREMENT_ORDER:
      case DetailContentType.SALE_ORDER:
        drawerWidth = 620;
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
