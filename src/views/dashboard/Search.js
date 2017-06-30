import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';
import {Message, Department} from './search/index';
import Toast from "../../components/Toast";

const TABS = {
  MESSAGE: '通知',
  DEPARTMENT: '部门',
  DRAFT: '未发送邮件',
  BILLS: '单据',
};

export default class Search extends React.PureComponent {
  state={
    tabValue: TABS.MESSAGE,
  };
  handleTabsChange = tabValue => this.setState({ tabValue });
  onToast = txt => this.refs.toast && this.refs.toast.show(txt);

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
          <Tab label="通知" value={TABS.MESSAGE} style={tabStyle}/>
          <Tab label="部门" value={TABS.DEPARTMENT} style={tabStyle}/>
          <Tab label="邮件" value={TABS.DRAFT} style={tabStyle}/>
          <Tab label="单据" value={TABS.BILLS} style={tabStyle}/>
        </Tabs>
        <div className="defaultRight" style={{width: 110, height: 50}}/>
      </div>
    );
  };

  renderContent = () => {
    switch (this.state.tabValue) {
      default: return null;
      case TABS.MESSAGE: return <Message onToast={this.onToast}/>;
      case TABS.DEPARTMENT: return <Department onToast={this.onToast}/>;
      case TABS.DRAFT: return <p>未发送邮件</p>;
      case TABS.BILLS: return <p>单据</p>;
    }
  };

  render() {
    return (
      <div className="search-layout">
        <this.TabBar />
        {this.renderContent()}
        <Toast ref="toast"/>
      </div>
    );
  }
}