import he from "he";
import SmartView from './smart.js';
import PlacesInfoModel from '../model/places-info.js';
import OffersModel from '../model/offers.js';
import {generateSuffix, humanizeDate} from '../utils/event.js';
import {TRANSPORT_TYPES, PLACE_TYPES} from '../consts.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';


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
        ${placeInfo.photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join(``)}
        </div>
      </div>
    </section>` : ``;
};

const createEventEditOffersTemplate = (offers, type) => {
  return OffersModel.getOffersForType(type.toLowerCase()).map(({title, price}) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1"
      type="checkbox" name="event-offer-${title}"
      ${offers.some((offer) => offer.title === title) ? `checked` : ``}
      value="${title}">
      <label class="event__offer-label" for="event-offer-${title}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`).join(``);
};

const createCitiesTemplate = () => {
  return PlacesInfoModel.getPlacesInfo().map(({name}) => `<option value="${name}"></option>`).join(``);
};

const createEventEditTemplate = (event) => {
  const {type, offers, city, price, date, timeOver, placeInfo, isFavorite} = event;

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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createCitiesTemplate()}
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(`${price}`)}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite"
          ${isFavorite ? `checked` : ``}>
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
              ${createEventEditOffersTemplate(offers, type)}
            </div>
          </section>

          ${createEventEditPlaceInfoTemplate(placeInfo)}

        </section>
      </form>
    </li>`
  );
};

export default class EventEdit extends SmartView {
  constructor(event) {
    super();

    this._event = event ? event : this._getDefaultEvent();
    this._datepickerStart = null;
    this._datepickerOver = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._favoriteHandler = this._favoriteHandler.bind(this);
    this._offersHandler = this._offersHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._typesHandler = this._typesHandler.bind(this);
    this._cityHandler = this._cityHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateOverChangeHandler = this._dateOverChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setOverDatepicker();
  }

  getTemplate() {
    return createEventEditTemplate(this._event);
  }

  _setStartDatepicker() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    if (this._event.date) {
      this._datepickerStart = flatpickr(
          this.getElement().querySelector(`#event-start-time-1`),
          {
            enableTime: true,
            [`time_24hr`]: true,
            dateFormat: `d/m/y H:i`,
            defaultDate: this._event.date,
            maxDate: this._event.timeOver,
            onClose: this._dateStartChangeHandler
          }
      );
    }
  }

  _setOverDatepicker() {
    if (this._datepickerOver) {
      this._datepickerOver.destroy();
      this._datepickerOver = null;
    }

    if (this._event.timeOver) {
      this._datepickerOver = flatpickr(
          this.getElement().querySelector(`#event-end-time-1`),
          {
            enableTime: true,
            [`time_24hr`]: true,
            dateFormat: `d/m/y H:i`,
            defaultDate: this._event.timeOver,
            minDate: this._event.date,
            onClose: this._dateOverChangeHandler
          }
      );
    }
  }

  _dateStartChangeHandler([userDate]) {
    this.updateData({
      date: userDate
    });
  }

  _dateOverChangeHandler([userDate]) {
    this.updateData({
      timeOver: userDate
    });
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerOver) {
      this._datepickerOver.destroy();
      this._datepickerOver = null;
    } else if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }
  }

  reset(event) {
    this.updateData(
        Object.assign(
            {},
            event
        )
    );
  }

  _getDefaultEvent() {
    const city = PlacesInfoModel.getPlacesInfo()[0].name;
    const type = `Flight`;
    const placeInfo = PlacesInfoModel.getPlacesInfoForCity(city);

    return {
      type,
      offers: [],
      city,
      price: `0`,
      date: new Date(),
      timeOver: new Date(),
      placeInfo: {
        photos: placeInfo.pictures,
        description: placeInfo.description
      }
    };
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseHandler(this._callback.formClose);
    this.setFavoriteHandler(this._callback.handleIsFavorite);
    this._setStartDatepicker();
    this._setOverDatepicker();
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__available-offers`).addEventListener(`click`, this._offersHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceInputHandler);
    this.getElement().querySelector(`.event__type-list`).addEventListener(`click`, this._typesHandler);
    this.getElement().querySelector(`#event-destination-1`).addEventListener(`change`, this._cityHandler);
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formCloseHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteHandler(callback) {
    this._callback.handleIsFavorite = callback;
    this.getElement().querySelector(`#event-favorite-1`).addEventListener(`click`, this._favoriteHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._event);
  }

  _typesHandler(evt) {
    if (evt.target.tagName === `INPUT`) {
      this.updateData({
        type: evt.target.value
      });
    }
  }

  _favoriteHandler() {
    this._callback.handleIsFavorite(this._event);
  }

  _formCloseHandler() {
    this._callback.formClose();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._event);
  }

  _cityHandler(evt) {
    evt.preventDefault();
    const city = evt.target.value;
    const pictures = PlacesInfoModel.getPlacesInfoForCity(city).pictures;
    const description = PlacesInfoModel.getPlacesInfoForCity(city).description;

    this.updateData({
      city: evt.target.value,
      placeInfo: {
        photos: pictures,
        description,
      }
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: evt.target.value
    }, true);
  }

  _offersHandler(evt) {
    if (evt.target.tagName === `INPUT`) {
      const currentOffer = OffersModel.getOffersForType(this._event.type)
        .filter((offer) => offer.title === evt.target.value)[0];

      if (evt.target.checked) {
        this.updateData({
          offers: [
            ...this._event.offers.slice(),
            currentOffer
          ]
        });
      } else {
        const currentIndex = this._event.offers.findIndex((offer) => offer.title === evt.target.value);

        this.updateData({
          offers: [
            ...this._event.offers.slice(0, currentIndex),
            ...this._event.offers.slice(currentIndex + 1)
          ]
        });
      }
    }
  }
}
