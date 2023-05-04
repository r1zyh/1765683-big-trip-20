import { render } from '../render.js';
import EventListView from '../view/event-list-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventNewView from '../view/event-new-view.js';
import EventView from '../view/event-view.js';
import { getRandomArrayElement } from '../util.js';

export default class WaypointPresenter {
  constructor({ eventContainer, waypointsModel }) {
    this.eventContainer = eventContainer;
    this.waypointsModel = waypointsModel;
  }

  eventListComponent = new EventListView();
  newEventComponent = new EventNewView();

  init() {
    this.waypoints = [...this.waypointsModel.getWaypoints()];

    render(this.eventListComponent, this.eventContainer);
    render(new EventEditView({waypoints: getRandomArrayElement(this.waypoints)}), this.eventListComponent.getElement());
    render(this.newEventComponent, this.eventListComponent.getElement());

    for (let i = 0; i < this.waypoints.length; i++) {
      render(
        new EventView({ waypoint: this.waypoints[i] }),
        this.eventListComponent.getElement()
      );
    }
  }
}
