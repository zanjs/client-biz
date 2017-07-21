import React from 'react';
import {observable, action, runInAction, computed} from 'mobx';
import {observer} from 'mobx-react';
import TextField from 'material-ui/TextField';
// import IconButton from 'material-ui/IconButton';
import {formatTime} from "../utils/time";
import CommentSvc from '../services/comment';
import {ToastStore as Toast} from "./Toast";
import Storage from '../utils/storage';

class CommentStore {
  @observable comments = [];
  @observable content = '';
  @observable billNo = null;
  @observable submitting = false;

  @computed get validated() {
    return !!this.content && !!this.content.trim();
  }

  @action setContent = val => this.content = val || '';

  @action load = async (billNo) => {
    this.billNo = billNo;
    try {
      const resp = await CommentSvc.getCommentListWithInnerComment(billNo);
      runInAction('after load comment', () => {
        if (resp.code === '0') this.comments = resp.data;
        else Toast.show(resp.msg || '抱歉，获取评论失败，请尝试刷新页面');
      });
    } catch (e) {
      console.log(e, 'load bill comment');
    }
  };

  @action onSend = async (e) => {
    e.preventDefault();
    if (this.submiting || !this.validated) return;
    this.submiting = true;
    try {
      const resp = await CommentSvc.create(this.billNo, this.content);
      runInAction('after send', () => {
        if (resp.code === '0') {
          const current = Storage.getValue('user');
          const date = formatTime(Date.now(), 'YYYY-MM-DD \u00a0 HH:mm:ss');
          const newComment = {content: this.content, user_name: current.name, user_id: current.id,
            create_time: date};
          this.comments.push(newComment);
          this.content = '';
        } else Toast.show(resp.msg || '抱歉，评论失败，请稍后重新尝试');
      });
    } catch (e) { console.log(e, '发布评论'); }
    this.submiting = false;
  };
}

@observer
export class Comments extends React.PureComponent {
  store = new CommentStore();
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

  keydownHandler = e => {
    if(e.keyCode===13 && e.ctrlKey) this.store.onSend(e);
  };
  componentWillMount() {
    this.store.load(this.props.billNo);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.keydownHandler);
  }
  componentWillUnmount(){
    document.removeEventListener('keydown', this.keydownHandler);
  }
  // ActionButton = ({icon, action, tooltip}) => (
  //   <IconButton
  //     iconClassName="material-icons"
  //     onClick={action}
  //     tooltip={tooltip}
  //     iconStyle={Comments.styles.smallIcon}
  //     style={Comments.styles.small}>
  //     {icon}
  //   </IconButton>
  // );
  // onAttach = async () => {
  //   if (!window.FileReader) {
  //     return;
  //   }
  //   if (this.uploading) return;
  //   const files = await new Promise(resolve => {
  //     const input = document.createElement('input');
  //     input.type = 'file';
  //     input.onchange = e => resolve(e.target.files);
  //     input.click();
  //   });
  //   const file = files[0];
  //   this.uploading = true;
  //   const data = new FormData();
  //   data.append('uploadfile', file);
  //   try {
  //     // const resp = await uploadFile(data);
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   this.uploading = false;
  // };
  // onInsertImage = () => alert('insert image');
  // onAt = () => alert('@');


  CommentList = observer(() => {
    const {comments} = this.store;
    return (
      <div className="comment-list">
        {comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <div className="flex-row comment-info">
              {/*<p className="comment-company">{comment.company}</p>*/}
              <p style={{marginRight: 20}}>用户: {comment.user_name} (id: {comment.user_id})</p>
              <p>{comment.create_time}</p>
            </div>
            <p className="comment-content">{comment.content}</p>
          </div>
        ))}
      </div>
    )
    // const {tabValue} = this.state;
    // if (!detail.comments_list || !detail.activity_list) return (<div style={{flex: 1}}/>);
    // return tabValue === 0 ? (
    //   <div className="comment-list">
    //     {comments && comments.map((comment, index) => (
    //       <div key={index} className="comment-item">
    //         <div className="flex-row comment-info">
    //           <p className="comment-company">{comment.company}</p>
    //           <p style={{marginRight: 20}}>{comment.sender.display_name} / {comment.sender.position}</p>
    //           <p>{formatTime(comment.timestamp, 'YYYY-MM-D ddd \u00a0 h:mm')}</p>
    //         </div>
    //         <p className="comment-content">{comment.content}</p>
    //       </div>
    //     ))}
    //   </div>
    // ) : (
    //   <div style={{flex: 1}} className="comment-list">
    //     {detail.activity_list && detail.activity_list.map((activity, index) => (
    //       <div key={index} className="comment-item flex-row activities">
    //         <p>{formatTime(activity.timestamp, 'YYYY-MM-D ddd \u00a0 h:mm')}</p>
    //         <div className="activities-list">
    //           {activity.activities.map((item, index) => (
    //             <div key={index} className="activity-item">
    //               <div className="flex-row sender-info">
    //                 <p>{item.company}</p>
    //                 <p>{item.sender.display_name} / {item.sender.position}</p>
    //                 <p>{item.activity}{item.content ? '：' : null}</p>
    //               </div>
    //               <p>{item.content}</p>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // );
  });

  render() {
    return (
      <div className="comment-area">
        <div className="comment-tabs">
          <button className="comment-tab active" disabled>评论</button>
          {/*<button className={`comment-tab${tabValue === 0 ? ' active' : ''}`}*/}
                  {/*onClick={() => this.setState({tabValue: 0})}>评论</button>*/}
          {/*<button className={`comment-tab${tabValue === 1 ? ' active' : ''}`}*/}
                  {/*onClick={() => this.setState({tabValue: 1})}>动态</button>*/}
        </div>
        <this.CommentList />
        <form className="comment-input">
          <TextField
            hintText="说点什么，按Ctrl+Enter提交"
            hintStyle={{bottom: 60, fontSize: 14}}
            inputStyle={{fontSize: 14, color: '#333'}}
            multiLine={true}
            rows={3}
            rowsMax={4}
            fullWidth
            className="input-area"
            value={this.store.content}
            onChange={(e, v) => this.store.setContent(v)}
          />
          <div className="actions">
            {/*<div className="flex-row" style={{}}>*/}
              {/*<this.ActionButton icon='attachment' action={this.onAttach}/>*/}
              {/*<this.ActionButton icon='tag_faces' action={this.onInsertImage}/>*/}
              {/*<IconButton*/}
                {/*iconClassName="material-icons"*/}
                {/*onClick={this.onAt}*/}
                {/*iconStyle={{...Comments.styles.smallIcon, top: -3}}*/}
                {/*style={{...Comments.styles.small}}>*/}
                {/*{'@'}*/}
              {/*</IconButton>*/}
            {/*</div>*/}
            <button className="send" disabled={!this.store.validated} onClick={this.store.onSend}>发表评论</button>
          </div>
        </form>
      </div>
    );
  }
}