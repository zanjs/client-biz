import axios from "axios";
import store from "../reducers";

const client = axios.create({
  baseURL: 'http://39.108.3.114/',
  timeout: 5000,
});


client.interceptors.request.use(config => {
  const {account: {token}} = store.getState();
  if (token) {
    config.headers.authorization = config.headers.authorization || `Bearer ${token}`;
  }
  return config;
});

export default client;