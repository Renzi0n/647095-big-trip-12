import {Suffix, TRANSPORT_TYPES, FilterType} from '../consts.js';
import moment from "moment";

const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return new Date(currentDate);
};

const isEventFuture = (date) => {
  return date === null ? false : moment(getCurrentDate()).isBefore(date);
};

const isEventExpired = (date) => {
  return date === null ? false : moment(getCurrentDate()).isAfter(date);
};

export const humanizeDate = (date) => {
  return moment(date).format(`D/MM/YY H:mm`);
};

export const generateSuffix = (type) => {
  return TRANSPORT_TYPES.includes(type) ? Suffix.TRANSPORT : Suffix.PLACE;
};

export const sortEventsDates = (events) => {
  const sortedEvents = events.sort((next, prev) => {
    return next.date.getTime() - prev.date.getTime();
  });

  return sortedEvents.reduce((acc, event) => {
    const dateString = event.date.toDateString();

    return Object.assign(acc, {
      [dateString]: [...acc[dateString] || [], event]
    });
  }, {});
};

export const sortEventsPrice = (eventA, eventB) => {
  return eventB.price - eventA.price;
};

export const sortEventsTime = (eventA, eventB) => {
  return (eventB.timeOver - eventB.date) - (eventA.timeOver - eventA.date);
};

export const isDatesEqual = (dateA, dateB) => {
  return dateA === null && dateB === null ? true : moment(dateA).isSame(dateB, `day`);
};

export const filterEvents = (events) => {
  return events.reduce((acc, event) => Object.assign(
      acc,
      {
        [FilterType.EVERYTHING]: events,
        [FilterType.FUTURE]: isEventFuture(event.date) ? [...acc[FilterType.FUTURE], event] : acc[FilterType.FUTURE],
        [FilterType.PAST]: isEventExpired(event.date) ? [...acc[FilterType.PAST], event] : acc[FilterType.PAST]
      }
  ), {
    [FilterType.EVERYTHING]: [],
    [FilterType.FUTURE]: [],
    [FilterType.PAST]: []
  });
};

export const getEventDuration = (timeStart, timeOver) => {
  const duration = timeOver ? new Date(timeOver - timeStart) : timeStart;
  const min = Math.round(duration / 60000);

  const minInHour = min % 60 ? `${min % 60}M` : ``;
  let hours = ``;
  if (min > 60 * 24) {
    hours = Math.round(Math.trunc(min / 60)) % 24;
  } else if (min > 60) {
    hours = Math.round(Math.trunc(min / 60));
  }
  const days = min < (60 * 24) ? `` : `${Math.round(Math.trunc(min / (60 * 24)))}D `;

  hours = !hours ? `` : `${hours}H `;

  return `${days}${hours}${minInHour}`;
};
