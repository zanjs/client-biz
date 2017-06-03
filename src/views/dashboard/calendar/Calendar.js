import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
BigCalendar.momentLocalizer(moment);

export default class BizCalendar extends React.PureComponent {
  state = {
    eventsList: [],
  };
  render() {
    const {eventsList} = this.state;
    return (
      <div className="calendar-container">
        <BigCalendar
          events={eventsList}
          startAccessor='startDate'
          endAccessor='endDate'
          views={['month', 'week']}
        />
      </div>
    );
  }
}