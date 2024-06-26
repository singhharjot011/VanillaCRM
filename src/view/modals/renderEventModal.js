import { getDateTimeString } from "../../utils/helpers.js";

export default function renderEventModal(event, parentElm, modalData) {
  const fullEvent = modalData.events.filter((e) => e.id === event.id)[0];

  const client = modalData.clients.filter(
    (c) => c.id === fullEvent?.clientId
  )[0];

  const task = modalData.tasks.filter((t) => t.id === fullEvent?.taskId)[0];

  const modalElement = document.createElement("div");
  if (parentElm.querySelector(".modal")) return;
  modalElement.classList.add("modal");
  modalElement.innerHTML = `<div>
    <div class="close-icon"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></div>
      <div class="form-class">
          <h3>${event.title}</h3>
          ${
            client
              ? `<div class="form-row-flex">
          <strong>Client Details:</strong>
          <span>${client.name}</span>
          <span>${client.email}</span>
          <span>${client.phone}</span>
        </div>`
              : ``
          }
          <div class="form-row"><strong>Start:</strong>${getDateTimeString(
            event.start
          )}</div>
          ${
            event.end
              ? `<div class="form-row">
                    <strong>End:</strong>${getDateTimeString(event.end)}
                </div>`
              : ""
          }
          ${
            task?.appointmentAgenda
              ? `<div class="form-row"><strong>Agenda:</strong>${task.appointmentAgenda}</div>`
              : ""
          }

      </div>
      <button class="btn-medium btn-primary"><a href="#task?${
        task.id
      }" style="text-decoration:none; color: white; ">Open Task</a></button>
    </div>`;

  if (typeof modalElement === "object") {
    parentElm.insertAdjacentElement("afterbegin", modalElement);
  } else {
    parentElm.insertAdjacentHTML("afterbegin", modalElement);
  }
}
