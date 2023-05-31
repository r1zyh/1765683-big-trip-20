import { render } from '../framework/render.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';
import { replace, remove } from '../framework/render.js';
import { Mode } from '../mock/const.js';

export default class SingleWaypointPresenter {
  #eventListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #eventComponent = null;
  #eventEditComponent = null;

  #waypoint = null;
  #mode = Mode.DEFAULT;

  constructor({ eventListComponent, onDataChange, onModeChange }) {
    this.#eventListContainer = eventListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(waypoint) {
    this.#waypoint = waypoint;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView({
      waypoint: this.#waypoint,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#eventEditComponent = new EventEditView({
      waypoint: this.#waypoint,
      onFormSubmit: this.#handleFormSubmit,
      onDelete: this.#handleFormCancel,
    });


    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#waypoint);
      this.#replaceEditToInfo();
    }
  }

  #replaceInfoToEdit() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeydownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditToInfo() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeydownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#waypoint);
      this.#replaceEditToInfo();
      document.removeEventListener('keydown', this.#escKeydownHandler);
    }
  };

  #handleEditClick = () => {
    this.#replaceInfoToEdit();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({
      ...this.#waypoint,
      isFavorite: !this.#waypoint.isFavorite,
    });
  };

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(waypoint);
    this.#replaceEditToInfo();
  };

  #handleFormCancel = () => {
    this.#replaceEditToInfo();
  };
}
