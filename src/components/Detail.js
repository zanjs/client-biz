import React from 'react';
import {observable, action, runInAction} from 'mobx';
import {observer} from 'mobx-react'
import CircularProgress from 'material-ui/CircularProgress';
import {Comments} from "./Comments"
import {DetailHeader} from "./DetailHeader";

class DetailStore {
  @observable detail = null;

  @action load = async (item) => {
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
  async componentWillMount() {
    console.log(this.props.message);
    this.store.load(this.props.message);
  }
  render() {
    const {detail} = this.store;
    if (!detail) return (<div style={{textAlign: 'center'}}><CircularProgress style={{marginTop: '40%'}}/></div>);
    return (
      <div>
        <DetailHeader onClose={this.props.close} detail={detail}/>
        <Comments detail={detail}/>
      </div>
    );
  }
}

