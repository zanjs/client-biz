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

const refreshToken = async (refresh_token) => {
  const resp = await axios.post('/user_gateway/refresh', {refresh_token});
  return resp.data;
};

export const accountService = {
  login,
  register,
  getProfile,
  refreshToken,
};