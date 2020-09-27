import AbstractView from './abstract.js';
import {FilterType} from '../consts.js';

const createFilterItemsTemplate = (currentFilter, isDisable) => {
  return Object.values(FilterType).map((filter) => `
    <div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}"
      ${filter === currentFilter && !isDisable ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>
  `).join(``);
};

const createFiltersTemplate = (currentFilter, isDisable) => {
  return (
    `<form class="trip-filters" action="#" method="get">
      <h2 class="visually-hidden">Filter events</h2>
      ${createFilterItemsTemplate(currentFilter, isDisable)}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filters extends AbstractView {
  constructor(currentFilter, isDisable) {
    super();

    this._currentFilter = currentFilter;
    this._isDisable = isDisable;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._currentFilter, this._isDisable);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
}

