import AbstractView from './abstract.js';

const createTripDayTemplate = (date, number) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${number}</span>
        <time class="day__date" datetime="${date}">
          ${new Date(date).toLocaleDateString(`en-US`, {month: `short`, day: `numeric`})}
        </time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class TripDay extends AbstractView {
  constructor(date, number, ...events) {
    super();

    this._date = date;
    this._number = number;
    this._events = events;
  }

  getTemplate() {
    return createTripDayTemplate(this._date, this._number, this._events);
  }
}

