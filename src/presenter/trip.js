import SortView from '../view/sort.js';
import TripDaysListView from '../view/trip-days-list.js';
import TripDayView from '../view/trip-day.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import NoEventsView from '../view/no-events.js';
import {sortEventsDates} from '../utils/event.js';
import {render, RenderPosition, replace} from '../utils/render.js';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._sortComponent = new SortView();
    this._tripDaysListComponent = new TripDaysListView();
    this._noEventsComponent = new NoEventsView();
  }

  init(events) {
    this._events = events;
    this._sortedEventsDates = sortEventsDates(this._events);

    render(this._tripContainer, this._tripDaysListComponent, RenderPosition.BEFOREEND);
    this._renderSort();

    this._renderTripDays();
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripDays() {
    if (!this._events.length) {
      render(this._tripContainer, new NoEventsView(), RenderPosition.BEFOREEND);
      return;
    }

    Object.keys(this._sortedEventsDates).forEach((date, number) => {
      this._tripDayComponent = new TripDayView(date, ++number);
      this._tripDayEventsList = this._tripDayComponent.eventsListNode;

      this._renderTripDay(date);
    });
  }

  _renderTripDay(date) {
    render(this._tripDaysListComponent, this._tripDayComponent, RenderPosition.BEFOREEND);

    this._sortedEventsDates[date].forEach((event) => this._renderEvent(this._tripDayEventsList, event));
  }

  _renderEvent(container, event) {
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

    render(container, eventComponent, RenderPosition.BEFOREEND);
  }
}
