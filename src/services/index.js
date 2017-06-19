import axios from "axios";
import store from "../reducers";

export const base_url = 'http:/39.108.3.114';

const client = axios.create({
  baseURL: 'http://39.108.3.114:8889',
  timeout: 5000,
  // headers: {
  //   'Access-Control-Allow-Origin': '*',
  //   'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  // },
});


client.interceptors.request.use(config => {
  const {account: {token}} = store.getState();
  console.log(config, token);
  if (token) {
    config.headers.authorization = config.headers.authorization || `Bearer ${token}`;
  }
  return config;
});

export default client;