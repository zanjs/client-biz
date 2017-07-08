import React from 'react';
import {observer, inject} from 'mobx-react';
import {observable, action, runInAction} from 'mobx';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import {grey400, darkBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import BaseSvc from '../../../services/baseData';
import MerchantSvc from '../../../services/merchant';
import MemberIcon from 'material-ui/svg-icons/action/face';
import MerchantIcon from 'material-ui/svg-icons/maps/local-mall';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {ToastStore as Toast} from "../../../components/Toast";
import {BizDialog} from "../../../components/Dialog";
import DialogForm from "../../items/DialogForm";

class MerchantListStore {
  @observable merchantList = [];
  @observable loading = false;
  @action load = async () => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await MerchantSvc.getMerchantListByUser();
      runInAction('after load', () => {
        if (resp.code === '0' && resp.data) this.merchantList = [...resp.data];
      });
      console.log(resp);
    } catch (e) {
      console.log(e, 'load user merchant list');
    }
    this.loading = false;
  }
}

class MerchantMemberStore {
  @observable memberList = [];
  @observable loading = false;
  @action load = async () => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await MerchantSvc.getUserListByMerchant();
      runInAction('after load', () => {
        if (resp.code === '0' && resp.data) this.memberList = [...resp.data];
      });
      console.log(resp);
    } catch (e) {
      console.log(e, 'load merchant member list');
    }
    this.loading = false;
  }
}

class DepartmentStore {
  @observable departmentList = [];
  @observable loading = false;
  @action load = async () => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await BaseSvc.getDepartmentList();
      runInAction('after load', () => {
        if (resp.code === '0' && resp.data) this.departmentList = [...resp.data];
      });
      console.log(resp);
    } catch (e) {
      console.log(e, 'load merchant department list');
    }
    this.loading = false;
  }
}

@inject('user')
@observer
export default class MerchantInfo extends React.Component {
  memberStore = new MerchantMemberStore();
  merchantListStore = new MerchantListStore();
  departmentStore = new DepartmentStore();
  componentWillMount() {
    this.memberStore.load();
    this.merchantListStore.load();
  }
  switchMerchant = async (id) => {
    if (this.submitting) return;
    this.submitting = true;
    try {
      const require_userinfo = 1;
      const resp = await MerchantSvc.switchMerchant(id, require_userinfo);
      console.log(resp);
      if (resp.code === '0') {
        this.props.user.update(resp.data);
        Toast.show('切换商户成功')
      } else Toast.show(resp.msg || '切换商户失败，请稍后重试');
    } catch (e) {
      console.log(e, 'switch merchant');
      Toast.show('切换商户失败，请稍后重试')
    }
    this.submitting = false;
  };
  render() {
    return (
      <div className="search-content">
        <MerchantList headerTxt="已加入商户列表" listData={this.merchantListStore.merchantList} loading={this.merchantListStore.loading} switchMerchant={this.switchMerchant}/>
        <MemberList headerTxt="当前商户成员" listData={this.memberStore.memberList} loading={this.memberStore.loading}/>
        <DepartmentList headerTxt="部门" listData={this.departmentStore.departmentList} loading={this.departmentStore.loading}/>
      </div>
    );
  }
}

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="操作"
    tooltipPosition="bottom-left" // top-center
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);


const MemberList = ({listData, headerTxt, loading}) => {
  const openInviteDialog = () => BizDialog.onOpen('邀请用户', <DialogForm type='invite' hintTxt="请输入用户的账号" submitTxt="邀请"/>);
  return (
    <List className='search-list'>
      <div style={{backgroundColor: '#FFF'}}>
        <Subheader >{headerTxt}</Subheader>
        {loading && <CircularProgress size={28} style={{display: 'block', margin: '0 auto 20px auto'}}/>}
        {!(listData && listData.length) && !loading && <p className="none-data" style={{textAlign: 'center'}}>商户暂无成员</p>}
        {(listData && listData.length > 0) && <Divider inset={true} />}
      </div>
      <div style={{overflowY: 'auto', overflowX: 'hidden',backgroundColor: '#FFF'}}>
        {
          listData && listData.map((item, index) => (
            <div key={index}>
              <ListItem
                leftIcon={<MemberIcon />}
                rightIconButton={(
                  <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem onTouchTap={() => {}}>查看</MenuItem>
                    <MenuItem onTouchTap={() => {}}>复制账号</MenuItem>
                    <MenuItem onTouchTap={() => {}}>移除</MenuItem>
                  </IconMenu>
                )}
                primaryText={item.username || `用户名: ${item.user_name}`}
                secondaryText={<p style={{maxWidth: 185}}>账号: {item.account}</p>}
                secondaryTextLines={2}
              />
              {(listData.length && ((listData.length - 1) !== index)) && <Divider inset={true} />}
            </div>
          ))
        }
      </div>
      <Divider inset={true} />
      <div style={{backgroundColor: '#FFF', textAlign: 'right'}}>
        <FlatButton label="邀请用户" primary={true} onTouchTap={openInviteDialog}/>
      </div>
    </List>
  );
};

