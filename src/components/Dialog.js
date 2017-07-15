import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

class Store {
  @observable title = '';
  @observable open = false;
  @observable content = null;

  @action onOpen = (title, content) => {
    if (!content) return;
    this.title = title;
    this.content = content;
    this.open = true;
  };

  @action onClose = () => {
    this.open = false;
    this.title = '';
    this.content = null;
  }
}

export const BizDialog = new Store();

export const DialogComponent = observer(() => (
  <Dialog
    title={BizDialog.title}
    titleStyle={{fontSize: 18}}
    modal={false}
    autoScrollBodyContent
    open={BizDialog.open}
    onRequestClose={BizDialog.onClose}>
    {BizDialog.content}
  </Dialog>
));

export const ComfirmDialog = ({submitAction}) => (
  <div>
    <RaisedButton label="确定" primary={true} style={{width: '40%', marginRight: '15%'}}
                  onTouchTap={submitAction}/>
    <RaisedButton label="取消" secondary={true} style={{width: '40%'}} onTouchTap={BizDialog.onClose}/>
  </div>
);