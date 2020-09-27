import MenuView from './view/menu.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from "./presenter/filter.js";
import EventsModel from "./model/events.js";
import FilterModel from "./model/filter.js";
import StatsView from "./view/stats.js";
import Api from "./api.js";
import {render, RenderPosition, remove} from './utils/render.js';
import {MenuItem, UpdateType} from './consts.js';


const AUTHORIZATION = `Basic we3432SF2d52`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;


const tripEventsMainElement = document.querySelector(`.trip-events`);
const tripControlsElement = document.querySelector(`.trip-controls`);


const api = new Api(END_POINT, AUTHORIZATION);
const eventsModel = new EventsModel();
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, eventsModel);
const menuComponent = new MenuView();
const tripPresenter = new TripPresenter(tripEventsMainElement, eventsModel, filterModel, api);


api.getAllData()
  .then((events) => {
    eventsModel.setEvents(UpdateType.INIT, events);
    render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    eventsModel.setEvents(UpdateType.INIT, []);
    render(tripControlsElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

tripPresenter.init();
filterPresenter.init();

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
      render(tripEventsMainElement, statsComponent, RenderPosition.BEFOREEND);
      break;
    case MenuItem.NEW_EVENT:
      if (statsComponent !== null) {
        remove(statsComponent);
      }
      tripPresenter.destroy();
      tripPresenter.init(true);
      tripPresenter.createEvent(() => menuComponent.setMenuItem(MenuItem.TABLE));
      menuComponent.resetMenuItem();
      break;
  }
};

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  handleSiteMenuClick(MenuItem.NEW_EVENT);
});
