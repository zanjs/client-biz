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
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import CircularProgress from 'material-ui/CircularProgress';

class applyMessageStore {
  constructor() {
    extendObservable(this, {
      messages: [],
      applyDS: computed(() => this.messages.filter(m => !m.accept_time)),
      loading: false,
    });
  }
  load = action(async (id) => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await MerchantSvc.getUserListByApply(id);
      runInAction('after load', () => {
        if (resp.code == 0 && resp.data) this.messages = [...resp.data];
      });
      console.log(resp);
    } catch (e) {
      console.log(e, 'load invite message');
    }
    this.loading = false;
  });

  serviceType = {
    ACCEPT: 'accept',
    REFUSE: 'refuse',
  };

  applyAction = action(async (id, type, onToast) => {
    if (this.submitting || !id) return;
    this.submitting = true;
    try {
      let service = null;
      switch (type) {
        default: return;
        case this.serviceType.ACCEPT: service = MerchantSvc.acceptUserApply; break;
        case this.serviceType.REFUSE: service = MerchantSvc.refuseUserApply; break;
      }
      const resp = await service(id);
      console.log(resp, type);
      runInAction('after accept', () => {
        if (resp.code == 0) {
          this.messages = [...this.messages.filter(m => m.id !== id)]
        } else {
          onToast && onToast(resp.msg || '抱歉，提交失败，请稍后重试');
        }
      });
    } catch (e) {
      console.log(e, 'accept user apply');
      onToast && onToast('抱歉，发生未知错误，请稍后重试');
    }
    this.submitting = false;
  });
}

class inviteMessageStore {
  constructor() {
    extendObservable(this, {
      messages: [],
      inviteDS: computed(() => this.messages.filter(m => !m.accept)),
      loading: false,
    });
  }
  load = action(async (id) => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await MerchantSvc.getMerchantListByInvite(id);
      console.log(resp, 'invite list');
      runInAction('after load', () => {
        if (resp.code == 0 && resp.data) this.messages = [...resp.data];
      });
    } catch (e) {
      console.log(e, 'load invite message');
    }
    this.loading = false;
  });

  serviceType = {
    ACCEPT: 'accept',
    REFUSE: 'refuse',
  };

  handleInviteAction = action(async (id, type, onToast) => {
    if (this.submitting || !id) return;
    this.submitting = true;
    try {
      let service = null;
      switch (type) {
        default: return;
        case this.serviceType.ACCEPT: service = MerchantSvc.acceptUserApply; break;
        case this.serviceType.REFUSE: service = MerchantSvc.refuseUserApply; break;
      }
      const resp = await service(id);
      console.log(resp, type);
      runInAction('after accept', () => {
        if (resp.code == 0) {
          this.messages = [...this.messages.filter(m => m.id !== id)]
        } else {
          onToast && onToast(resp.msg || '抱歉，提交失败，请稍后重试');
        }
      });
    } catch (e) {
      console.log(e, 'accept user apply');
      onToast && onToast('抱歉，发生未知错误，请稍后重试');
    }
    this.submitting = false;
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
  isAdmin = this.props.currentUser && (this.props.currentUser.is_admin === 1);
  notJoinMerchant = !(this.props.currentUser && this.props.currentUser.mer_id);
  applyStore = this.isAdmin && new applyMessageStore();
  inviteStore = this.notJoinMerchant && new inviteMessageStore();

  componentWillMount() {
    const { currentUser } = this.props;
    if (!currentUser) return;
    if (this.isAdmin) this.applyStore.load(currentUser.mer_id);
    if (this.notJoinMerchant) this.inviteStore.load(currentUser.id);
  }

  render() {
    return (
      <div className="search-content">
        {this.isAdmin && (
          <MessageList headerTxt="用户申请" listData={this.applyStore.applyDS} loading={this.applyStore.loading}
                       serviceAction={this.applyStore.applyAction} actionType={this.applyStore.serviceType}
                       onToast={this.props.onToast}/>
        )}
        {this.notJoinMerchant && (
          <MessageList headerTxt="商户邀请" listData={this.inviteStore.messages} loading={this.inviteStore.loading}
                       serviceAction={this.inviteStore.handleInviteAction} actionType={this.inviteStore.serviceType}
                       onToast={this.props.onToast}/>
        )}
        <div style={{flex: 1}}/>
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