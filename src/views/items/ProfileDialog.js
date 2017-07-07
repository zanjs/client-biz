import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const ProfileDialog = ({user}) => {
  return (
    <div>
      <TextField
        hintText="暂无"
        floatingLabelText="账户及ID"
        value={`账户: ${user.account} / ID: ${user.id}`}
        floatingLabelFixed={true}
        style={{marginRight: 20}}
      />
      <TextField
        hintText="暂无"
        floatingLabelText="用户名"
        value={user.name}
        floatingLabelFixed={true}
        style={{marginRight: 20}}
      />
      <TextField
        hintText="暂无"
        floatingLabelText="当前商户名及ID"
        value={user.mer_id ? `商户名：${user.mer_name} ID：${user.mer_id}` : ''}
        floatingLabelFixed={true}
        style={{marginRight: 20}}
      />
      <TextField
        hintText="暂无"
        floatingLabelText="当前部门及ID"
        value={user.dep_id ? `部门：${user.dep_name} ID：${user.dep_id}` : ''}
        floatingLabelFixed={true}
        style={{marginRight: 20}}
      />

      {/*<div className="actions-container">*/}
        {/*<RaisedButton style={{ marginTop: '20px' }} label="确认" className="btn-login"*/}
                      {/*primary={this.validated} disabled={!this.validated} onClick={this.submit} />*/}
      {/*</div>*/}
    </div>
  )
};

export default ProfileDialog;