import {generateSuffix} from '../utils.js';

const createEventOffersTemplate = (offers) => {
  return offers.map((offer) => `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
    </li>`).join(``);
};

const getTimeOfDate = (date) => {
  const options = {hour: `numeric`, minute: `numeric`, hour12: false};

  return date.toLocaleString(`en-US`, options);
};

const getEventDuration = (timeStart, timeOver) => {
  const duration = new Date(timeOver - timeStart);
  const min = Math.round(duration / 60000);

  const minInHour = `${min % 60}M`;
  const hours = min < 60 ? `` : `${Math.trunc(Math.round(min / 60))}H `;

  return hours + minInHour;
};

export const createEventTemplate = (eventsData) => {
  const {type, offers, city, price, date, timeOver} = eventsData;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
        </div>
        <h3 class="event__title">${type} ${generateSuffix(type)} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${date}">${getTimeOfDate(date)}</time>
            &mdash;
            <time class="event__end-time" datetime="${timeOver}">${getTimeOfDate(timeOver)}</time>
          </p>
          <p class="event__duration">${getEventDuration(date, timeOver)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
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