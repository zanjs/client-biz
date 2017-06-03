import moment from 'moment';
moment.locale('zh-cn');

export const formatTime = timestamp => {
  return moment(timestamp).format("YYYY-MM-D h:mm");
};