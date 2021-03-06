import SortView from '../view/sort.js';
import TripDaysListView from '../view/trip-days-list.js';
import TripDayView from '../view/trip-day.js';
import EventPresenter, {State as EventPresenterViewState} from './event.js';
import NoEventsView from '../view/no-events.js';
import EventNewPresenter from "./event-new.js";
import LoadingView from "../view/loading.js";
import TripInfoView from '../view/trip-info.js';
import {sortEventsDates, sortEventsPrice, sortEventsTime, filterEvents} from '../utils/event.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {UpdateType, UserAction, SortType, FilterType} from "../consts.js";


export default class Trip {
  constructor(tripElement, eventsModel, filterModel, api) {
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._tripElement = tripElement;
    this._eventPresenter = {};
    this._tripDays = {};
    this._currentSortType = SortType.EVENT;
    this._isLoading = true;
    this._api = api;

    this._tripDaysListComponent = null;
    this._sortComponent = null;
    this._noEventsComponent = null;
    this._tripInfoComponent = null;
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleEventModeChange = this._handleEventModeChange.bind(this);
    this._updateTrip = this._updateTrip.bind(this);
  }

  init(isOpenNewEvent = false) {
    this._isOpenNewEvent = isOpenNewEvent;
    this._sortedEventsDates = sortEventsDates(this._getEvents());

    this._tripDaysListComponent = new TripDaysListView();
    this._eventNewPresenter = new EventNewPresenter(this._tripDaysListComponent.getElement(), this._handleViewAction);

    this._currentSortType = SortType.EVENT;

    this._eventsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTripDays();

    render(this._tripElement, this._tripDaysListComponent, RenderPosition.BEFOREEND);

    remove(this._tripInfoComponent);
    this._tripInfoComponent = new TripInfoView(this._getEvents());
    render(document.querySelector(`.trip-main`), this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents().slice();
    const filteredEvents = filterEvents(events)[filterType];

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredEvents.sort(sortEventsTime);
      case SortType.PRICE:
        return filteredEvents.sort(sortEventsPrice);
    }
    return filteredEvents;
  }

  destroy() {
    remove(this._sortComponent);
    remove(this._tripDaysListComponent);

    this._eventsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);

    this._clearTripDaysList();
  }

  createEvent(callback) {
    this._currentSortType = SortType.EVENT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init(() => {
      this._isOpenNewEvent = false;
      this._clearTripDaysList();
      this._renderTripDays();
      callback();
    });
  }

  _renderSort() {
    if (this._getEvents().length && !this._isLoading && !this._isOpenNewEvent) {
      this._clearSort();

      this._sortComponent = new SortView(this._currentSortType);

      render(this._tripElement, this._sortComponent, RenderPosition.AFTERBEGIN);
      this._sortComponent.setSortTypeChangeHandler(this._updateTrip);
    }
  }

  _renderEvents(container, events) {
    events = this._currentSortType === SortType.EVENT ? events : this._getEvents();
    events.forEach((event) => this._renderEvent(container, event));
  }

  _clearTripDaysList() {
    this._clearSort();
    this._clearEvents();
    Object
      .values(this._tripDays)
      .forEach((day) => remove(day));
    this._clearNoEvents();
  }

  _clearSort() {
    remove(this._sortComponent);
  }

  _clearNoEvents() {
    if (this._noEventsComponent) {
      remove(this._noEventsComponent);
    }
  }

  _clearEvents() {
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenter = {};
  }

  _renderTripDays() {
    if (!this._getEvents().length && !this._isLoading && !this._isOpenNewEvent) {
      this._noEventsComponent = new NoEventsView();
      render(this._tripElement, this._noEventsComponent, RenderPosition.BEFOREEND);
      return;
    }
    this._renderSort();

    remove(this._loadingComponent);

    Object.keys(this._sortedEventsDates).forEach((date, counter) => {
      this._tripDayComponent = new TripDayView(date, ++counter);
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
    const eventPresenter = new EventPresenter(container, this._handleViewAction, this._handleEventModeChange);
    eventPresenter.init(event);
    this._eventPresenter[event.id] = eventPresenter;
  }

  _renderLoading() {
    render(this._tripElement, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _updateTrip(sortType, isChangeData) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._currentSortType === sortType && !isChangeData) {
      return;
    }

    this._clearTripDaysList();

    this._currentSortType = sortType;

    this._tripInfoComponent.updateTripInfo(this._eventsModel.getEvents().slice());

    this._eventNewPresenter.destroy();

    if (sortType !== SortType.EVENT) {
      this._renderEvents(this._tripDaysListComponent, this._getEvents());
      this._renderSort();
    } else {
      this._sortedEventsDates = sortEventsDates(this._getEvents());
      this._renderTripDays();
    }
  }

  _handleEventModeChange() {
    this._eventNewPresenter.destroy();
    Object
      .values(this._eventPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        if (updateType !== UpdateType.FAVORITING) {
          this._eventPresenter[update.id].setViewState(EventPresenterViewState.SAVING);
        }
        this._api.updateEvent(update)
          .then((response) => {
            this._eventsModel.updateEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT:
        this._eventNewPresenter.setSaving();
        this._api.addEvent(update)
          .then((response) => {
            this._eventsModel.addEvent(updateType, response);
          })
          .catch(() => {
            this._eventPresenter[update.id].setAborting();
          });
        break;
      case UserAction.DELETE_EVENT:
        this._eventPresenter[update.id].setViewState(EventPresenterViewState.DELETING);
        this._api.deleteEvent(update)
          .then(() => {
            this._eventsModel.deleteEvent(updateType, update);
          })
          .catch(() => {
            if (this._eventPresenter[update.id]) {
              this._eventPresenter[update.id].setViewState(EventPresenterViewState.ABORTING);
            }
          });
        break;
    }
  }

  _handleModelEvent(data, updateType) {
    switch (updateType) {
      case UpdateType.FAVORITING:
        this._eventPresenter[data.id].init(data, true);
        break;
      case UpdateType.PATCH:
        this._eventPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._updateTrip(this._currentSortType, true);
        break;
      case UpdateType.MAJOR:
        this._updateTrip(SortType.EVENT, true);
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._updateTrip(SortType.EVENT, true);
        break;
    }
  }
}
