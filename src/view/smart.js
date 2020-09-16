import Abstract from "./abstract";

export default class Smart extends Abstract {
  constructor() {
    super();
    this._event = {};
  }

  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._event = Object.assign(
        {},
        this._event,
        update
    );

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    let prevElement = this.getElement();
    this.removeElement();

    const newElement = this.getElement();

    prevElement.replaceWith(newElement);
    prevElement = null;

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
