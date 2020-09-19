import SortView from '../view/sort.js';
import TripDaysListView from '../view/trip-days-list.js';
import TripDayView from '../view/trip-day.js';
import EventPresenter from './event.js';
import NoEventsView from '../view/no-events.js';
import {sortEventsDates, sortEventsPrice, sortEventsTime} from '../utils/event.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {updateItem} from "../utils/common.js";


const SortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`,
};


export default class Trip {
  constructor(tripContainer, eventsModel) {
    this._eventsModel = eventsModel;
    this._tripContainer = tripContainer;
    this._eventPresenter = {};
    this._tripDays = {};

    this._sortComponent = new SortView();
    this._tripDaysListComponent = new TripDaysListView();
    this._noEventsComponent = new NoEventsView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
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

  _getEvents() {
    return this._eventsModel.getEvents();
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

  _clearTripDaysList() {
    Object
      .values(this._tripDays)
      .forEach((day) => remove(day));
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
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

    this._tripDays[date] = this._tripDayComponent;

    this._renderEvents(this._tripDayEventsList, this._sortedEventsDates[date]);
  }

  _renderEvent(container, event) {
    const eventPresenter = new EventPresenter(container, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _handleModeChange() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventChange(updatedEvent) {
    this._events = updateItem(this._events, updatedEvent);
    this._sortEvents = updateItem(this._sortEvents, updatedEvent);

    this._eventPresenter[updatedEvent.id].init(updatedEvent);

    this._sortedEventsDates = sortEventsDates(this._events);

    this._handleSortTypeChange(this._currentSortType, true);
  }

  _handleSortTypeChange(sortType, isChangeData) {
    if (this._currentSortType === sortType && !isChangeData) {
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
}
