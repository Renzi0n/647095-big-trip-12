import {nanoid} from 'nanoid';
import {StoreSubKey} from '../consts.js';
import EventsModel from '../model/events.js';
import PlacesInfoModel from '../model/places-info.js';
import OffersModel from '../model/offers.js';

const getSyncedEvents = (items) => {
  return items
    .filter(({success}) => success)
    .map(({payload}) => {
      return payload.point;
    });
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEvents() {
    return this._api.getEvents()
      .then((events) => {
        const items = createStoreStructure(events.map(EventsModel.adaptToServer));
        this._store.setItems(StoreSubKey.EVENTS, items);
        return events;
      }).catch(() => {
        const storeEvents = Object.values(this._store.getItems(StoreSubKey.EVENTS));

        return Promise.resolve(storeEvents.map(EventsModel.adaptToClient));
      });
  }

  getAllOffers() {
    return this._api.getAllOffers()
      .then((offers) => {
        OffersModel.setOffers(offers);
        this._store.setItems(StoreSubKey.OFFERS, offers);
        return offers;
      }).catch(() => {
        const storeOffers = this._store.getItems(StoreSubKey.OFFERS);
        OffersModel.setOffers(storeOffers);

        return Promise.resolve(storeOffers);
      });
  }

  getAllDestinations() {
    return this._api.getAllDestinations()
      .then((destinations) => {
        PlacesInfoModel.setPlacesInfo(destinations);
        this._store.setItems(StoreSubKey.PLACES_INFO, destinations);
        return destinations;
      }).catch(() => {
        const storeDestinations = this._store.getItems(StoreSubKey.PLACES_INFO);
        PlacesInfoModel.setPlacesInfo(storeDestinations);

        return Promise.resolve(storeDestinations);
      });
  }

  getAllData() {
    return Promise.all([
      this.getAllDestinations(),
      this.getAllOffers(),
      this.getEvents()
    ]).then((res) => res[2]);
  }

  updateEvent(event) {
    return this._api.updateEvent(event)
      .then((updatedEvent) => {
        this._store.setItem(StoreSubKey.EVENTS, updatedEvent.id, EventsModel.adaptToServer(updatedEvent));
        return updatedEvent;
      }).catch(() => {
        this._store.setItem(StoreSubKey.EVENTS, event.id, EventsModel.adaptToServer(Object.assign({}, event)));

        return Promise.resolve(event);
      });
  }

  addEvent(event) {
    return this._api.addEvent(event)
      .then((newEvent) => {
        this._store.setItem(StoreSubKey.EVENTS, newEvent.id, EventsModel.adaptToServer(newEvent));
        return newEvent;
      }).catch(() => {
        const localNewEventId = nanoid();
        const localNewEvent = Object.assign({}, event, {id: localNewEventId});

        this._store.setItem(StoreSubKey.EVENTS, localNewEvent.id, EventsModel.adaptToServer(localNewEvent));

        return Promise.resolve(localNewEvent);
      });
  }

  deleteEvent(event) {
    return this._api.deleteEvent(event)
      .then(() => this._store.removeItem(StoreSubKey.EVENTS, event.id))
      .catch(() => {
        this._store.removeItem(StoreSubKey.EVENTS, event.id);

        return Promise.resolve();
      });
  }

  sync() {
    const storeEvents = this._store.getItems(StoreSubKey.EVENTS);

    return this._api.sync(storeEvents)
      .then((response) => {
        const createdEvents = getSyncedEvents(response.created);
        const updatedEvents = getSyncedEvents(response.updated);

        const items = createStoreStructure([...createdEvents, ...updatedEvents]);

        this._store.setItems(StoreSubKey.EVENTS, items);
      }).catch(() => {
        return Promise.reject(new Error(`Sync data failed`));
      });
  }
}
