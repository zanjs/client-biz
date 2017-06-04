import moment from 'moment';
moment.updateLocale('zh-cn', {
  weekdaysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
});
moment.locale('zh-cn');

export const formatTime = (timestamp, mode) => {
  return moment(timestamp).format(mode);
};