import {SUFFIX, TRANSPORT_TYPES, FilterType} from '../consts.js';
import moment from "moment";

const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);

  return new Date(currentDate);
};

const isEventFuture = (date) => {
  if (date === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return moment(currentDate).isBefore(date);
};

const isEventExpired = (date) => {
  if (date === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return moment(currentDate).isAfter(date);
};

export const generateSuffix = (type) => {
  return TRANSPORT_TYPES.includes(type) ? SUFFIX.transport : SUFFIX.place;
};

export const sortEventsDates = (events) => {
  const sortedEvents = events.sort((next, prev) => { // Сортируем точки маршрута по возрастанию даты
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
  if (dateA === null && dateB === null) {
    return true;
  }

  return moment(dateA).isSame(dateB, `day`);
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
