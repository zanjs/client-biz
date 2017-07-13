import axios from './';

const saveDraft = async (mail_title, mail_content, receiver, priority) => {
  const resp = await axios.post('/mail_gateway/save_drift', {mail_title, mail_content, receiver, priority});
  return resp.data;
};

const send = async (mail_title, mail_content, receiver, priority) => {
  const resp = await axios.post('/mail_gateway/send_mail', {mail_title, mail_content, receiver, priority});
  return resp.data;
};

const setRead = async (id) => {
  const resp = await axios.post('/mail_gateway/read_mail', {id});
  return resp.data;
};

const getMail = async (id) => {
  const resp = await axios.post('/mail_gateway/query_mail', {id});
  return resp.data;
};

const search = async (type, keyword) => {
  const resp = await axios.post('/mail_gateway/search_mail', {type, keyword});
  return resp.data;
};

const getMailList = async (read_flag, page_no, page_size) => {
  const resp = await axios.post('/mail_gateway/batch_query_mail', {read_flag, page_no, page_size});
  return resp.data;
};

const getDraft = async (id) => {
  const resp = await axios.post('/mail_gateway/query_drift', {id});
  return resp.data;
};

const delDraft = async (id) => {
  const resp = await axios.post('/mail_gateway/del_drift', {id});
  return resp.data;
};

const updateDraft = async (id, mail_title, mail_content, receiver, priority) => {
  const resp = await axios.post('/mail_gateway/update_drift', {id, mail_title, mail_content, receiver, priority});
  return resp.data;
};

const getDraftList = async (page_no, page_size) => {
  const resp = await axios.post('/mail_gateway/batch_query_drift', {page_no, page_size});
  return resp.data;
};

const sendByDraft = async (id, mail_title, mail_content, receiver, priority) => {
  const resp = await axios.post('/mail_gateway/send_mail_from_drift', {id, mail_title, mail_content, receiver, priority});
  return resp.data;
};

export default {
  saveDraft,
  send,
  setRead,
  getMail,
  getMailList,
  search,
  getDraftList,
  getDraft,
  delDraft,
  updateDraft,
  sendByDraft,
}