import {SUFFIX, TRANSPORT_TYPES} from '../consts.js';

export const generateSuffix = (type) => {
  return TRANSPORT_TYPES.includes(type) ? SUFFIX.transport : SUFFIX.place;
};

export const getSortedEventsDates = (events) => {
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
