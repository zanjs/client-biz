import React from 'react';
import { observer, inject } from 'mobx-react';
import {observable, computed, action, runInAction} from 'mobx';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import {grey400} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MailIcon from 'material-ui/svg-icons/content/mail';
import PartnerIcon from 'material-ui/svg-icons/social/group';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {ToastStore as Toast} from "../../components/Toast";
import PartnerSvc from "../../services/partner";
import {BizDialog} from "../../components/Dialog";
import AddPartner from "../items/AddPartner";
import partnerStore from '../stores/partners';

const ListType = {
  PARTNERS: 0,
  INVITE: 1,
};

class Invitations {
  @observable rawDS = [];
  @observable loading = false;

  @computed get DS() {
    return this.rawDS.filter(item => !item.accept_status);
  }

  @action load = async () => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await PartnerSvc.getInviteList();
      runInAction('after load invite', () => {
        if (resp.code === '0' && resp.data) {
          this.rawDS = resp.data;
        } else Toast.show(resp.msg);
      })
    } catch (e) {
      console.log(e, 'load partner invite');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.loading = false;
  };

  @action accept = async (item) => {
    if (this.accepting || !item) return;
    this.accepting = true;
    try {
      const id = item.src_mer_id;
      const resp = await PartnerSvc.accept(id);
      runInAction('after accept', () => {
        if (resp.code === '0') {
          this.rawDS = this.rawDS.filter(item => item.src_mer_id !== id);
          partnerStore.load();
          Toast.show('已接受合作邀请');
        }else Toast.show(resp.msg || '抱歉，操作失败，请稍后重试');
      });
    } catch (e) {
      console.log(e, 'accept partner invite');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.accepting = false;
  };

  @action refuse = async (item) => {
    if (this.refusing || !item) return;
    this.refusing = true;
    try {
      const id = item.src_mer_id;
      const resp = await PartnerSvc.refuse(id);
      runInAction('after refuse', () => {
        if (resp.code === '0') {
          this.rawDS = this.rawDS.filter(item => item.src_mer_id !== id);
          partnerStore.load();
          Toast.show('已拒绝合作邀请');
        } else Toast.show(resp.msg || '抱歉，操作失败，请稍后重试');
      });
    } catch (e) {
      console.log(e, 'refuse partner invite');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.refusing = false;
  };
}

const InvitationStore = new Invitations();

@inject('user')
@observer
export default class Partner extends React.PureComponent {
  state={};
  partners = partnerStore;
  invitations = InvitationStore;
  componentWillMount() {
    const {current} = this.props.user.user;
    const isAdmin = current && (current.is_admin === 1);
    this.partners.load();
    if (isAdmin) this.invitations.load();
  }
  TabBar = () => {
    return (
      <div className="panel-nav">
        <a className="title" style={{boxSizing: 'border-box', paddingRight: 10}}>
          <FontIcon className="material-icons" color="#333">dashboard</FontIcon>
          <span>合作伙伴</span>
        </a>
      </div>
    );
  };

  render() {
    const {current} = this.props.user.user;
    const isAdmin = current && (current.is_admin === 1);
    return (
      <div style={{flex: 1}}>
        <this.TabBar />
        <div className="main-board">
          <DataList type={ListType.PARTNERS} listData={this.partners.DS} loading={this.partners.loading} currentUser={current}/>
          {isAdmin && <DataList type={ListType.INVITE} listData={this.invitations.DS} loading={this.invitations.loading}/>}
        </div>
      </div>
    );
  }
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

const getPartnerType = type => {
  let str = type;
  str = str.replace('SHIPTO', '送达方');
  str = str.replace('PAYER', '付款方');
  str = str.replace('DRAWER', '开票方');
  return str;
};

const getPartnerFlag = flag => {
  switch (flag) {
    case 'CUSTOMER': return '客户';
    case 'SUPPLIER': return '供应商';
    case 'CUSTOMER,SUPPLIER': return '客户、供应商';
    default: return '未设定';
  }
};

const DataList = ({listData, loading, type, currentUser}) => {
  const isAdmin = currentUser && (currentUser.is_admin === 1);
  let headerTxt = '';
  let messageA = '';
  let primaryTxtTip = '';
  let noDataTxt = '';
  let leftIcon = null;
  let menuItem = [];
  switch (type) {
    default: return;
    case ListType.PARTNERS:
      headerTxt = '合作伙伴';
      noDataTxt = '暂无合作伙伴';
      primaryTxtTip = '商户名（内部）';
      leftIcon = <PartnerIcon />;
      menuItem = [
        {name: isAdmin ? '查看/修改资料' : '查看资料', action: partner => BizDialog.onOpen('合作伙伴详情', <AddPartner partner={partner}/>)},
        // {name: '解除合作关系', action: partner => BizDialog.onOpen('确认解除？', <ComfirmAction partner={partner}/>)}
      ];
      break;
    case ListType.INVITE:
      headerTxt = '伙伴申请';
      noDataTxt = '暂无申请';
      messageA = '申请成为合作伙伴';
      primaryTxtTip = '商户(ID)';
      leftIcon = <MailIcon />;
      menuItem = [
        {name: '同意', action: InvitationStore.accept},
        {name: '拒绝', action: InvitationStore.refuse}
      ];
      break;
  }
  const isInvite = type === ListType.INVITE;
  const handleAddPartner = () => BizDialog.onOpen('添加合作伙伴', <AddPartner/>);
  // TODO 查看更多
  return (
    <List style={{width: 400, marginRight: 10}}>
      <div style={{backgroundColor: '#FFF'}}>
        <Subheader >{headerTxt}</Subheader>
        {loading && <CircularProgress size={28} style={{display: 'block', margin: '0 auto', paddingBottom: 20}}/>}
        {!(listData && listData.length) && !loading && <p className="none-data" style={{textAlign: 'center', paddingBottom: 20}}>{noDataTxt}</p>}
        {(listData && listData.length > 0) && <Divider inset={true} />}
      </div>
      <div style={{overflowY: 'auto', overflowX: 'hidden',backgroundColor: '#FFF'}}>
        {
          listData && listData.map((item, index) => (
            <div key={index}>
              <ListItem
                leftIcon={leftIcon}
                rightIconButton={(
                  <IconMenu iconButtonElement={iconButtonElement}>
                    {menuItem.map((menu, key) => <MenuItem onTouchTap={menu.action.bind(null, item)} key={key}>{menu.name}</MenuItem>)}
                  </IconMenu>
                )}
                primaryText={`${primaryTxtTip}: ${isInvite ? item.src_mer_id : item.inner_partner_name}`}
                secondaryText={
                  <p>
                    <span>{isInvite ? messageA : `伙伴标识：${getPartnerFlag(item.partner_flag)}`}</span><br />
                    {isInvite ? item.create_time : `伙伴类型：${getPartnerType(item.partner_type)}`}
                  </p>
                }
                secondaryTextLines={2}
              />
              {(listData.length && ((listData.length - 1) !== index)) && <Divider inset={true} />}
            </div>
          ))
        }
      </div>
      {!isInvite && isAdmin && (
        <div style={{backgroundColor: '#FFF', textAlign: 'right'}}>
          <Divider inset={true} />
          <FlatButton label="添加合作伙伴" primary={true} onTouchTap={handleAddPartner}/>
        </div>
      )}
    </List>
  );
};

// const ComfirmAction = ({partner}) => (
//   <div>
//     <RaisedButton label="确定" primary={true} style={{width: '40%', marginRight: '15%'}}
//                   onTouchTap={partnerStore.delete.bind(null, partner)}/>
//     <RaisedButton label="取消" secondary={true} style={{width: '40%'}} onTouchTap={BizDialog.onClose}/>
//   </div>
// );
