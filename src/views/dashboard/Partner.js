import React from 'react';
import { observer } from 'mobx-react';
import {observable, computed, action, runInAction} from 'mobx';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import {grey400, darkBlack} from 'material-ui/styles/colors';
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
  @observable DS = [];
  @observable loading = false;

  @action load = async () => {
    if (this.loading) return;
    this.loading = true;
    try {
      const resp = await PartnerSvc.getInviteList();
      console.log(resp);
      runInAction('after load invite', () => {
        if (resp.code === '0' && resp.data.list) {
          this.DS = resp.data;
        } else Toast.show(resp.msg);
      })
    } catch (e) {
      console.log(e, 'load partner invite');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.loading = false;
  }
}

const InvitationStore = new Invitations();

@observer
export default class Partner extends React.PureComponent {
  state={};
  partners = partnerStore;
  invitations = InvitationStore;
  componentWillMount() {
    this.partners.load();
    this.invitations.load();
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
    return (
      <div style={{flex: 1}}>
        <this.TabBar />
        <div className="main-board">
          <DataList type={ListType.PARTNERS} listData={this.partners.DS} loading={this.partners.loading}/>
          <DataList type={ListType.INVITE} listData={this.invitations.DS} loading={this.invitations.loading}/>
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
  switch (type) {
    case 1: return '多个送达方';
    case 2: return '付款方';
    case 3: return '开票方';
    default: return '未设定';
  }
};

const getPartnerFlag = flag => {
  switch (flag) {
    case 1: return '客户';
    case 2: return '供应商';
    case 3: return '客户、供应商';
    default: return '未设定';
  }
};

const DataList = ({listData, loading, type}) => {
  let headerTxt = '';
  let messageA = '';
  let messageB = '';
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
        {name: '查看/修改资料', action: partner => BizDialog.onOpen('合作伙伴详情', <AddPartner partner={partner}/>)},
        {name: '解除合作关系', action: partner => BizDialog.onOpen('确认解除？', <ComfirmAction partner={partner}/>)}
      ];
      break;
    case ListType.INVITE:
      headerTxt = '合作申请';
      noDataTxt = '暂无申请';
      messageA = '申请加入商户';
      messageB = '申请加入商户';
      primaryTxtTip = '用户';
      leftIcon = <MailIcon />;
      menuItem = [
        {name: '同意', action: () => {}},
        {name: '拒绝', action: () => {}}
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
                primaryText={`${primaryTxtTip}: ${isInvite ? item.mer_name : item.inner_partner_name}`}
                secondaryText={
                  <p>
                    <span>{isInvite ? messageA : `伙伴标识：${getPartnerFlag(item.partner_flag)}`}</span><br />
                    {isInvite ? messageB : `伙伴类型：${getPartnerType(item.partner_type)}`}
                  </p>
                }
                secondaryTextLines={2}
              />
              {(listData.length && ((listData.length - 1) !== index)) && <Divider inset={true} />}
            </div>
          ))
        }
      </div>
      {!isInvite && (
        <div style={{backgroundColor: '#FFF', textAlign: 'right'}}>
          <Divider inset={true} />
          <FlatButton label="添加合作伙伴" primary={true} onTouchTap={handleAddPartner}/>
        </div>
      )}
    </List>
  );
};

const ComfirmAction = ({partner}) => (
  <div>
    <RaisedButton label="确定" primary={true} style={{width: '40%', marginRight: '15%'}}
                  onTouchTap={partnerStore.delete.bind(null, partner)}/>
    <RaisedButton label="取消" secondary={true} style={{width: '40%'}} onTouchTap={BizDialog.onClose}/>
  </div>
);
