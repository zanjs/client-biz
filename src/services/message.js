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

export const create = async (content, id, type) => {
  return {
    company: 'myself',
    sender: {
      display_name: '我',
      position: '客户经理',
    },
    content,
    timestamp: Date.now(),
  };
};