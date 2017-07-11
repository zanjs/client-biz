import axios from './';

const delUser = async (id) => {
  const resp = await axios.post('/base_gateway/del_user', {id});
  return resp.data;
};

const updateUser = async (name, dep_id) => {
  const resp = await axios.post('/base_gateway/update_user', {name, dep_id});
  return resp.data;
};

const getUser = async (id) => {
  const resp = await axios.post('/base_gateway/query_user', {id});
  return resp.data;
};

const getUserList = async (id) => {
  const resp = await axios.post('/base_gateway/batch_query_user', {id});
  return resp.data;
};


const addDepartment = async (name, parent_id) => {
  const resp = await axios.post('/base_gateway/add_department', {name, parent_id});
  return resp.data;
};

const getDepartmentList = async () => {
  const resp = await axios.post('/base_gateway/batch_query_department');
  return resp.data;
};

const getDepartment = async (id, parent_id) => {
  const resp = await axios.post('/base_gateway/query_department', {id, parent_id});
  return resp.data;
};

const delDepartment = async (id) => {
  const resp = await axios.post('/base_gateway/del_department', {id});
  return resp.data;
};

const updateDepartment = async (id, name, parent_id, remark) => {
  const resp = await axios.post('/base_gateway/update_department', {id, name, parent_id, remark});
  return resp.data;
};

const addItem = async (name, line_no, item_code, item_spec, unit, price,
  quantity, deliver_time) => {
  const resp = await axios.post('/base_gateway/add_item', {name, line_no, item_code, item_spec, unit, price,
    quantity, deliver_time});
  return resp.data;
};

const updateItem = async (id, name, item_code, item_spec, unit, price) => {
  const resp = await axios.post('/base_gateway/update_item', {id, name, item_code, item_spec, unit, price});
  return resp.data;
};

const delItem = async (id) => {
  const resp = await axios.post('/base_gateway/del_item', {id});
  return resp.data;
};

const getItemList = async (id) => {
  const resp = await axios.post('/base_gateway/batch_query_item', {id});
  return resp.data;
};

const getItem = async (id) => {
  const resp = await axios.post('/base_gateway/query_item', {id});
  return resp.data;
};

const addPartner = async (partner_id, partner_flag, partner_type, inner_partner_id, inner_partner_name, tel, address) => {
  const resp = await axios.post('/base_gateway/add_partner', {partner_id, partner_flag, partner_type, inner_partner_id, inner_partner_name, tel, address});
  return resp.data;
};

const delPartner = async (partner_id) => {
  const resp = await axios.post('/base_gateway/del_partner', {partner_id});
  return resp.data;
};

const updatePartner = async (partner_id, partner_flag, partner_type, inner_partner_id, inner_partner_name, tel, address) => {
  const resp = await axios.post('/base_gateway/update_partner', {partner_id, partner_flag, partner_type, inner_partner_id, inner_partner_name, tel, address});
  return resp.data;
};

const getPartnerList = async (page_no, page_size) => {
  const resp = await axios.post('/base_gateway/batch_query_partner', {page_no, page_size});
  return resp.data;
};

const getPartner = async (partner_id) => {
  const resp = await axios.post('/base_gateway/query_partner', {partner_id});
  return resp.data;
};

export default {
  delUser,
  updateUser,
  getUser,
  getUserList,
  addDepartment,
  getDepartmentList,
  getDepartment,
  delDepartment,
  updateDepartment,
  addItem,
  updateItem,
  delItem,
  getItemList,
  addPartner,
  delPartner,
  updatePartner,
  getPartnerList,
  getPartner,
  getItem,
}
