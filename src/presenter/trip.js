import SortView from '../view/sort.js';
import TripDaysListView from '../view/trip-days-list.js';
import TripDayView from '../view/trip-day.js';
import EventPresenter from './event.js';
import NoEventsView from '../view/no-events.js';
import EventNewPresenter from "./event-new.js";
import {sortEventsDates, sortEventsPrice, sortEventsTime, filterEvents} from '../utils/event.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UpdateType, UserAction, SortType, FilterType} from "../consts.js";


export default class Trip {
  constructor(tripContainer, eventsModel, filterModel) {
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._eventPresenter = {};
    this._tripDays = {};
    this._currentSortType = SortType.EVENT;

    this._tripDaysListComponent = new TripDaysListView();
    this._noEventsComponent = new NoEventsView();
    this._sortComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._updateTrip = this._updateTrip.bind(this);

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(this._tripDaysListComponent.getElement(), this._handleViewAction);
  }

  init() {
    this._sortedEventsDates = sortEventsDates(this._getEvents());

    this._currentSortType = SortType.EVENT;

    render(this._tripContainer, this._tripDaysListComponent, RenderPosition.BEFOREEND);
    this._renderSort();

    this._renderTripDays();
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filterEvents(events)[filterType];

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sortEventsTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortEventsPrice);
    }

    return filteredEvents;
  }

  createEvent() {
    this._currentSortType = SortType.EVENT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      remove(this._sortComponent);
    }

    this._sortComponent = new SortView(this._currentSortType);

    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._updateTrip);
  }

  _renderEvents(container, events) {
    events = this._currentSortType === SortType.EVENT ? events : this._getEvents();
    events.forEach((event) => this._renderEvent(container, event));
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

  _renderTripDays() {
    if (!this._getEvents().length) {
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
    const eventPresenter = new EventPresenter(container, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(data, updateType) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._sortedEventsDates = sortEventsDates(this._getEvents());
        this._updateTrip(this._currentSortType, true);
        break;
      case UpdateType.MAJOR:
        this._sortedEventsDates = sortEventsDates(this._getEvents());
        this._updateTrip(SortType.EVENT, true);
        break;
    }
  }

  _updateTrip(sortType, isChangeData) {
    if (this._currentSortType === sortType && !isChangeData) {
      return;
    }

    this._eventNewPresenter.destroy();

    this._clearTripDaysList();

    this._currentSortType = sortType;

    if (sortType !== SortType.EVENT) {
      this._renderEvents(this._tripDaysListComponent, this._getEvents());
    } else {
      this._renderTripDays();
      this._renderSort();
    }
  }
}
