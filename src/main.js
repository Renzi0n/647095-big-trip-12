import MenuView from './view/menu.js';
import TripInfoView from './view/trip-info.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from "./presenter/filter.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import StatsView from "./view/stats.js";
import {generateEvent} from './mock/event.js';
import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem} from './consts.js';


const EVENTS_COUNT = 20;


const eventsData = new Array(EVENTS_COUNT).fill().map(generateEvent);

const eventsModel = new EventsModel();
eventsModel.setEvents(eventsData);

const filterModel = new FilterModel();

const tripEventsMainNode = document.querySelector(`.trip-events`);
const tripPresenter = new TripPresenter(tripEventsMainNode, eventsModel, filterModel);

const tripInfoNode = document.querySelector(`.trip-main`);
const tripControlsNode = tripInfoNode.querySelector(`.trip-controls`);

const filterPresenter = new FilterPresenter(tripControlsNode, filterModel, eventsModel);

const menuComponent = new MenuView();

render(tripInfoNode, new TripInfoView(), RenderPosition.AFTERBEGIN);
render(tripControlsNode, menuComponent, RenderPosition.BEFOREEND);


let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      menuComponent.setMenuItem(menuItem);
      tripPresenter.init();
      remove(statsComponent);
      break;
    case MenuItem.STATS:
      menuComponent.setMenuItem(menuItem);
      tripPresenter.destroy();

      statsComponent = new StatsView(eventsModel.getEvents());
      render(tripEventsMainNode, statsComponent, RenderPosition.BEFOREEND);
      break;
    case MenuItem.NEW_EVENT:
      if (statsComponent !== null) {
        remove(statsComponent);
      }
      tripPresenter.destroy();
      tripPresenter.init();
      tripPresenter.createEvent(() => menuComponent.setMenuItem(MenuItem.TABLE));
      menuComponent.resetMenuItem();
      break;
  }
};

menuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  handleSiteMenuClick(MenuItem.NEW_EVENT);
});
