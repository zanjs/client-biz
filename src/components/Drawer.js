import React from 'react';
import { observable, action} from 'mobx';
import { observer } from 'mobx-react';
import Drawer from 'material-ui/Drawer';
import {Detail} from './Detail';
import{detailStore} from "./Detail";
import {BizDialog, ComfirmDialog} from "./Dialog"

class DrawerState {
  @observable open = false;
  @observable width = 500;
  @observable contentDS = null;

  @action onOpen = (message) => {
    if (!message) return;
    this.contentDS = message;
    this.open = true;
  };

  @action onClose = () => {
    this.open = false;
    this.width = 500;
    this.contentDS = null;
    BizDialog.onClose();
  };

  @action setWidth = width => this.width = width;
}

export const DrawerStore = new DrawerState();

@observer
export default class DetailDrawer extends React.PureComponent {
  store = DrawerStore;
  onRequestChange = () => {
    if (detailStore.shouldSaveBill) {
      BizDialog.onOpen('是否不保存改动直接退出？', <ComfirmDialog submitAction={this.store.onClose}/>);
      return;
    }
    this.store.onClose();
  };
  render() {
    return (
      <Drawer
        width={this.store.width}
        style={{transition: 'width .3s linear'}}
        openSecondary={true}
        open={this.store.open}
        docked={false}
        onRequestChange={this.onRequestChange}>
        {
          this.store.contentDS && <Detail message={this.store.contentDS} close={this.store.onClose}/>
        }
      </Drawer>
    );
  }
}
