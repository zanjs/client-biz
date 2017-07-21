import React from 'react';
import {observer, inject} from 'mobx-react';
import {observable, computed, action, runInAction} from 'mobx';
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
import DepartmentIcon from 'material-ui/svg-icons/action/perm-contact-calendar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import {ToastStore as Toast} from "../../../components/Toast";
import {BizDialog, ComfirmDialog} from "../../../components/Dialog";
import DialogForm from "../../items/DialogForm";
import MemberStore from "../../stores/merchantMember";
import UserDetail, {SetDepartment} from '../../items/UserDetail';
import Storage from '../../../utils/storage';

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
        else Toast.show(resp.msg || '抱歉，发生未知错误，请刷新页面稍后重试');
      });
    } catch (e) {
      console.log(e, 'load user merchant list');
      Toast.show('抱歉，发生未知错误，请刷新页面稍后重试');
    }
    this.loading = false;
  };
  @action quitMerchant = async (merchant) => {
    if (this.quiting) return;
    this.quiting = true;
    try {
      const resp = await MerchantSvc.quitMerchant(merchant.mer_id);
      runInAction('after quite', () => {
        if (resp.code === '0') {
          this.merchantList = this.merchantList.filter(m => m.mer_id !== merchant.mer_id);
          Toast.show('退出成功');
          BizDialog.onClose();
          console.log(Storage.getValue('user'));
          if (merchant.mer_id === Storage.getValue('user').mer_id) {
            MemberStore.load();
            MerchantDepartment.load();
          }
        } else Toast.show(resp.msg || '抱歉，退出失败，请刷新页面后重新尝试');
      });
    } catch (e) {
      console.log(e, 'quite merchat');
    }
    this.quiting = false;
  };
}

class DepartmentStore {
  @observable departmentList = [];
  @observable nestedDepartment = {};
  @observable loading = false;
  @observable name = '';
  @observable parent_id = '';
  @observable id = '';
  @observable remark = '';
  @observable adding = false;
  @observable editing = false;
  @observable landed = false;

  @computed get validated() {
    const idValidated = this.parent_id ? this.parent_id >= 0 : true;
    return !!this.name && idValidated;
  }

  @action setName = val => this.name = val || '';
  @action setParentId = id => this.parent_id = (id >= 0 ? parseInt(id, 10) : '');
  @action setRemark = val => this.remark = val || '';

  @action load = async () => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await BaseSvc.getDepartmentList();
      runInAction('after load', () => {
        if (resp.code === '0' && resp.data) this.departmentList = [...resp.data];
        else Toast.show(resp.msg || '抱歉，发生未知错误，请刷新页面稍后重试');
      });
    } catch (e) {
      console.log(e, 'load merchant department list');
      Toast.show('抱歉，发生未知错误，请刷新页面稍后重试');
    }
    this.loading = false;
    if (!this.landed) this.landed = true;
  };

  @action add = async () => {
    if (this.adding || !this.validated) return;
    this.adding = true;
    try {
      const resp = await BaseSvc.addDepartment(this.name, this.parent_id);
      runInAction('after add dep', () => {
        if (resp.code === '0') {
          this.clearDepInfo();
          this.load();
          BizDialog.onClose();
          Toast.show('创建成功');
        } else Toast.show(resp.msg || '抱歉，创建失败，请稍后重试');
      });
    } catch (e) {
      console.log(e);
      Toast.show('抱歉，发生未知错误，请刷新页面稍后重试');
    }
    this.adding = false;
  };
  @action delete = async (item) => {
    if (this.deleting || !item) return;
    this.deleting = true;
    try {
      const resp = await BaseSvc.delDepartment(item.id);
      runInAction('after delete dep', () => {
        if (resp.code === '0') {
          this.departmentList = this.departmentList.filter(dep => dep.id !== item.id);
          if (item.parent_id) {
            this.nestedDepartment[item.parent_id] = [];
            this.nestedDepartment = {...this.nestedDepartment};
          }
          Toast.show('删除成功');
          BizDialog.onClose();
        } else Toast.show(resp.msg || '抱歉，删除失败，请刷新页面稍后重试');
      });
    } catch (e) {
      console.log(e, 'delete dep');
      Toast.show('抱歉，发生未知错误，请刷新页面稍后重试');
    }
    this.deleting = false;
  };
  @action openEditDepDialog = item => {
    console.log(item);
    if (!item) return;
    this.name = item.name || '';
    this.id = item.id || '';
    this.remark = item.remark || '';
    this.parent_id = item.parent_id || '';
    BizDialog.onOpen('部门', <AddDepartment/>);
  };
  @action clearDepInfo = () => {
    this.id = '';
    this.name = '';
    this.remark = '';
    this.parent_id = '';
  };
  @action edit = async () => {
    if (this.editing || !this.validated) return;
    this.editing = true;
    try {
      const resp = await BaseSvc.updateDepartment(this.id, this.name, this.parent_id, this.remark);
      runInAction('after update dep', () => {
        if (resp.code === '0') {
          if (this.parent_id) this.searchChild(this.parent_id);
          this.clearDepInfo();
          this.load();
          BizDialog.onClose();
          Toast.show('更新成功');
        } else Toast.show(resp.msg || '抱歉，更新失败，请刷新页面稍后重试')
      });
    } catch (e) {
      console.log(e, 'edit dep');
      Toast.show('抱歉，发生未知错误，请刷新页面稍后重试');
    }
    this.editing = false;
  };
  @action searchChild = async (id) => {
    if (this.searching || !id) return;
    this.searching = true;
    try {
      const resp = await BaseSvc.getDepartment(null, id);
      runInAction('after get child dep', () => {
        if (resp.code === '0') {
          if (!!resp.data.length) {
            this.nestedDepartment[id] = resp.data;
            this.nestedDepartment = {...this.nestedDepartment};
            Toast.show('查询成功');
          } else Toast.show('该部门尚无下属部门');
        } else Toast.show(resp.msg || '抱歉，查询失败，请刷新页面稍后重试');
      })
    } catch (e) {
      console.log(e, 'search dep detail');
      Toast.show('抱歉，发生未知错误，请刷新页面稍后重试');
    }
    this.searching = false;
  }
}

