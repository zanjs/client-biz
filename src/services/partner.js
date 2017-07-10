import axios from './';

const invite = async (partner_id) => {
  const resp = await axios.post('/biz_gateway/send_invite_req', {partner_id});
  return resp.data;
};

const accept = async (partner_id) => {
  const resp = await axios.post('/biz_gateway/accept_invite_req', {partner_id});
  return resp.data;
};

const refuse = async (partner_id) => {
  const resp = await axios.post('/biz_gateway/refuse_invite_req', {partner_id});
  return resp.data;
};

const getInviteList = async () => {
  const resp = await axios.post('/biz_gateway/batch_query_invite_req');
  return resp.data;
};

export default {
  invite,
  accept,
  refuse,
  getInviteList
}
