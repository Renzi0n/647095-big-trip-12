import {createTripInfoTemplate} from './view/tripInfo.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createTripDaysListTemplate} from './view/tripDaysList.js';
import {createTripDayTemplate} from './view/tripDay.js';
import {generateEvent} from './mock/event.js';
import {getSortedEventsDates, render} from './utils.js';


const EVENTS_COUNT = 20;


const eventsData = new Array(EVENTS_COUNT).fill().map(generateEvent);
const sortedEventsDates = getSortedEventsDates(eventsData);


const tripInfoNode = document.querySelector(`.trip-main`);
const tripControlsNode = tripInfoNode.querySelector(`.trip-controls`);

render(tripInfoNode, createTripInfoTemplate(), `afterbegin`);
render(tripControlsNode, createMenuTemplate(), `beforeend`);
render(tripControlsNode, createFiltersTemplate(), `beforeend`);

const tripEventsMainNode = document.querySelector(`.trip-events`);

render(tripEventsMainNode, createSortTemplate(), `beforeend`);
render(tripEventsMainNode, createTripDaysListTemplate(), `beforeend`);

const tripDaysListNode = tripEventsMainNode.querySelector(`.trip-days`);

Object.keys(sortedEventsDates).forEach((item, number) => {
  render(tripDaysListNode, createTripDayTemplate(item, ++number, ...sortedEventsDates[item]), `beforeend`);
});