const MerchantDepartment = new DepartmentStore();

@inject('user')
@observer
export default class MerchantInfo extends React.Component {
  memberStore = MemberStore;
  merchantListStore = new MerchantListStore();
  departmentStore = MerchantDepartment;
  componentWillMount() {
    this.memberStore.load();
    this.merchantListStore.load();
    this.departmentStore.load();
  }
  switchMerchant = async (id) => {
    if (this.submitting) return;
    this.submitting = true;
    try {
      const require_userinfo = 1;
      const resp = await MerchantSvc.switchMerchant(id, require_userinfo);
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
        <MerchantList headerTxt={`已加入商户列表(当前id: ${this.props.user.user.current.mer_id})`}
                      listData={this.merchantListStore.merchantList} loading={this.merchantListStore.loading}
                      quitMerchant={this.merchantListStore.quitMerchant}
                      switchMerchant={this.switchMerchant} currentUser={this.props.user.user.current}/>
        <MemberList headerTxt="当前商户成员" listData={this.memberStore.memberList} loading={this.memberStore.loading}
                    currentUser={this.props.user.user.current} deleteUser={this.memberStore.delete}/>
        <DepartmentList headerTxt="部门" listData={this.departmentStore.departmentList} loading={!this.departmentStore.landed}
                        currentUser={this.props.user.user.current}/>
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


const MemberList = ({listData, headerTxt, loading, currentUser, deleteUser}) => {
  const isAdmin = currentUser && (currentUser.is_admin === 1);
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
                    <MenuItem onTouchTap={() => BizDialog.onOpen('用户资料', <UserDetail user={item}/>)}>查看</MenuItem>
                    {isAdmin && <MenuItem onTouchTap={() => BizDialog.onOpen('设置部门',
                      <SetDepartment user={item}/>)}>设置部门</MenuItem>}
                    {isAdmin && <MenuItem onTouchTap={() => BizDialog.onOpen('移出商户',
                      <ComfirmDialog submitAction={deleteUser.bind(null, item)}/>)}>移出商户</MenuItem>}
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
      {
        isAdmin && (
          <div style={{backgroundColor: '#FFF', textAlign: 'right'}}>
            <Divider inset={true} />
            <FlatButton label="邀请用户" primary={true} onTouchTap={openInviteDialog}/>
          </div>
        )
      }
    </List>
  );
};

const MerchantList = ({listData, headerTxt, loading, switchMerchant, currentUser, quitMerchant}) => {
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
                rightIconButton={<IconMenu iconButtonElement={iconButtonElement}>
                  {(currentUser && !currentUser.is_admin) && <MenuItem onTouchTap={switchMerchant.bind(null, item.mer_id)}>切换至该商户</MenuItem>}
                    <MenuItem onTouchTap={() => BizDialog.onOpen('确认退出',
                      <ComfirmDialog submitAction={quitMerchant.bind(null, item)}/>)}>退出该商户</MenuItem>
                  </IconMenu>}
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
      <div style={{backgroundColor: '#FFF', textAlign: 'right'}}>
        <Divider inset={true} />
        <FlatButton label="加入商户" primary={true} onTouchTap={openApplyDialog}/>
      </div>
    </List>
  );
};


const DepartmentList = ({listData, headerTxt, loading, currentUser}) => {
  const isAdmin = currentUser && (currentUser.is_admin === 1);
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
            <DepartmentItem key={index} item={item} isAdmin={isAdmin} noDivider={listData.length && ((listData.length - 1) !== index)}/>
          ))
        }
      </div>
      {isAdmin && (
        <div style={{backgroundColor: '#FFF', textAlign: 'right'}}>
          <Divider inset={true} />
          <FlatButton label="添加部门" primary={true} onTouchTap={() => BizDialog.onOpen('创建部门', <AddDepartment/>)}/>
        </div>
      )}
    </List>
  );
};

