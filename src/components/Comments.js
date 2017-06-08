import React from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {DetailContentType} from "../services/data-type";
import {formatTime} from "../utils/time";
import {create} from "../services/message";

export class Comments extends React.PureComponent {
  state={
    tabValue: 0,
    content: '',
  };
  static styles = {
    smallIcon: {
      width: 24,
      height: 24,
      fontSize: 22,
      color: '#8A959E',
    },
    small: {
      width: 30,
      height: 30,
      padding: 4,
      marginRight: 10,
    },
  };
  ActionButton = ({icon, action, tooltip}) => (
    <IconButton
      iconClassName="material-icons"
      onClick={action}
      tooltip={tooltip}
      iconStyle={Comments.styles.smallIcon}
      style={Comments.styles.small}>
      {icon}
    </IconButton>
  );
  onAttach = async () => {
    if (!window.FileReader) {
      return;
    }
    if (this.uploading) return;
    const files = await new Promise(resolve => {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => resolve(e.target.files);
      input.click();
    });
    const file = files[0];
    this.uploading = true;
    const data = new FormData();
    data.append('uploadfile', file);
    data.append('business', '1');
    try {
      // const resp = await uploadFile(data);
    } catch (e) {
      console.log(e);
    }
    this.uploading = false;
  };
  onInsertImage = () => alert('insert image');
  onAt = () => alert('@');
  onSend = async () => {
    if (this.submiting) return;
    const {content, tabValue} = this.state;
    if (!content || !content.trim()) return;
    this.submiting = true;
    const {detail} = this.props;
    const messageType = tabValue;
    try {
      const resp = await create(content, detail.id, messageType);
      detail.comments_list.push(resp);
    } catch (e) { console.log(e); }
    this.submiting = false;
    this.setState({ content: ''});
  };

  CommentList = () => {
    const {detail} = this.props;
    const {tabValue} = this.state;
    if (!detail.comments_list || !detail.activity_list) return (<div style={{flex: 1}}/>);
    return tabValue === 0 ? (
      <div className="comment-list">
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
    return (
      <div className="comment-area">
        <div className="comment-tabs">
          <button className={`comment-tab${tabValue === 0 ? ' active' : ''}`}
                  onClick={() => this.setState({tabValue: 0})}>评论</button>
          <button className={`comment-tab${tabValue === 1 ? ' active' : ''}`}
                  onClick={() => this.setState({tabValue: 1})}>动态</button>
        </div>
        <this.CommentList />
        <div className="comment-input">
          <TextField
            hintText="说点什么，按Ctrl+Enter提交"
            hintStyle={{bottom: 60, fontSize: 14}}
            inputStyle={{fontSize: 14, color: '#333'}}
            multiLine={true}
            rows={3}
            rowsMax={4}
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