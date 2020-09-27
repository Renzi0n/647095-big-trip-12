import AbstractView from './abstract.js';

const createTripDayTemplate = (date, counter) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${counter}</span>
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
  constructor(date, counter, ...events) {
    super();

    this._date = date;
    this._counter = counter;
    this._events = events;
  }

  getTemplate() {
    return createTripDayTemplate(this._date, this._counter, this._events);
  }
}

