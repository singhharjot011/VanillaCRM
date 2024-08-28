export const callCalendar = (calendarEl) => {
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
      const ev = new CustomEvent("custom:eventClicked", {
        bubbles: true,
        detail: info.event,
      });
      info.jsEvent.target.dispatchEvent(ev);
    },
    events: window.calendarTasks.map((task) => ({
      title: task.title,
      start: task.startDate, // Adjust field names as per your task model
      end: task.endDate, // Adjust field names as per your task model
      // Add any other relevant fields
      extendedProps: {
        taskId: task._id,
        // Add any other task properties you want to access later
      },
    })),

    // [
    //   {
    //     id: "a",
    //     title: "my event",
    //     start: "2024-08-27",
    //   },
    // ],
  });
  // Render the calendar
  setTimeout(() => {
    calendar.render();
  }, 0);
};
