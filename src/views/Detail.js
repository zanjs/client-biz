import React from 'react';
import {Comments} from "../components/Comments"
import {DetailHeader} from "../components/DetailHeader";
import {getDetail} from "../services/message";

export default class Detail extends React.Component {
  state={
    detail: {},
  };
  async componentWillMount() {
    const detail = await getDetail('MESSAGE');
    // const detail = await getDetail('ORDER');
    this.setState({ detail });
  }
  onClose = () => this.props.history.goBack();
  render() {
    const {id} = this.props.match.params;
    const {detail} = this.state;
    return (
      <div>
        <DetailHeader id={id} onClose={this.onClose} detail={detail}/>
        <Comments id={id}/>
      </div>
    );
  }
};

