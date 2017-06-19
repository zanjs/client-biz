import axios from './';
// import axios from "axios";
// import {base_url} from "./index";

const login = async (uname, pwd) => {
  console.log(uname, pwd);
  const resp = await axios.post(`/login_gateway/auth`, { uname, pwd });
  console.log(resp, 'login service');
  return resp;
  // return {success: true, user: {id: 'mockId'}, token: 'mockToken'};
};

const getProfile = async (access_token) => {
  const resp = await axios.post('/login_gateway/get_userinfo', { access_token });
  return resp;
};

const register = async (account, pwd) => {
  const resp = await axios.post('/user_gateway/register', {account, pwd});
  return resp;
};

const createMerchant = async (mer_name, type, indust_id, org_code, representative, establish_date, om_bank_name,
                              bank_account, swift_code, la_bank_account, tel_list, address) => {
  const resp = await axios.post('/base_gateway/add_merchant', {
    mer_name,
    type,
    indust_id,
    org_code,
    representative,
    establish_date,
    om_bank_name,
    bank_account,
    swift_code,
    la_bank_account,
    tel_list,
    address,
  });
  return resp;
};

const refreshToken = async (refresh_token) => {
  const resp = await axios.post('/user_gateway/refresh', {refresh_token});
  return resp;
};

export const accountService = {
  login,
  register,
  getProfile,
  createMerchant,
  refreshToken,
};