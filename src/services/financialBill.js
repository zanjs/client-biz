import axios from './';

const create = async (bill_no, settle_type, invoice_type, relative_mer_id, currency, pay_type, tax_type, total_amount,
                      invoiced_amount, pay_amount, settle_list) => {
  const tax_flag = tax_type;
  const resp = await axios.post('/fin_gateway/create_bill', {bill_no, settle_type, invoice_type, relative_mer_id,
    currency, pay_type, tax_type, total_amount, invoiced_amount, pay_amount, settle_list, tax_flag});
  return resp.data;
};

const update = async (bill_no, invoiced_amount, pay_amount, settle_list) => {
  const resp = await axios.post('/fin_gateway/update_bill', {bill_no, invoiced_amount, pay_amount, settle_list});
  return resp.data;
};

const abort = async (bill_no) => {
  const resp = await axios.post('/fin_gateway/abort_bill', {bill_no});
  return resp.data;
};

const getBill = async (bill_no) => {
  const resp = await axios.post('/fin_gateway/query_bill', {bill_no});
  return resp.data;
};

const getBillList = async (page_no, page_size) => {
  const resp = await axios.post('/fin_gateway/batch_query_bill', {page_no, page_size});
  return resp.data;
};

const confirmBill = async (bill_no) => {
  const resp = await axios.post('/fin_gateway/confirm_bill', {bill_no});
  return resp.data;
};

const unConfirmBill = async (bill_no) => {
  const resp = await axios.post('/fin_gateway/unconfirm_bill', {bill_no});
  return resp.data;
};

export default {
  create,
  update,
  abort,
  getBill,
  getBillList,
  confirmBill,
  unConfirmBill,
}