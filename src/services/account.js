import axios from './';

const login = async (uname, pwd) => {
  const resp = await axios.post(`/user_gateway/auth`, { uname, pwd });
  return resp.data;
};

const getProfile = async access_token => {
  const resp = await axios.post('/user_gateway/get_userinfo', { access_token }, { headers: { access_token }});
  return resp.data;
};

const register = async (account, name, pwd) => {
  const resp = await axios.post('/user_gateway/register', {account, name, pwd});
  return resp.data;
};

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

const applyMerchant = async (mer_id) => {
  const resp = await axios.post('/biz_gateway/apply_join_merchant', {mer_id});
  return resp.data;
};

const refreshToken = async (refresh_token) => {
  const resp = await axios.post('/user_gateway/refresh', {refresh_token});
  return resp.data;
};

export const accountService = {
  login,
  register,
  getProfile,
  createMerchant,
  refreshToken,
  applyMerchant,
};