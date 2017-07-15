import React from 'react';
import { observable, action} from 'mobx';
import { observer } from 'mobx-react';
import Drawer from 'material-ui/Drawer';
import {Detail} from './Detail';

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
  };

  @action setWidth = width => this.width = width;
}

export const DrawerStore = new DrawerState();

@observer
export default class DetailDrawer extends React.PureComponent {
  store = DrawerStore;
  render() {
    const isMail = this.store.contentDS && this.store.contentDS.hasOwnProperty('mail_title');
    return (
      <Drawer
        width={this.store.width}
        style={{transition: 'width .3s linear'}}
        openSecondary={true}
        open={this.store.open}
        docked={!isMail}
        // overlayStyle={{backgroundColor: 'transparent'}}
        onRequestChange={this.store.onClose}>
        {
          this.store.contentDS && <Detail message={this.store.contentDS} close={this.store.onClose}/>
        }
      </Drawer>
    );
  }
}
