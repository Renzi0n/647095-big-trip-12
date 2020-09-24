import he from "he";
import AbstractView from './abstract.js';
import {generateSuffix} from '../utils/event.js';
import moment from "moment";
import {getEventDuration} from '../utils/event.js';


const MAX_OFFERS = 3;

const createEventOffersTemplate = (offers) => {
  return offers
    .slice(0, MAX_OFFERS)
    .map((offer) => `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`).join(``);
};

const getTimeOfDate = (date) => {
  if (!(date instanceof Date)) {
    return ``;
  }

  return moment(date).format(`H:mm`);
};

const createEventTemplate = (event) => {
  const {type, offers, city, price, date, timeOver} = event;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event ${type} icon">
        </div>
        <h3 class="event__title">${type} ${generateSuffix(type)} ${he.encode(city)}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${date}">${getTimeOfDate(date)}</time>
            &mdash;
            <time class="event__end-time" datetime="${timeOver}">${getTimeOfDate(timeOver)}</time>
          </p>
          <p class="event__duration">${getEventDuration(date, timeOver)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(`${price}`)}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${createEventOffersTemplate(offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractView {
  constructor(event) {
    super();

    this._event = event;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }
}
