import {MOCK_MAILS, MOCK_PROCUREMENT_MESSAGE, MOCK_SALE_MESSAGE, MESSAGE_DETAIL, ORDER_DETAIL} from "./mock-data"

export const getMails = async () => {
  return MOCK_MAILS;
};

export const getProcurementMessages = async () => {
  return MOCK_PROCUREMENT_MESSAGE;
};

export const getSaleMessages = async () => {
  return MOCK_SALE_MESSAGE;
};

export const getDetail = async (id) => {
  switch (id) {
    default: return ORDER_DETAIL;
    case 'MESSAGE': return MESSAGE_DETAIL;
  }
};