import axios from './';

const createMerchant = async (mer_name, type, indust_id, org_code, representative, establish_date, om_bank_name,
                              bank_account, swift_code, la_bank_account, tel_list, address) => {
  const resp = await axios.post('/base_gateway/add_merchant', {
    mer_name,
    type,
    indust_id,
    org_code,
    representative,
    establish_date: establish_date ? `${new Date(establish_date).getTime()}` : '',
    om_bank_name,
    bank_account,
    swift_code,
    la_bank_account,
    tel_list,
    address,
  });
  return resp.data;
};

const switchMerchant = async (mer_id, require_userinfo) => {
  const resp = await axios.post('/biz_gateway/change_merchant', {mer_id, require_userinfo});
  return resp.data;
};

const applyMerchant = async (mer_id) => {
  const resp = await axios.post('/biz_gateway/apply_join_merchant', {mer_id});
  return resp.data;
};

const inviteUser = async (account) => {
  const resp = await axios.post('/biz_gateway/invite_user', {account});
  return resp.data;
};

const getUserListByApply = async (id) => {
  const resp = await axios.post('/biz_gateway/batch_query_user_invite_req', {id});
  return resp.data;
};

const getMerchantListByInvite = async (id) => {
  const resp = await axios.post('/biz_gateway/batch_query_merchant_invite_req', {id});
  return resp.data;
};

const getMerchantListByUser = async () => {
  const resp = await axios.post('/biz_gateway/batch_query_user_merchant');
  return resp.data;
};

const getUserListByMerchant = async () => {
  const resp = await axios.post('/biz_gateway/batch_query_merchant_user');
  return resp.data;
};

const acceptUserApply = async (id) => {
  const resp = await axios.post('/biz_gateway/accept_user_req', {id});
  return resp.data;
};

const refuseUserApply = async (id) => {
  const resp = await axios.post('/biz_gateway/refuse_user_req', {id});
  return resp.data;
};

const acceptMerchantInvite = async (id) => {
  const resp = await axios.post('/biz_gateway/accept_mer_req', {id});
  return resp.data;
};

const refuseMerchantInvite = async (id) => {
  const resp = await axios.post('/biz_gateway/refuse_mer_req', {id});
  return resp.data;
};

const delUser = async (user_id) => {
  const resp = await axios.post('/biz_gateway/del_merchant_user', {user_id});
  return resp.data;
};

const quitMerchant = async (mer_id ) => {
  const resp = await axios.post('/biz_gateway/quit_merchant', {mer_id });
  return resp.data;
};

export default {
  createMerchant,
  applyMerchant,
  inviteUser,
  getUserListByApply,
  getMerchantListByInvite,
  acceptUserApply,
  refuseUserApply,
  acceptMerchantInvite,
  refuseMerchantInvite,
  switchMerchant,
  getMerchantListByUser,
  getUserListByMerchant,
  delUser,
  quitMerchant,
}