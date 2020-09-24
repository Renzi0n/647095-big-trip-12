import Observer from "../utils/observer.js";
import moment from 'moment';

const adaptDateToServer = (date) => {
  return moment(date).format(`YYYY-MM-DDThh:mm:ss.sssZ`);
};

export default class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();

    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          type: event.type[0].toUpperCase() + event.type.slice(1),
          city: event.destination.name,
          price: event.base_price,
          isFavorite: event.is_favorite,
          placeInfo: {
            description: event.destination.description,
            photos: event.destination.pictures
          },
          date: new Date(event.date_from),
          timeOver: new Date(event.date_to)
        }
    );

    delete adaptedEvent.base_price;
    delete adaptedEvent.destination;
    delete adaptedEvent.is_favorite;
    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;

    return adaptedEvent;
  }

  static adaptToServer(event) {
    const adaptedEvent = Object.assign(
        {},
        event,
        {
          type: event.type.toLowerCase(),
          [`base_price`]: event.price,
          [`is_favorite`]: event.isFavorite,
          destination: {
            description: event.placeInfo.description,
            pictures: event.placeInfo.photos,
            name: event.city
          },
          [`date_from`]: adaptDateToServer(event.date),
          [`date_to`]: adaptDateToServer(event.timeOver)
        }
    );

    delete adaptedEvent.city;
    delete adaptedEvent.price;
    delete adaptedEvent.isFavorite;
    delete adaptedEvent.placeInfo;
    delete adaptedEvent.date;
    delete adaptedEvent.timeOver;

    return adaptedEvent;
  }
}
