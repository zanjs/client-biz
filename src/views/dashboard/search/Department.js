import React from 'react';
import {connect} from 'react-redux';
import {observer} from 'mobx-react';
import {observable, computed, action, runInAction, extendObservable} from 'mobx';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MerchantSvc from '../../../services/merchant';
import BaseSvc from '../../../services/baseData';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import CircularProgress from 'material-ui/CircularProgress';

class MerchantMemberStore {
  constructor() {
    extendObservable(this, {
      departmentList: [],
      memberList: [],
    });
  }
  load = action(async () => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await BaseSvc.getDepartmentList();
      runInAction('after load', () => {
        if (resp.code == 0 && resp.data) this.departmentList = [...resp.data];
      });
      console.log(resp);
    } catch (e) {
      console.log(e, 'load invite message');
    }
    this.loading = false;
  });
}

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="操作"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);


const MessageList = ({listData, headerTxt, loading, serviceAction, actionType, onToast}) => {
  return (
    <List className='search-list'>
      <div style={{backgroundColor: '#FFF'}}>
        <Subheader >{headerTxt}</Subheader>
        {loading && <CircularProgress size={28} style={{display: 'block', margin: '0 auto 20px auto'}}/>}
        {!(listData && listData.length) && !loading && <p className="none-data" style={{textAlign: 'center'}}>暂无内容</p>}
        {(listData && listData.length > 0) && <Divider inset={true} />}
      </div>
      <div style={{overflowY: 'auto', overflowX: 'hidden',backgroundColor: '#FFF'}}>
        {
          listData && listData.map((item, index) => (
            <div key={index}>
              <ListItem
                leftIcon={<ContentDrafts />}
                rightIconButton={(
                  <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem onTouchTap={() => serviceAction(item.id, actionType.ACCEPT, onToast)}>同意</MenuItem>
                    <MenuItem onTouchTap={() => serviceAction(item.id, actionType.REFUSE, onToast)}>拒绝</MenuItem>
                  </IconMenu>
                )}
                primaryText={item.username || `用户ID: ${item.user_id}`}
                secondaryText={
                  <p>
                    <span style={{color: darkBlack}}>申请加入</span><br />
                    {item.create_time}
                  </p>
                }
                secondaryTextLines={2}
              />
              {(listData.length && ((listData.length - 1) !== index)) && <Divider inset={true} />}
            </div>
          ))
        }
      </div>
    </List>
  );
};

class MessageContainer extends React.Component {
  store = new MerchantMemberStore();
  componentWillMount() {
    this.store.load();
  }
  render() {
    return (
      <div className="search-content">
        <div style={{flex: 1}}>成员</div>
        <div style={{flex: 1}}>部门</div>
        <div style={{flex: 1}}/>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    currentUser: state.account.currentUser,
  }
};

const Message = connect(mapStateToProps)(observer(MessageContainer));

export default Message;