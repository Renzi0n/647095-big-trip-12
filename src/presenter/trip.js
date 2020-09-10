import SortView from '../view/sort.js';
import TripDaysListView from '../view/trip-days-list.js';
import TripDayView from '../view/trip-day.js';
import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import NoEventsView from '../view/no-events.js';
import {sortEventsDates, sortEventsPrice, sortEventsTime} from '../utils/event.js';
import {render, RenderPosition, replace} from '../utils/render.js';


const SortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._sortComponent = new SortView();
    this._tripDaysListComponent = new TripDaysListView();
    this._noEventsComponent = new NoEventsView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(events) {
    this._events = events.slice();
    this._sortEvents = events.slice();
    this._sortedEventsDates = sortEventsDates(this._events);

    this._currentSortType = SortType.EVENT;

    render(this._tripContainer, this._tripDaysListComponent, RenderPosition.BEFOREEND);
    this._renderSort();

    this._renderTripDays();
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._sortEvents.sort(sortEventsTime);
        break;
      case SortType.PRICE:
        this._sortEvents.sort(sortEventsPrice);
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._clearTripDaysList();

    if (sortType !== SortType.EVENT) {
      this._sortTasks(sortType);
      this._renderEvents(this._tripDaysListComponent, this._sortEvents);
    } else {
      this._renderTripDays();
    }

    this._currentSortType = sortType;
  }

  _clearTripDaysList() {
    this._tripDaysListComponent.getElement().innerHTML = ``;
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvents(container, events) {
    events.forEach((event) => this._renderEvent(container, event));
  }

  _renderTripDays() {
    if (!this._events.length) {
      render(this._tripContainer, new NoEventsView(), RenderPosition.BEFOREEND);
      return;
    }

    Object.keys(this._sortedEventsDates).forEach((date, number) => {
      this._tripDayComponent = new TripDayView(date, ++number);
      this._tripDayEventsList = this._tripDayComponent.getElement().querySelector(`.trip-events__list`);

      this._renderTripDay(date);
    });
  }

  _renderTripDay(date) {
    render(this._tripDaysListComponent, this._tripDayComponent, RenderPosition.BEFOREEND);

    this._renderEvents(this._tripDayEventsList, this._sortedEventsDates[date]);
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
