import { showEventToast } from "./handleToast.js";

export const callCalendar = (calendarEl) => {
  const eventToast = document.querySelector(".toast");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    dayMaxEventRows: true,
    views: {
      timeGrid: {
        dayMaxEventRows: 4,
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
    eventClick: function (info) {
      // Convert the event's extendedProps and start/end times into a Map
      const fieldsMap = new Map([
        ...Object.entries(info.event.extendedProps),
        ["start", info.event.start.toISOString()],
        ["end", info.event.end ? info.event.end.toISOString() : "N/A"],
      ]);

      showEventToast(eventToast, fieldsMap);
    },

    events: window.calendarTasks.map((task) => {
      // Default to today's date if appointmentDate or due date is not provided
      const start = task.appointmentDate
        ? `${task.appointmentDate}T${task.appointmentStartTime || "00:00"}`
        : task.due;

      const end = task.appointmentDate
        ? `${task.appointmentDate}T${task.appointmentEndTime || "23:59"}`
        : task.due;

      return {
        title:
          task.calendarEvent.extendedProps.appointmentAgenda ||
          task.description,
        start: start,
        end: end,
        extendedProps: {
          ...task.calendarEvent.extendedProps,
          taskId: task.id,
        },
        classNames: task.calendarEvent.classNames || [],
      };
    }),

    events: window.calendarTasks.map((task) => {
      // Default to today's date if appointmentDate or due date is not provided
      const start = task.appointmentDate
        ? `${task.appointmentDate}T${task.appointmentStartTime || "00:00"}`
        : task.due;

      const end = task.appointmentDate
        ? `${task.appointmentDate}T${task.appointmentEndTime || "23:59"}`
        : task.due;

      return {
        title:
          task.calendarEvent.extendedProps.appointmentAgenda ||
          task.description,
        start: start,
        end: end,
        extendedProps: {
          ...task.calendarEvent.extendedProps,
          taskId: task.id,
        },
        classNames: task.calendarEvent.classNames || [],
      };
    }),
  });
  // Render the calendar
  setTimeout(() => {
    calendar.render();
  }, 0);
};
