import {SUFFIX, TRANSPORT_TYPES} from './consts.js';

export const getRandomInteger = (min = 0, max = 1) => {
  const lower = Math.ceil(Math.min(min, max));
  const upper = Math.floor(Math.max(min, max));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = (elements) => {
  const randomIndex = getRandomInteger(0, elements.length - 1);

  return elements[randomIndex];
};

export const getRandomNumberElements = (elements) => {
  const randomNumber = getRandomInteger(0, elements.length - 1);

  return elements.slice(0, randomNumber);
};

export const getRandomBooleanValue = () => {
  return Boolean(getRandomInteger(0, 1));
};

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

export const RenderPosition = {
  AFTERBEGIN: `AFTERBEGIN`,
  BEFOREEND: `BEFOREEND`
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};
