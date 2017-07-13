import React from 'react';
import { observer } from 'mobx-react';
import {observable, computed, action, runInAction} from 'mobx';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {BizDialog} from "../../components/Dialog";
import {ToastStore as Toast} from "../../components/Toast";
import MailSvc from '../../services/mail';
import {DraftStore} from "../dashboard/search/Mail";

class MailStore {
  @observable title = '';
  @observable content = '';
  @observable receiverId = '';
  @observable priority = [];
  @observable submitting = false;
  @observable saving = false;
  @observable updating = false;
  @observable id = null;

  @computed get submitValidated() {
    return !!this.title && !!this.content && !!this.receiverId;
  }

  @computed get saveDraftValidated() {
    return !!this.title;
  }

  @computed get updateDraftValidated() {
    return !!this.title && !!this.id;
  }

  constructor(mail = {}) {
    this.title = mail.mail_title || '';
    this.content = mail.mail_content || '';
    this.receiverId = (mail.receiver_id && parseInt(mail.receiver_id, 10)) || '';
    this.priority = (mail.priority && mail.priority.split(',')) || [];
    this.id = mail.id;
  }

  @action setKey = (key, val) => this[key] = val;

  @action submit = async () => {
    if (this.submitting || !this.submitValidated) return;
    this.submitting = true;
    try {
      const priority = this.priority.join(',');
      let resp = null;
      console.log(this.id);
      if (this.id) {
        resp = await MailSvc.sendByDraft(this.id, this.title, this.content, this.receiverId, priority);
      } else {
        resp = await MailSvc.send(this.title, this.content, this.receiverId, priority);
      }
      runInAction('after submit add', () => {
        if (resp.code === '0') {
          Toast.show('发送成功');
          if (this.id && DraftStore) DraftStore.handleSendByDraft(this.id);
          BizDialog.onClose();
        }
        else Toast.show(resp.msg || '抱歉，发送失败，请稍后重试');
      })
    } catch (e) {
      console.log(e, 'send mail');
      Toast.show('抱歉，发生未知错误，请稍后重试');
    }
    this.submitting = false;
  };

  @action save = async () => {
    if (this.saving || !this.saveDraftValidated) return;
    this.saving = true;
    try {
      const priority = this.priority.join(',');
      const resp = await MailSvc.saveDraft(this.title, this.content, this.receiverId, priority);
      runInAction('after save', () => {
        if (resp.code === '0') {
          Toast.show('保存成功');
          DraftStore && DraftStore.refresh();
        }
        else Toast.show(resp.msg || '抱歉，保存失败，请稍后重试');
      })
    } catch (e) {
      console.log(e, 'save draft');
      Toast.show('抱歉，发生未知错误，请稍后重试');
    }
    this.saving = false;
  };

  @action update = async () => {
    if (this.updating || !this.updateDraftValidated) return;
    this.updating = true;
    try {
      const priority = this.priority.join(',');
      const resp = await MailSvc.updateDraft(this.id, this.title, this.content, this.receiverId, priority);
      runInAction('after update draft', () => {
        if (resp.code === '0') {
          Toast.show('更新成功');
          const item = {id: this.id, mail_title: this.title, mail_content: this.content, receiver: this.receiverId, priority};
          DraftStore && DraftStore.updateDraft(item);
        } else Toast.show(resp.msg || '抱歉，更新失败，请稍后重试');
      })
    } catch (e) {
      console.log(e, 'update draft');
      Toast.show('抱歉，发生未知错误，请稍后重试');
    }
    this.updating = false;
  }
}

@observer
class AddMail extends React.PureComponent {
  store = new MailStore(this.props.mail);
  render() {
    return (
      <form>
        <TextField
          floatingLabelText="邮件标题"
          value={this.store.title}
          type="text"
          onChange={e => this.store.setKey('title', e.target.value)}
          style={{marginRight: 20}}
        />
        <TextField
          floatingLabelText="收件商户ID"
          value={this.store.receiverId}
          type="number"
          onChange={e => this.store.setKey('receiverId', e.target.value ? parseInt(e.target.value, 10) : '')}
          style={{marginRight: 20}}
        /><br/>
        <TextField
          floatingLabelText='邮件正文'
          value={this.store.content}
          type="text"
          multiLine={true}
          rows={1}
          rowsMax={5}
          onChange={e => this.store.setKey('content', e.target.value)}
          style={{marginRight: 20, width: '100%'}}
        /><br/>
        <SelectField
          floatingLabelText="优先级(重要度与紧急度各一项)"
          value={this.store.priority}
          style={{marginRight: 20}}
          multiple={true}
          onChange={(event, index, val) => this.store.setKey('priority', (val && val.slice(0, 2)) || val)}
        >
          <MenuItem value='NOT_IMPORTENT' primaryText='不重要' insetChildren={true}
                    checked={this.store.priority.indexOf('NOT_IMPORTENT') > -1}/>
          <MenuItem value='IMPORTENT' primaryText='重要' insetChildren={true}
                    checked={this.store.priority.indexOf('IMPORTENT') > -1}/>
          <MenuItem value='VERY_IMPORTENT' primaryText='非常重要' insetChildren={true}
                    checked={this.store.priority.indexOf('VERY_IMPORTENT') > -1}/>
          <MenuItem value='HURRY' primaryText='紧急' insetChildren={true}
                    checked={this.store.priority.indexOf('HURRY') > -1}/>
          <MenuItem value='VERY_HURRY' primaryText='非常紧急' insetChildren={true}
                    checked={this.store.priority.indexOf('VERY_HURRY') > -1}/>
        </SelectField><br/>
        <div style={{textAlign: 'right'}}>
          <RaisedButton style={{ marginTop: 20 }} label={this.store.submitting ? null : '发送'}
                        icon={this.store.submitting ? <CircularProgress size={28}/> : null}
                        primary={this.store.submitValidated} disabled={!this.store.submitValidated}
                        onClick={this.store.submit} />
          {this.store.id && <RaisedButton style={{ marginTop: 20, marginLeft: 20 }} label={this.store.updating ? null : '更新草稿'}
                                          icon={this.store.updating ? <CircularProgress size={28}/> : null}
                                          primary={this.store.updateDraftValidated} disabled={!this.store.updateDraftValidated}
                                          onClick={this.store.update} />}
          <RaisedButton style={{ marginTop: 20, marginLeft: 20 }} label={this.store.saving ? null : '保存草稿'}
                        icon={this.store.saving ? <CircularProgress size={28}/> : null}
                        primary={this.store.saveDraftValidated} disabled={!this.store.saveDraftValidated}
                        onClick={this.store.save} />
          <RaisedButton style={{ marginTop: 20, marginLeft: 20 }} label="取消"
                        primary={false} onClick={BizDialog.onClose} />
        </div>
      </form>
    )
  }
}

export default AddMail;