import {createTripInfoTemplate} from './view/tripInfo.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createTripDaysListTemplate} from './view/tripDaysList.js';
import {createTripDayTemplate} from './view/tripDay.js';
import {createEventTemplate} from './view/event.js';
import {createEventEditTemplate} from './view/eventEdit.js';


const EVENTS_COUNT = 3;


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};


const tripInfoNode = document.querySelector(`.trip-main`);
const tripControlsNode = tripInfoNode.querySelector(`.trip-controls`);

render(tripInfoNode, createTripInfoTemplate(), `afterbegin`);
render(tripControlsNode, createMenuTemplate(), `beforeend`);
render(tripControlsNode, createFiltersTemplate(), `beforeend`);

const tripEventsMainNode = document.querySelector(`.trip-events`);

render(tripEventsMainNode, createSortTemplate(), `beforeend`);
render(tripEventsMainNode, createTripDaysListTemplate(), `beforeend`);

const tripDaysListNode = tripEventsMainNode.querySelector(`.trip-days`);

render(tripDaysListNode, createTripDayTemplate(), `beforeend`);

const tripEventsListNode = tripDaysListNode.querySelector(`.trip-events__list`);

render(tripEventsListNode, createEventEditTemplate(), `beforeend`);
for (let i = 0; i < EVENTS_COUNT; i++) {
  render(tripEventsListNode, createEventTemplate(), `beforeend`);
}
