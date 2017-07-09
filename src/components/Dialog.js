import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Dialog from 'material-ui/Dialog';

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
