import axios from './';

const login = async (uname, pwd) => {
  // const resp = await axios.post('/login_gateway/auth', { uname, pwd })
  // return resp;
  return {success: true, user: {id: 'mockId'}, token: 'mockToken'};
};

const getUser = async (access_token) => {
  // const resp = await axios.post('/login_gateway/get_userinfo', { access_token })
  // return resp;
};

export const loginService = {
  login,
};