import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import {Message, Merchant, Mail} from './search/index';

const TABS = {
  MESSAGE: 1,
  MERCHANT: 2,
  MAIL: 3,
};

export default class Search extends React.PureComponent {
  state={
    tabValue: TABS.MERCHANT,
  };
  handleTabsChange = tabValue => this.setState({ tabValue });

  TabBar = () => {
    const {tabValue} = this.state;
    const tabStyle = {color: '#777', fontSize: 16};
    return (
      <div className="panel-nav">
        <a className="title" style={{boxSizing: 'border-box', paddingRight: 10}}>
          <FontIcon className="material-icons" color="#333">dashboard</FontIcon>
          <span>我的查询</span>
        </a>
        <Tabs onChange={this.handleTabsChange} value={tabValue}
              style={{flex: 1, margin: '0 20px', maxWidth: 400, minWidth: 200}}
              tabItemContainerStyle={{backgroundColor: '#FFF'}}>
          <Tab label="商户" value={TABS.MERCHANT} style={tabStyle}/>
          <Tab label="邮箱" value={TABS.MAIL} style={tabStyle}/>
          <Tab label="通知" value={TABS.MESSAGE} style={tabStyle}/>
        </Tabs>
        <div className="defaultRight" style={{width: 110, height: 50}}/>
      </div>
    );
  };

  renderContent = () => {
    switch (this.state.tabValue) {
      default: return null;
      case TABS.MESSAGE: return <Message />;
      case TABS.MERCHANT: return <Merchant />;
      case TABS.MAIL: return <Mail />;
    }
  };

  render() {
    return (
      <div className="search-layout">
        <this.TabBar />
        {this.renderContent()}
      </div>
    );
  }
}