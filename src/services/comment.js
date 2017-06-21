import axios from './';

const create = async (bill_no, content, parent_id) => {
  const resp = await axios.post('/cmt_gateway/add_comment', {bill_no, content, parent_id});
  return resp.data;
};

const getCommentList = async (bill_no) => {
  const resp = await axios.post('/cmt_gateway/query_comment', {bill_no});
  return resp.data;
};

const getCommentListWithInnerComment = async (bill_no) => {
  const resp = await axios.post('/cmt_gateway/query_comment_tree', {bill_no});
  return resp.data;
};

export default {
  create,
  getCommentList,
  getCommentListWithInnerComment,
}