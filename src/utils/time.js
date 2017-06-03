import moment from 'moment';
moment.locale('zh-cn');

export const formatTime = (timestamp, mode) => {
  return moment(timestamp).format(mode);
};