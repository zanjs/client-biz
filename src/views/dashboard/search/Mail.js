import React from 'react';
import { observer, inject } from 'mobx-react';
import {observable, computed, action, runInAction} from 'mobx';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import {grey400} from 'material-ui/styles/colors';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import CircularProgress from 'material-ui/CircularProgress';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SearchIcon from 'material-ui/svg-icons/action/search';
import {ToastStore as Toast} from "../../../components/Toast";
import MailSvc from '../../../services/mail';
import AddMail from '../../items/AddMail';
import {BizDialog} from "../../../components/Dialog";
import {DrawerStore} from "../../../components/Drawer";

class MailDraftStore {
  @observable DS = [];
  @observable loading = false;
  @observable recordCount = 0;
  @observable pageNo = 1;
  @observable hasMore = false;
  @observable landed = false;
  pageSize = 20;

  @action refresh = () => {
    this.hasMore = false;
    this.pageNo = 1;
    this.load();
  };

  @action load = async () => {
    if (this.loading) return;
    this.loading = true;
    const pageNo = this.pageNo > 1 ? this.pageNo : null;
    try {
      const resp = await MailSvc.getDraftList(pageNo, this.pageSize);
      runInAction('after load list', () => {
        if (resp.code === '0' && resp.data.list) {
          this.DS = this.pageNo > 1 ? [...this.DS, ...resp.data.list] : resp.data.list;
          this.recordCount = (resp.data.pagination && resp.data.pagination.record_count) || 0;
          this.hasMore = this.DS.length < this.recordCount;
          if (this.hasMore) this.pageNo++;
        } else Toast.show(resp.msg || '抱歉，发生未知错误，请检查网络连接稍后重试');
      })
    } catch (e) {
      console.log(e, 'load draft');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.loading = false;
    if (!this.landed) this.landed = true;
  };

  @action onDelete = async (item) => {
    if (!item.id || this.submitting) return;
    this.submitting = true;
    try {
      const resp = await MailSvc.delDraft(item.id);
      runInAction('after delete', () => {
        if (resp.code === '0') {
          Toast.show('删除成功');
          this.DS = this.DS.filter(data => data.id !== item.id);
        } else Toast.show(resp.msg || '抱歉，删除失败，请稍后重试');
      });
    } catch (e) {
      console.log(e, 'delete draft');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.submitting = false;
  };

  @action handleSendByDraft = id => this.DS = this.DS.filter(data => data.id !== id);
  @action updateDraft = item => {
    console.log(item);
    this.DS.forEach((data, index, key) => {
      console.log(data, index, key);
      if (data.id === item.id) data = {...data, ...item}
    })
  }
}

export const DraftStore = new MailDraftStore();

class SearchStore {
  @observable DS = [];
  @observable recordCount = 0;
  @observable pageNo = 1;
  @observable hasMore = false;
  @observable searchKeyWord = '';
  @observable searchType = '';
  @observable submitting = false;
  @observable searched = false;
  pageSize = 20;

  @computed get searchValidated() {
    return !!this.searchKeyWord && (!!this.searchType || this.searchType === 0);
  }

  @action setKey = (key, val) => this[key] = val;

  @action search = async () => {
    if (this.submitting || !this.searchValidated) return;
    this.submitting = true;
    try {
      // const pageNo = this.pageNo > 1 ? this.pageNo : null;
      const resp = await MailSvc.search(this.searchType, this.searchKeyWord);
      runInAction('after search', () => {
        if (resp.code === '0') {
          this.DS = this.pageNo > 1 ? [...this.DS, ...resp.data] : resp.data;
          this.recordCount = (resp.data.pagination && resp.data.pagination.record_count) || 0;
          this.hasMore = this.DS.length < this.recordCount;
          if (this.hasMore) this.pageNo++;
        } else Toast.show(resp.msg || '抱歉，搜索失败，请稍后重试');
      });
    } catch (e) {
      console.log(e, 'search mail');
      Toast.show('抱歉，发生未知错误，请检查网络连接稍后重试');
    }
    this.submitting = false;
    if (!this.searched) this.searched = true;
  }
}

@inject('user')
@observer
export default class Mail extends React.PureComponent {
  store = DraftStore;
  searchStore = new SearchStore();
  componentWillMount() {
    this.store.load();
  }
  loadMore = () => {
    if (!this.store.hasMore) return;
    this.store.load();
  };
  render() {
    return (
      <div className="main-board">
        <DataList listData={this.store.DS} landed={this.store.landed} loadMore={this.loadMore}
                  onDelete={this.store.onDelete}
                  hasMore={this.store.hasMore}/>
        <div className="search-mail-container">
          <h3>查找邮件</h3>
          <SelectField
            floatingLabelText="查找类型"
            value={this.searchStore.searchType}
            style={{marginRight: 20}}
            onChange={(event, index, val) => this.searchStore.setKey('searchType', val)}
          >
            <MenuItem value={0} primaryText="邮件标题" />
            <MenuItem value={1} primaryText="邮件正文" />
            <MenuItem value={2} primaryText="发件人" />
          </SelectField><br/>
          <TextField
            floatingLabelText="请输入查找关键字"
            value={this.searchStore.searchKeyWord}
            type="text"
            onChange={e => this.searchStore.setKey('searchKeyWord', e.target.value)}
            style={{marginRight: 20}}
          />
          <RaisedButton label="查找" primary={this.searchStore.searchValidated} icon={<SearchIcon />}
                        disabled={!this.searchStore.searchValidated} onTouchTap={this.searchStore.search}/>
          <br/>
          <SearchList listData={this.searchStore.DS} searched={this.searchStore.searched}/>
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

const DataList = ({listData, landed, loadMore, hasMore, onDelete}) => {
  return (
    <List style={{width: 400, marginRight: 10}}>
      <div style={{backgroundColor: '#FFF'}}>
        <Subheader>邮件草稿</Subheader>
        {!landed && <CircularProgress size={28} style={{display: 'block', margin: '0 auto 20px auto'}}/>}
        {!(listData && listData.length) && landed && <p className="none-data"
                                                          style={{textAlign: 'center', paddingBottom: 20, color: '#CCC'}}>尚未保存过草稿</p>}
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
                    <MenuItem onTouchTap={() => BizDialog.onOpen('邮件草稿', <AddMail mail={item}/>)}>查看</MenuItem>
                    <MenuItem onTouchTap={() => onDelete(item)}>删除</MenuItem>
                  </IconMenu>
                )}
                primaryText={`标题: ${item.mail_title}`}
                secondaryText={<p>{item.mail_content}</p>}
                secondaryTextLines={2}
              />
              {(listData.length && ((listData.length - 1) !== index)) && <Divider inset={true} />}
            </div>
          ))
        }
        <div style={{backgroundColor: '#FFF', textAlign: 'right'}}>
          <Divider inset={true} />
          {hasMore && <FlatButton label="加载更多" primary={true} onTouchTap={loadMore}/>}
          <FlatButton label="发送邮件" primary onTouchTap={() => BizDialog.onOpen('发送邮件', <AddMail />)}/>
        </div>
      </div>
    </List>
  );
};

const SearchList = ({listData, searched, loadMore, hasMore}) => {
  return searched ? (
    <List style={{flex: 1}}>
      <div style={{backgroundColor: '#FFF'}}>
        <Subheader>搜索结果</Subheader>
        {!(listData && listData.length) && <p className="none-data"
                                                        style={{textAlign: 'center', paddingBottom: 20, color: '#CCC'}}>没有找到相关结果</p>}
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
                    <MenuItem onTouchTap={() => DrawerStore.onOpen(item)}>查看</MenuItem>
                  </IconMenu>
                )}
                primaryText={`标题: ${item.mail_title}`}
                secondaryText={<p>{item.mail_content}</p>}
                secondaryTextLines={2}
              />
              {(listData.length && ((listData.length - 1) !== index)) && <Divider inset={true} />}
            </div>
          ))
        }
        {/*{hasMore && (*/}
          {/*<div style={{backgroundColor: '#FFF', textAlign: 'right'}}>*/}
            {/*<Divider inset={true} />*/}
            {/*<FlatButton label="加载更多" primary={true} onTouchTap={loadMore}/>*/}
          {/*</div>*/}
        {/*)}*/}
      </div>
    </List>
  ) : null;
};

