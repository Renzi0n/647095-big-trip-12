import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import TripInfoView from './view/trip-info.js';
import TripPresenter from './presenter/trip.js';
import {generateEvent} from './mock/event.js';
import {render, RenderPosition} from './utils/render.js';


const EVENTS_COUNT = 20;


const eventsData = new Array(EVENTS_COUNT).fill().map(generateEvent);

const tripEventsMainNode = document.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(tripEventsMainNode);


const tripInfoNode = document.querySelector(`.trip-main`);
const tripControlsNode = tripInfoNode.querySelector(`.trip-controls`);

render(tripInfoNode, new TripInfoView(), RenderPosition.AFTERBEGIN);
render(tripControlsNode, new MenuView(), RenderPosition.BEFOREEND);
render(tripControlsNode, new FiltersView(), RenderPosition.BEFOREEND);

tripPresenter.init(eventsData);