const MerchantList = ({listData, headerTxt, loading, switchMerchant}) => {
  const openApplyDialog = () => BizDialog.onOpen('加入商户', <DialogForm type='apply' hintTxt="请输入商户的ID" submitTxt="申请"/>);
  return (
    <List className='search-list'>
      <div style={{backgroundColor: '#FFF'}}>
        <Subheader >{headerTxt}</Subheader>
        {loading && <CircularProgress size={28} style={{display: 'block', margin: '0 auto 20px auto'}}/>}
        {!(listData && listData.length) && !loading && <p className="none-data" style={{textAlign: 'center'}}>暂未加入其他商户</p>}
        {(listData && listData.length > 0) && <Divider inset={true} />}
      </div>
      <div style={{overflowY: 'auto', overflowX: 'hidden',backgroundColor: '#FFF'}}>
        {
          listData && listData.map((item, index) => (
            <div key={index}>
              <ListItem
                leftIcon={<MerchantIcon />}
                rightIconButton={(
                  <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem onTouchTap={switchMerchant.bind(null, item.mer_id)}>切换至该商户</MenuItem>
                    <MenuItem onTouchTap={() => {}}>退出</MenuItem>
                  </IconMenu>
                )}
                primaryText={item.username || `商户名称: ${item.mer_name}`}
                secondaryText={
                  <p>
                    <span style={{color: darkBlack}}>id: {item.mer_id}</span><br />
                    {item.create_time} 加入
                  </p>
                }
                secondaryTextLines={2}
              />
              {(listData.length && ((listData.length - 1) !== index)) && <Divider inset={true} />}
            </div>
          ))
        }
      </div>
      <Divider inset={true} />
      <div style={{backgroundColor: '#FFF', textAlign: 'right'}}>
        <FlatButton label="加入商户" primary={true} onTouchTap={openApplyDialog}/>
      </div>
    </List>
  );
};

const DepartmentList = ({listData, headerTxt, loading}) => {
  return (
    <List className='search-list'>
      <div style={{backgroundColor: '#FFF'}}>
        <Subheader >{headerTxt}</Subheader>
        {loading && <CircularProgress size={28} style={{display: 'block', margin: '0 auto 20px auto'}}/>}
        {!(listData && listData.length) && !loading && <p className="none-data" style={{textAlign: 'center'}}>商户暂无部门</p>}
        {(listData && listData.length > 0) && <Divider inset={true} />}
      </div>
      <div style={{overflowY: 'auto', overflowX: 'hidden',backgroundColor: '#FFF'}}>
        {
          listData && listData.map((item, index) => (
            <div key={index}>
              <ListItem
                leftIcon={<MerchantIcon />}
                rightIconButton={(
                  <IconMenu iconButtonElement={iconButtonElement}>
                    <MenuItem onTouchTap={() => {}}>修改</MenuItem>
                    <MenuItem onTouchTap={() => {}}>删除</MenuItem>
                  </IconMenu>
                )}
                primaryText={item.username || `商户名称: ${item.mer_name}`}
                secondaryText={
                  <p>
                    <span style={{color: darkBlack}}>id: {item.mer_id}</span><br />
                    {item.create_time} 加入
                  </p>
                }
                secondaryTextLines={2}
              />
              {(listData.length && ((listData.length - 1) !== index)) && <Divider inset={true} />}
            </div>
          ))
        }
      </div>
      <Divider inset={true} />
      <div style={{backgroundColor: '#FFF', textAlign: 'right'}}>
        <FlatButton label="添加部门" primary={true} />
      </div>
    </List>
  );
};

