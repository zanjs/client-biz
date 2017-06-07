import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import MainBoard from './main/MainBoard';
import ProcurementBoard from './procurement/ProcurementBoard';
import SaleBoard from './sale/SaleBoard';
import Calendar from './calendar/Calendar';

export default class MainDashboard extends React.PureComponent {
  state={
    activeTab: 0,
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

  render() {
    return (
      <div className="work-panel">
        <this.TabBar/>
        <this.PanelContent />
      </div>
    );
  }
}
