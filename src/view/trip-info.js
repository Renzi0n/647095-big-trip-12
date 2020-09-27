import AbstractView from './abstract.js';
import {getTripTitle, getTripDates, getTripPrice} from '../utils/trip-info.js';

const createTripInfoTemplate = (events) => {
  let title = ``;
  let dates = ``;
  let price = `0`;

  if (events.length) {
    title = getTripTitle(events);
    dates = getTripDates(events);
    price = getTripPrice(events);
  }

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
      </p>
    </section>`
  );
};

export default class TripInfo extends AbstractView {
  constructor(events) {
    super();

    this._events = events;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }

  updateTripInfo(events) {
    this._events = events;

    let prevElement = this.getElement();
    this.removeElement();

    const newElement = this.getElement();

    prevElement.replaceWith(newElement);
    prevElement = null;
  }
}
