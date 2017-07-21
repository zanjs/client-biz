import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import MainBoard from './main/MainBoard';
import ProcurementBoard from './procurement/ProcurementBoard';
import SaleBoard from './sale/SaleBoard';
import FinancialBoard from './financial/FinancialBoard';
// import Calendar from './calendar/Calendar';
import {Tabs, Tab} from 'material-ui/Tabs';


export default class MainDashboard extends React.PureComponent {
  state={ tabValue: 0 };

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
          <Tab label="结算" value={3} style={tabStyle}/>
        </Tabs>
        <div className="defaultRight" style={{width: 110, height: 50}}/>
      </div>
    );
  };

  PanelContent = () => {
    switch (this.state.tabValue) {
      case 0: return <MainBoard />;
      case 1: return <ProcurementBoard />;
      case 2: return <SaleBoard />;
      case 3: return <FinancialBoard />;
      default: return;
    }
  };

  render() {
    return (
      <div className="work-panel">
        <this.TabBar/>
        <this.PanelContent />
      </div>
    );
  }
}
