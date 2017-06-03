import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import {getEvent} from "../../../services/calendarEvent";
BigCalendar.momentLocalizer(moment);

export default class BizCalendar extends React.PureComponent {
  state = {
    eventsList: [],
  };
  async componentWillMount() {
    const eventsList = await getEvent();
    this.setState({ eventsList });
  }
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