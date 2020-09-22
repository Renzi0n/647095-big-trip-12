import AbstractView from './abstract.js';
import {MenuItem} from "../consts.js";

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <h2 class="visually-hidden">Switch trip view</h2>
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-value="${MenuItem.TABLE}">
        ${MenuItem.TABLE}
      </a>
      <a class="trip-tabs__btn" href="#" data-value="${MenuItem.STATS}">
        ${MenuItem.STATS}
      </a>
    </nav>`
  );
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const inactiveItem = this.getElement().querySelector(`[data-value=${menuItem}]`);

    this.resetMenuItem();

    if (menuItem !== null) {
      inactiveItem.classList.add(`trip-tabs__btn--active`);
    }
  }

  resetMenuItem() {
    const activeItem = this.getElement().querySelector(`.trip-tabs__btn--active`);

    if (activeItem) {
      activeItem.classList.remove(`trip-tabs__btn--active`);
    }
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.value);
  }
}

