import axios from "axios";
import Storage from '../utils/storage';

const client = axios.create({
  baseURL: '/bizlink-core-server',
  timeout: 15000,
});

export const clientSeq = axios.create({
  baseURL: '/bizlink-seq-server',
  timeout: 15000,
});


client.interceptors.request.use(config => {
  const token = Storage.getValue('token');
  if (token) {
    config.headers.access_token = token;
  }
  return config;
});

export default client;