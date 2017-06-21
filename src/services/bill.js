import axios from './';

const create = async (bill_no, bill_type, relative_mer_id, currency, pay_type, tax_flag, tax_rate, valid_begin_time,
                      valid_end_time, notice_list, content, item_list) => {
  const resp = await axios.post('/biz_gateway/create_bill', {bill_no, bill_type, relative_mer_id, currency, pay_type,
    tax_flag, tax_rate, valid_begin_time, valid_end_time, notice_list, content, item_list});
  return resp.data;
};

const update = async (bill_no, pay_type, valid_begin_time, valid_end_time, item_list) => {
  const resp = await axios.post('/biz_gateway/update_bill', {bill_no, pay_type, valid_begin_time, valid_end_time, item_list});
  return resp.data;
};

const confirmBill = async (bill_no) => {
  const resp = await axios.post('/biz_gateway/confirm_bill', {bill_no});
  return resp.data;
};

const confirmItem = async (bill_no, item_list) => {
  const resp = await axios.post('/biz_gateway/confirm_item', {bill_no, item_list});
  return resp.data;
};

const cancelConfirmBill = async (bill_no) => {
  const resp = await axios.post('/biz_gateway/unconfirm_bill', {bill_no});
  return resp.data;
};

const cancelConfirmItem = async (bill_no, item_list) => {
  const resp = await axios.post('/biz_gateway/unconfirm_item', {bill_no, item_list});
  return resp.data;
};

const getBill = async (bill_no) => {
  const resp = await axios.post('/biz_gateway/query_bill', {bill_no});
  return resp.data;
};

const getBillList = async (bill_type, page_no, page_size) => {
  const resp = await axios.post('/biz_gateway/batch_query_bill', {bill_type, page_no, page_size});
  return resp.data;
};

const getBillNo = async (key) => {
  const resp = await axios.post('/inner_seq_gateway/get_sequence_no', {key});
  return resp.data;
};

const sendItem = async (bill_no, line_no, quatity) => {
  const resp = await axios.post('/biz_gateway/send_item', {bill_no, line_no, quatity});
  return resp.data;
};

const returnItem = async (bill_no, line_no, quatity) => {
  const resp = await axios.post('/biz_gateway/return_item', {bill_no, line_no, quatity});
  return resp.data;
};

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
}