import axios, {clientSeq} from './';

const create = async (bill_no, bill_type, relative_mer_id, currency, pay_type, tax_flag, tax_rate, valid_begin_time,
                      valid_end_time, notice_list, content, priority, item_list) => {
  const resp = await axios.post('/bill_gateway/create_bill', {bill_no, bill_type, relative_mer_id, currency, pay_type,
    tax_flag, tax_rate, valid_begin_time, valid_end_time, notice_list, content, priority, item_list});
  return resp.data;
};

const update = async (bill_no, pay_type, valid_begin_time, valid_end_time, priority, item_list) => {
  const resp = await axios.post('/bill_gateway/update_bill', {bill_no, pay_type, valid_begin_time, valid_end_time, priority, item_list});
  return resp.data;
};

const confirmBill = async (bill_no) => {
  const resp = await axios.post('/bill_gateway/confirm_bill', {bill_no});
  return resp.data;
};

const confirmItem = async (bill_no, item_list) => {
  const resp = await axios.post('/bill_gateway/confirm_item', {bill_no, item_list});
  return resp.data;
};

const cancelConfirmBill = async (bill_no) => {
  const resp = await axios.post('/bill_gateway/unconfirm_bill', {bill_no});
  return resp.data;
};

const cancelConfirmItem = async (bill_no, item_list) => {
  const resp = await axios.post('/bill_gateway/unconfirm_item', {bill_no, item_list});
  return resp.data;
};

const getBill = async (bill_no) => {
  const resp = await axios.post('/bill_gateway/query_bill', {bill_no});
  return resp.data;
};

const getBillList = async (bill_type, page_no, page_size) => {
  const resp = await axios.post('/bill_gateway/batch_query_bill', {bill_type, page_no, page_size});
  return resp.data;
};

// key 9deb17fa79572cdbe980ff9257009edd7fdb8a50
const getBillNo = async (key) => {
  const resp = await clientSeq.get(`/inner_seq_gateway/get_sequence_no`, {params: {key}});
  return resp.data;
};

const sendItem = async (bill_no, line_no, quatity) => {
  const resp = await axios.post('/bill_gateway/send_item', {bill_no, line_no, quatity});
  return resp.data;
};

const returnItem = async (bill_no, line_no, quatity) => {
  const resp = await axios.post('/bill_gateway/return_item', {bill_no, line_no, quatity});
  return resp.data;
};

const setNoticeList = async (bill_no, notice_list) => {
  const resp = await axios.post('/bill_gateway/set_notice_list', {bill_no, notice_list});
  return resp.data;
};

export const CURRENCY = [
  {value: 'CNY', name: '人民币'},
  {value: 'USD', name: '美元'},
  {value: 'EUR', name: '欧元'},
  {value: 'HKD', name: '港元'},
  {value: 'GBP', name: '英镑'},
  {value: 'KRW', name: '韩元'},
  {value: 'CAD', name: '加元'},
  {value: 'CHF', name: '瑞士法郎'},
  {value: 'SGD', name: '新加坡元'},
  {value: 'MYR', name: '马来西亚元'},
  {value: 'IDR', name: '印尼盾'},
  {value: 'PHP', name: '菲律宾比索'},
];

export default {
  create,
  update,
  confirmBill,
  confirmItem,
  cancelConfirmBill,
  cancelConfirmItem,
  getBill,
  getBillList,
  getBillNo,
  sendItem,
  returnItem,
  setNoticeList,
}