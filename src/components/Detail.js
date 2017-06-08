import React from 'react';
import {Comments} from "./Comments"
import {DetailHeader} from "./DetailHeader";
import {getDetail} from "../services/message";

export class Detail extends React.PureComponent {
  state={
    detail: {},
  };
  async componentWillMount() {
    // const detail = await getDetail('MESSAGE');
    const detail = await getDetail('ORDER');
    this.setState({ detail });
  }
  render() {
    const {id} = this.props;
    if (!id) return <div/>;
    const {detail} = this.state;
    return (
      <div>
        <DetailHeader id={id} onClose={this.props.close} detail={detail}/>
        <Comments id={id} detail={detail}/>
      </div>
    );
  }
}

