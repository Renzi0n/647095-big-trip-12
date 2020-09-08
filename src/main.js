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
import {getSortedEventsDates} from './utils/event.js';
import {render, RenderPosition, replace} from './utils/render.js';


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
    replace(eventEditComponent, eventComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const replaceFormToEvent = () => {
    replace(eventComponent, eventEditComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  eventComponent.setEditClickHandler(replaceEventToForm);
  eventEditComponent.setFormCloseHandler(replaceFormToEvent);
  eventEditComponent.setFormSubmitHandler(replaceFormToEvent);

  render(eventsList, eventComponent, RenderPosition.BEFOREEND);
};

const tripInfoNode = document.querySelector(`.trip-main`);
const tripControlsNode = tripInfoNode.querySelector(`.trip-controls`);

render(tripInfoNode, new TripInfoView(), RenderPosition.AFTERBEGIN);
render(tripControlsNode, new MenuView(), RenderPosition.BEFOREEND);
render(tripControlsNode, new FiltersView(), RenderPosition.BEFOREEND);

const tripEventsMainNode = document.querySelector(`.trip-events`);

if (eventsData.length) {
  const sortedEventsDates = getSortedEventsDates(eventsData);

  const TripDaysListComponent = new TripDaysListView();
  render(tripEventsMainNode, new SortView(), RenderPosition.BEFOREEND);
  render(tripEventsMainNode, TripDaysListComponent, RenderPosition.BEFOREEND);

  Object.keys(sortedEventsDates).forEach((item, number) => {
    const TripDayComponent = new TripDayView(item, ++number);
    const tripDayEventsList = TripDayComponent.eventsListNode;

    render(TripDaysListComponent, TripDayComponent, RenderPosition.BEFOREEND);

    sortedEventsDates[item].forEach((event) => renderEvent(tripDayEventsList, event));
  });
} else {
  render(tripEventsMainNode, new NoEventsView(), RenderPosition.BEFOREEND);
}
