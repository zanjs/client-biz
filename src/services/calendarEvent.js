export const getEvent = async () => {
  return [
    {
      'title': 'All Day Event',
      'allDay': true,
      'startDate': new Date(),
      'endDate': new Date(),
      'desc': 'Pre-meeting meeting, to prepare for the meeting'
    },
    {
      'title': 'Long Event',
      'startDate': new Date(2017, 5, 4),
      'endDate': new Date(2017, 5, 10),
      'desc': 'Power lunch'
    },
  ];
};