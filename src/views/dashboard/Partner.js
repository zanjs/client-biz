import React from 'react';
// import {Tabs, Tab} from 'material-ui/Tabs';
import FontIcon from 'material-ui/FontIcon';

const TABS = {
  APPLY: '用户申请',
  INVITE: '商户邀请',
  DRAFT: '未发送邮件',
  BILLS: '单据',
};

export default class Search extends React.PureComponent {
  state={
    tabValue: TABS.APPLY,
  };
  handleTabsChange = tabValue => this.setState({ tabValue });

  TabBar = () => {
    // const {tabValue} = this.state;
    // const tabStyle = {color: '#777', fontSize: 16};
    return (
      <div className="panel-nav">
        <a className="title" style={{boxSizing: 'border-box', paddingRight: 10}}>
          <FontIcon className="material-icons" color="#333">dashboard</FontIcon>
          <span>合作伙伴</span>
        </a>
        {/*<Tabs onChange={this.handleTabsChange} value={tabValue}*/}
              {/*style={{flex: 1, margin: '0 20px', maxWidth: 400, minWidth: 200}}*/}
              {/*tabItemContainerStyle={{backgroundColor: '#FFF'}}>*/}
          {/*<Tab label="申请" value={TABS.APPLY} style={tabStyle}/>*/}
          {/*<Tab label="邀请" value={TABS.INVITE} style={tabStyle}/>*/}
          {/*<Tab label="邮件" value={TABS.DRAFT} style={tabStyle}/>*/}
          {/*<Tab label="单据" value={TABS.BILLS} style={tabStyle}/>*/}
        {/*</Tabs>*/}
        {/*<div className="defaultRight" style={{width: 110, height: 50}}/>*/}
      </div>
    );
  };

  render() {
    let content = <p>合作伙伴</p>;
    return (
      <div style={{flex: 1}}>
        <this.TabBar />
        <div className="main-board">
          {content}
        </div>
      </div>
    );
  }
}