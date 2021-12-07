// init
import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timelinePlugin from '@fullcalendar/timeline';
import { makeStyles } from '@material-ui/styles';
import {
  Modal,
  Card,
  CardContent,
  colors,
  useTheme,
  useMediaQuery
} from '@material-ui/core';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';

import axios from 'utils/axios';
import { Page } from 'components';
import { AddEditEvent, Toolbar } from './components';
import { tripEvents } from 'actions/tripActions'; ///get trip action
import tippy from 'tippy.js'; /////tippy to show tool tip
import 'tippy.js/animations/scale-subtle.css';
import { useSelector } from 'react-redux';

// styles
const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    padding: theme.spacing(3),
    '& .fc-unthemed td': {
      borderColor: theme.palette.divider
    },
    '& .fc-widget-header': {
      backgroundColor: colors.grey[50]
    },
    '& .fc-axis': {
      ...theme.typography.body2
    },
    '& .fc-list-item-time': {
      ...theme.typography.body2
    },
    '& .fc-list-item-title': {
      ...theme.typography.body1
    },
    '& .fc-list-heading-main': {
      ...theme.typography.h6
    },
    '& .fc-list-heading-alt': {
      ...theme.typography.h6
    },
    '& .fc th': {
      borderColor: theme.palette.divider
    },
    '& .fc-day-header': {
      ...theme.typography.subtitle2,
      fontWeight: 500,
      color: theme.palette.text.secondary,
      padding: theme.spacing(1),
      backgroundColor: colors.grey[50]
    },
    '& .fc-day-top': {
      ...theme.typography.body2
    },
    '& .fc-highlight': {
      backgroundColor: colors.blueGrey[50]
    },
    '& .fc-event': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderWidth: 2,
      opacity: 0.9,
      '& .fc-time': {
        ...theme.typography.h6,
        color: 'inherit'
      },
      '& .fc-title': {
        ...theme.typography.body1,
        color: 'inherit'
      }
    },
    '& .fc-list-empty': {
      ...theme.typography.subtitle1
    }
  },
  card: {
    marginTop: theme.spacing(3)
  }
}));

// calendar component
const Calendar = () => {
  const classes = useStyles(); ///useStyles object
  const calendarRef = useRef(null); /////calendar referance
  const theme = useTheme(); ////useTheme obj
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm')); ////mobile screen breakpoints
  // states
  const [view, setView] = useState(mobileDevice ? 'listWeek' : 'dayGridMonth');
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventModal, setEventModal] = useState({
    open: false,
    event: null
  });
  const { user } = useSelector(state => state.session);

  // useEffect to fetch data
  useEffect(() => {
    fetchData();
  }, []);

  ////useEffect for mobile view
  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();
    const newView = mobileDevice ? 'listWeek' : 'dayGridMonth';

    calendarApi.changeView(newView);
    setView(newView);
  }, [mobileDevice]);

  // fetch data from db
  const fetchData = async () => {
    const tempData = await tripEvents(user._id);
    tempData.data.map(item => {
      //// trips already passed in red others in green
      if (
        moment(item.end).format('YYYY-MM-DD') <
        moment(new Date()).format('YYYY-MM-DD')
      ) {
        item.color = 'red';
      } else {
        item.color = 'green';
      }
    });
    setEvents(tempData.data);
  };

  // click on calendar event
  const handleEventClick = info => {
    // setting selected event and opening modal
    const selected = events.find(item => {
      return (
        item._id === info.event.id &&
        moment(item.start).format('YYYY-MM-DD') ===
          moment(info.event._instance.range.start).format('YYYY-MM-DD') &&
        moment(item.end).format('YYYY-MM-DD') ===
          moment(info.event._instance.range.end).format('YYYY-MM-DD')
      );
    });
    setEventModal({
      open: true,
      event: selected
    });
  };

  // modal close
  const handleModalClose = () => {
    setEventModal({
      open: false,
      event: null
    });
  };

  // current date
  const handleDateToday = () => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.today();
    setDate(calendarApi.getDate());
  };

  // changes view
  const handleViewChange = view => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.changeView(view);
    setView(view);
  };

  // go to previous date
  const handleDatePrev = () => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.prev();
    setDate(calendarApi.getDate());
  };

  // go to upcoming date
  const handleDateNext = () => {
    const calendarApi = calendarRef.current.getApi();

    calendarApi.next();
    setDate(calendarApi.getDate());
  };

  // when mouse enter an event
  let tooltip = null;
  const handleMouseEnter = arg => {
    console.log('arg', arg);
    tooltip = tippy(arg.el, {
      content: `<div style="color:white; padding:10px;border-radius: 10px;background-color:grey;"><strong>${
        arg.event._def.title
      }</strong><br>${arg.event._def.extendedProps.desc}${moment(
        arg.event._instance.range.start
      ).format('MMMM Do YYYY')} to ${moment(
        arg.event._instance.range.end
      ).format('MMMM Do YYYY')}</div>`,
      allowHTML: true,
      placement: 'top',
      arrow: true,
      duration: 150,
      delay: 150,
      interactive: true,
      animation: 'scale-subtle'
    });
    tooltip.show();
  };

  const handleMouseLeave = () => {
    tooltip !== null && tooltip.destroy();
  };

  // return jsx
  return (
    <Page className={classes.root} title="Calendar">
      <Toolbar
        date={date}
        onDateNext={handleDateNext}
        onDatePrev={handleDatePrev}
        onDateToday={handleDateToday}
        onViewChange={handleViewChange}
        view={view}
      />
      <Card className={classes.card}>
        <CardContent>
          <FullCalendar
            allDayMaintainDuration
            defaultDate={date}
            defaultView={view}
            droppable
            editable
            eventClick={handleEventClick}
            eventResizableFromStart
            events={events}
            header={false}
            height={800}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
              timelinePlugin
            ]}
            displayEventTime={false}
            eventMouseEnter={handleMouseEnter}
            eventMouseLeave={handleMouseLeave}
            ref={calendarRef}
            rerenderDelay={10}
            selectable
            weekends
          />
        </CardContent>
      </Card>
      <Modal onClose={handleModalClose} open={eventModal.open}>
        <AddEditEvent event={eventModal.event} onClose={handleModalClose} />
      </Modal>
    </Page>
  );
};

export default Calendar;