@observer
class DepartmentItem extends React.Component {
  store = MerchantDepartment;
  render() {
    const {item, isAdmin, noDivider, isNested} = this.props;
    const nestStyle = isNested ? {paddingLeft: 5, borderTop: '1px solid #E6E6E6'} : {};
    return (
      <div style={nestStyle}>
        <ListItem
          leftIcon={<DepartmentIcon />}
          rightIconButton={(
            <IconMenu iconButtonElement={iconButtonElement}>
              <MenuItem onTouchTap={() => this.store.openEditDepDialog(item)}>{isAdmin ? '查看/编辑' : '查看'}</MenuItem>
              <MenuItem onTouchTap={() => this.store.searchChild(item.id)}>查询下属部门</MenuItem>
              {isAdmin && <MenuItem onTouchTap={() => {
                this.store.setParentId(item.id);
                BizDialog.onOpen('创建部门', <AddDepartment/>);
              }}>创建下属部门</MenuItem>}
              {isAdmin && <MenuItem onTouchTap={() => BizDialog.onOpen('确认删除',
                <ComfirmDialog submitAction={this.store.delete.bind(null, item)}/>)}>删除</MenuItem>}
            </IconMenu>
          )}
          primaryText={`${isNested ? '子部门' : '部门'}: ${item.name}`}
          secondaryText={
            <p>
              <span style={{color: darkBlack}}>id: {item.id}</span><br />
              {`备注：${item.remark || '暂无'}`}
            </p>
          }
          secondaryTextLines={2}
          initiallyOpen={true}
          primaryTogglesNestedList={true}
          nestedItems={this.store.nestedDepartment[item.id] && this.store.nestedDepartment[item.id].map((nestedItem, index) => (
            <DepartmentItem key={index} item={nestedItem} isNested isAdmin={isAdmin}
                            noDivider={this.store.nestedDepartment[item.id] && ((this.store.nestedDepartment[item.id].length - 1) !== index)}/>
          ))}
        />
        {noDivider && <Divider inset={true} />}
      </div>
    )
  }
}

@inject('user')
@observer
class AddDepartment extends React.Component {
  store = MerchantDepartment;
  currentUser = this.props.user.user.current;
  render() {
    const isAdmin = this.currentUser && (this.currentUser.is_admin === 1);
    const submitTxt = this.store.id ? '修改' : '提交';
    const closeTxt = isAdmin ? '取消' : '关闭';
    const loading = this.store.id ? this.store.editing : this.store.adding;
    const submitAction = this.store.id ? this.store.edit : this.store.add;
    return (
      <form onSubmit={this.store.add} style={{paddingTop: 10}}>
        <TextField floatingLabelText="请输入部门名称(必填)" value={this.store.name} type="text"
                   readOnly={!isAdmin}
                   style={{marginRight: 20}}
                   onChange={e => this.store.setName(e.target.value)}/>
        <TextField floatingLabelText="上级部门id" value={this.store.parent_id} type="number"
                   readOnly={!isAdmin}
                   onChange={e => this.store.setParentId(e.target.value)}/>
        {this.store.id && (
          <TextField floatingLabelText="备注" value={this.store.remark} type="text"
                     readOnly={!isAdmin}
                     onChange={e => this.store.setRemark(e.target.value)}/>
        )}
        <br/><br/>
        <div style={{textAlign: 'right'}}>
          {isAdmin && (
            <RaisedButton label={loading ? null : submitTxt} primary={this.store.validated}
                          onTouchTap={submitAction} disabled={!this.store.validated}
                          icon={loading ? <CircularProgress size={28}/> : null}/>
          )}
          <RaisedButton label={closeTxt} onTouchTap={BizDialog.onClose} style={{marginLeft: 20}}/>
        </div>
      </form>
    );
  }
}


