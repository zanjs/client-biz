import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {DetailContentType} from "../services/data-type";
import {formatTime} from "../utils/time";

export class Comments extends React.PureComponent {
  state={
    tabValue: 1,
    content: '',
  };
  static styles = {
    smallIcon: {
      width: 24,
      height: 24,
      fontSize: 22,
      color: '#4A4A4A',
    },
    small: {
      width: 30,
      height: 30,
      padding: 4,
    },
  };
  ActionButton = ({icon, action}) => (
    <IconButton
      iconClassName="material-icons"
      onClick={action}
      iconStyle={Comments.styles.smallIcon}
      style={Comments.styles.small}>
      {icon}
    </IconButton>
  );
  onAttach = () => alert('attach');
  onInsertImage = () => alert('insert image');
  onAt = () => alert('@');
  onSend = () => alert(this.state.content);

  CommentList = () => {
    const {detail} = this.props;
    const {tabValue} = this.state;
    if (!detail.comments_list || !detail.activity_list) return (<div style={{flex: 1}}/>);
    return tabValue === 0 ? (
      <div style={{flex: 1}} className="comment-list">
        {detail.comments_list && detail.comments_list.map((comment, index) => (
          <div key={index} className="comment-item">
            <div className="flex-row comment-info">
              <p className="comment-company">{comment.company}</p>
              <p style={{marginRight: 20}}>{comment.sender.display_name} / {comment.sender.position}</p>
              <p>{formatTime(comment.timestamp, 'YYYY-MM-D ddd \u00a0 h:mm')}</p>
            </div>
            <p className="comment-content">{comment.content}</p>
          </div>
        ))}
      </div>
    ) : (
      <div style={{flex: 1}} className="comment-list">
        {detail.activity_list && detail.activity_list.map((activity, index) => (
          <div key={index} className="comment-item flex-row activities">
            <p>{formatTime(activity.timestamp, 'YYYY-MM-D ddd \u00a0 h:mm')}</p>
            <div className="activities-list">
              {activity.activities.map((item, index) => (
                <div key={index} className="activity-item">
                  <div className="flex-row sender-info">
                    <p>{item.company}</p>
                    <p>{item.sender.display_name} / {item.sender.position}</p>
                    <p>{item.activity}{item.content ? '：' : null}</p>
                  </div>
                  <p>{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const {tabValue, content} = this.state;
    const {detail} = this.props;
    const isOrder = detail.type === DetailContentType.PROCUREMENT_ORDER || detail.type === DetailContentType.SALE_ORDER;
    return (
      <div className="comment-area" style={{width: isOrder ? 600 : 480}}>
        <div className="comment-tabs">
          <button className="comment-tab"
                  onClick={() => this.setState({tabValue: 0})}
                  style={{borderBottom: tabValue === 0 ? '2px solid #333' : null}}>评论</button>
          <button className="comment-tab"
                  onClick={() => this.setState({tabValue: 1})}
                  style={{borderBottom: tabValue === 1 ? '2px solid #333' : null}}>动态</button>
        </div>
        <this.CommentList />
        <div className="comment-input">
          <TextField
            hintText="说点什么，按Ctrl+Enter提交"
            hintStyle={{bottom: 35}}
            multiLine={true}
            rows={2}
            rowsMax={2}
            fullWidth
            className="input-area"
            onChange={(e, v) => this.setState({content: v})}
          />
          <div className="actions">
            <div className="flex-row" style={{}}>
              <this.ActionButton icon='attachment' action={this.onAttach}/>
              <this.ActionButton icon='tag_faces' action={this.onInsertImage}/>
              <IconButton
                iconClassName="material-icons"
                onClick={this.onAt}
                iconStyle={{...Comments.styles.smallIcon, top: -3}}
                style={{...Comments.styles.small}}>
                {'@'}
              </IconButton>
            </div>
            <button className="send" disabled={!content} onClick={this.onSend}>发表评论</button>
          </div>
        </div>
      </div>
    );
  }
}