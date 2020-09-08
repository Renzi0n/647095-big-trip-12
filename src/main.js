import MenuView from './view/menu.js';
import FiltersView from './view/filters.js';
import SortView from './view/sort.js';
import TripInfoView from './view/trip-info.js';
import TripDaysListView from './view/trip-days-list.js';
import TripDayView from './view/trip-day.js';
import EventView from './view/event.js';
import EventEditView from './view/event-edit.js';
import NoEventsView from './view/no-events.js';
import {generateEvent} from './mock/event.js';
import {getSortedEventsDates, render, RenderPosition} from './utils.js';


const EVENTS_COUNT = 20;


const eventsData = new Array(EVENTS_COUNT).fill().map(generateEvent);


const renderEvent = (eventsList, event) => {
  const eventComponent = new EventView(event);
  const eventEditComponent = new EventEditView(event);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToEvent();
    }
  };

  const replaceEventToForm = () => {
    eventsList.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const replaceFormToEvent = () => {
    eventsList.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  eventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEventToForm();
  });

  eventEditComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToEvent();
  });

  eventEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToEvent();
  });

  render(eventsList, eventComponent.getElement(), RenderPosition.BEFOREEND);
};

const tripInfoNode = document.querySelector(`.trip-main`);
const tripControlsNode = tripInfoNode.querySelector(`.trip-controls`);

render(tripInfoNode, new TripInfoView().getElement(), RenderPosition.AFTERBEGIN);
render(tripControlsNode, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(tripControlsNode, new FiltersView().getElement(), RenderPosition.BEFOREEND);

const tripEventsMainNode = document.querySelector(`.trip-events`);

if (eventsData.length) {
  const sortedEventsDates = getSortedEventsDates(eventsData);

  const TripDaysListComponent = new TripDaysListView();
  render(tripEventsMainNode, new SortView().getElement(), RenderPosition.BEFOREEND);
  render(tripEventsMainNode, TripDaysListComponent.getElement(), RenderPosition.BEFOREEND);

  Object.keys(sortedEventsDates).forEach((item, number) => {
    const TripDayComponent = new TripDayView(item, ++number);
    const tripDayEventsList = TripDayComponent.getElement().querySelector(`.trip-events__list`);

    render(TripDaysListComponent.getElement(), TripDayComponent.getElement(), RenderPosition.BEFOREEND);

    sortedEventsDates[item].forEach((event) => renderEvent(tripDayEventsList, event));
  });
} else {
  render(tripEventsMainNode, new NoEventsView().getElement(), RenderPosition.BEFOREEND);
}
