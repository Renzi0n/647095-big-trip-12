import AbstractView from './abstract.js';
import {generateSuffix} from '../utils/event.js';
import {TRANSPORT_TYPES, PLACE_TYPES} from '../consts.js';


const humanizeDate = (date) => {
  const options = {year: `2-digit`, month: `2-digit`, day: `2-digit`, hour: `numeric`, minute: `numeric`, hour12: false};

  return `${date.toLocaleString(`en-GB`, options).replace(/,/, ``)} `;
};

const createEventEditTypesTemplate = (checkedType, types) => {
  return types.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
      value="${type}"
      ${type === checkedType ? `checked` : ``}
      >
      <label class="event__type-label event__type-label--${type.toLowerCase()}" for="event-type-${type}-1">${type}</label>
    </div>`).join(``);
};

const createEventEditPlaceInfoTemplate = (placeInfo) => {
  return placeInfo ?
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">
        ${placeInfo.description}
      </p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
        ${placeInfo.photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
        </div>
      </div>
    </section>` : ``;
};

const createEventEditOffersTemplate = (offers) => {
  return offers.map((offer) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1"
      type="checkbox" name="event-offer-${offer.title}"
      ${offer.check ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${offer.title}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join(``);
};

const createEventEditTemplate = (event) => {
  const {type, offers, city, price, date, timeOver, placeInfo} = event;

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-${type}-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-${type}-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>

                ${createEventEditTypesTemplate(type, TRANSPORT_TYPES)}
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>

                ${createEventEditTypesTemplate(type, PLACE_TYPES)}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type} ${generateSuffix(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(date)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=" ${humanizeDate(timeOver)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${createEventEditOffersTemplate(offers)}
            </div>
          </section>

          ${createEventEditPlaceInfoTemplate(placeInfo)}

        </section>
      </form>
    </li>`
  );
};

export default class EventEdit extends AbstractView {
  constructor(event) {
    super();

    this._event = event || this._getDefaultEvent();

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
  }

  getTemplate() {
    return createEventEditTemplate(this._event);
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCloseHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _formCloseHandler() {
    this._callback.formClose();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._event);
  }

  _getDefaultEvent() {
    return {
      type: `Flight`,
      offers: [
        {title: `uber`, price: 30, check: true}
      ],
      city: ``,
      price: ``,
      date: new Date(`2019-03-18T00:00`),
      timeOver: new Date(`2019-03-18T01:00`),
      placeInfo: {}
    };
  }
}
