import React from 'react';
import {observable, action, runInAction} from 'mobx';
import {observer} from 'mobx-react'
import CircularProgress from 'material-ui/CircularProgress';
import {Comments} from "./Comments"
import {DetailHeader} from "./DetailHeader";
import {DrawerStore} from "./Drawer";

class DetailStore {
  @observable detail = null;
  @observable isMail = false;

  @action load = async (item) => {
    if (item && item.hasOwnProperty('mail_title')) {
      this.detail = item;
      this.isMail = true;
      return;
    }
    DrawerStore.setWidth(620);
    if (this.loading) return;
    this.loading = true;
    try {
      // const resp = await
      runInAction('after load bill detail', () => {});
    } catch (e) {
      console.log(e, 'load bill detail');
    }
  }
}

@observer
export class Detail extends React.PureComponent {
  store = new DetailStore();
  componentWillMount() {
    this.store.load(this.props.message);
  }
  render() {
    const {detail} = this.store;
    if (!detail) return (<div style={{textAlign: 'center'}}><CircularProgress style={{marginTop: '40%'}}/></div>);
    return (
      <div>
        <DetailHeader onClose={this.props.close} detail={detail} isMail={this.store.isMail}/>
        {!this.store.isMail && <Comments detail={detail}/>}
      </div>
    );
  }
}

