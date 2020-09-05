import {createEventTemplate} from './event.js';
import {createEventEditTemplate} from './eventEdit.js';
import {getRandomBooleanValue} from '../utils.js';

export const createTripDayTemplate = (date, number, ...events) => {
  const isEventEdit = getRandomBooleanValue(); // Выбираем случайно будет ли в дне форма редактирования

  const eventsEditTemplate = isEventEdit ? events.slice(0, +isEventEdit)
    .map((item) => createEventEditTemplate(item)).join(``) : ``;

  const eventsTemplate = events.slice(+isEventEdit, events.length)
    .map((item) => createEventTemplate(item)).join(``);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${number}</span>
        <time class="day__date" datetime="${date}">
          ${new Date(date).toLocaleDateString(`en-US`, {month: `short`, day: `numeric`})}
        </time>
      </div>

      <ul class="trip-events__list">
        ${eventsEditTemplate}
        ${eventsTemplate}
      </ul>
    </li>`
  );
};
