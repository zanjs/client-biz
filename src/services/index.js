import axios from "axios";
import store from "../reducers";

const client = axios.create({
  baseURL: '/bizlink-core-server',
  timeout: 15000,
});


client.interceptors.request.use(config => {
  const {account: {token}} = store.getState();
  if (token) {
    config.headers.access_token = token;
  }
  return config;
});

export default client;