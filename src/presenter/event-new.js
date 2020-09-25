import EventEditView from "../view/event-edit.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../consts.js";

export default class EventNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._eventEditComponent = null;
    this._resetCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._handleIsFavorite = this._handleIsFavorite.bind(this);
  }

  init(callback) {
    this._resetCallback = callback;

    if (this._eventEditComponent !== null) {
      return;
    }

    this._eventEditComponent = new EventEditView();
    this._eventEditComponent.setFormCloseHandler(this._handleFormClose);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._eventEditComponent.setFavoriteHandler(this._handleIsFavorite);

    render(this._eventListContainer, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._eventEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._eventEditComponent.shake(resetFormState);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    if (this._resetCallback !== null) {
      this._resetCallback();
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MAJOR,
        event
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleIsFavorite(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.PATCH,
        Object.assign(
            {},
            event,
            {isFavorite: !event.isFavorite}
        )
    );
  }

  _handleFormClose() {
    this.destroy();
  }
}
