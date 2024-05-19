import Views from "./views.js";

class RenderCalendar extends Views {
  _parentElement = document.querySelector("#main");
  _container = document.createElement("div");
  _calendar = null;

  constructor() {
    super();
  }

  initCalendar() {
    this._calendar = new FullCalendar.Calendar(this._container, {
      initialView: "dayGridMonth",
      dayMaxEventRows: true, // for all non-TimeGrid views
      views: {
        timeGrid: {
          dayMaxEventRows: 4, // adjust to 6 only for timeGridWeek/timeGridDay
        },
      },

      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listWeek",
      },
      dayPopoverFormat: {
        month: "long",
        day: "numeric",
        year: "numeric",
      },
      eventMouseEnter(e) {
        e.el.classList.add("hoverEvent");
      },
      eventMouseLeave(e) {
        e.el.classList.remove("hoverEvent");
      },

      eventClick: (info) => {
        const ev = new CustomEvent("custom:eventClicked", {
          bubbles: true,
          detail: info.event,
        });
        info.jsEvent.target.dispatchEvent(ev);
      },

      events: this._data.events.filter(
        (e) => e.assignedTo === this._currentUser.employeeId
      ),
    });
    // Delaying rendering by a short interval as it produce CSS Issues otherwise
    setTimeout(() => {
      this._calendar.render();
    }, 0);
    return this._container;
  }

  _generateMarkup(el) {
    const res = this.initCalendar();
    return (!el && res) || el;
  }
}

export default new RenderCalendar();
