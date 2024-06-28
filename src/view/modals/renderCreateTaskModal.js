import { API_URL } from "../../utils/config.js";
import { getDateTimeString } from "../../utils/helpers.js";

export default async function renderCreateTaskModal(modalData, parentElm) {
  const curTask = modalData;
  console.log(curTask);

  // function empIdtoName(assignedToId, modalData) {
  //   return modalData.employees
  //     .filter((i) => i.employeeId === assignedToId)
  //     .map((i) => i.name)
  //     .join("");
  // }

  // function clientIdToName(clientId, modalData) {
  //   return modalData.clients
  //     .filter((c) => c.id === clientId)
  //     .map((c) => c.name)
  //     .join("");
  // }

  const modalElement = document.createElement("div");
  if (parentElm.querySelector(".modal")) return;
  modalElement.classList.add("modal");
  modalElement.innerHTML = `
    <div>
      <div class="close-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#5f6368"
          >
          <path
            d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
          />
        </svg>
      </div>
      <form id="task-form" class="form-class" >

          <div class="form-row-flex">
              <label ${
                !curTask.requestedBy ? `for="requested-by" ` : ""
              } class="form-label">Requested By:  </label>
              ${
                !curTask.requestedBy
                  ? `<select
                  class=" form-input"
                  id="requested-by"
                  name="requested-by"
                  disabled
                   >
           
                        <option selected >ZZZZ</option>
                    
                </select>`
                  : `<label  class="form-label"> ${curTask.requestedBy} </label>`
              }
          </div>
          <div class="form-row">
              <label for="assign-to" class="form-label">Assign To </label>
              <select
                class=" form-input"
                id="assign-to"
                name="assign-to"
              ${curTask.assignedTo ? "disabled" : ""}
                >
                  zzzzzzzzzzzz
              </select>
          </div>
          
          <div class="form-row">                  
              <label for="objective" class="form-label">Task Objective</label>
              <textarea id="objective" name="objective" class="form-input" rows="2" ${
                curTask.description ? "disabled" : ""
              } >${curTask.description ? curTask.description : ""} </textarea>
          </div>
          
          ${`<div class="form-row-flex">
              <label for="due-date" class="form-label">Due Date  </label>
              <input type="date" id="due-date" class="form-input" name="due-date"  min="2020-01-01" max="2030-12-31" value="${
                curTask.due ? curTask.due : ""
              }"  ${curTask.due ? "disabled" : ""}/>
              </div>`}

          ${
            curTask.description
              ? `          <div class="form-row">                  
          <label for="completion-note" class="form-label"><strong>Completion Notes</strong></label>
          <textarea id="completion-note" name="completion-note" class="form-input" rows="3" placeholder="Briefly tell about the completed task"  ${
            curTask.completedAt && `disabled`
          }>${
                  curTask.notes && curTask.notes.length > 0 ? curTask.notes : ""
                }</textarea>
      </div>`
              : ``
          }

         
          


          <div id="appointment-details">
            ${
              curTask?.isAppointment
                ? `<div class="form-row">
                <label for="client" class="form-label"><strong>Client</strong> </label>
                <input type="text" class="form-input" id="client" name="client"  placeholder="Search Name"  autocomplete="off" list="clients" name="client"
                        ${
                          curTask?.clientId &&
                          ` value="${clientIdToName(
                            curTask.clientId,
                            modalData
                          )}" selected disabled`
                        }/>    
                        
                <label for="appointment-date" class="form-label">Appointment Date  </label>
                <input type="date" id="appointment-date" class="form-input" name="appointment-date" value="${
                  curTask?.appointmentDate
                }" disabled/>
                <label for="appointment-start-time" class="form-label">Start Time:</label>
                <input type="time" id="appointment-start-time" class="form-input" name="appointment-start-time"  value="${
                  curTask?.appointmentStartTime
                }" disabled/>
                <label for="appointment-end-time" class="form-label">End Time:</label>
                <input type="time" id="appointment-end-time" class="form-input" name="appointment-end-time"  value="${
                  curTask?.appointmentEndTime
                }" disabled/>
                
                <label for="Agenda" class="form-label">Agenda</label>
                <textarea id="Agenda" name="Agenda" class="form-input" rows="4" ${
                  curTask.appointmentAgenda ? "disabled" : ""
                } >${
                    curTask.appointmentAgenda ? curTask.appointmentAgenda : ""
                  } </textarea>


            </div>`
                : ``
            }
          </div>

          <div id="button-area" class="form-row-flex">        
              ${
                curTask?.completed
                  ? ``
                  : `<button id="task-reset-button" name="task-reset-button" type="reset" class="btn-medium btn-secondary">Reset</button>`
              }
              ${
                curTask?.completed
                  ? `<p class="success-message">Task Completed on ${getDateTimeString(
                      curTask?.completedAt
                    )}</p>`
                  : ``
              }
              ${
                curTask?.completed
                  ? ``
                  : `<button id="task-submit-button" name="task-submit-button" type="submit" value="submit" class="btn-medium btn-primary">${
                      curTask.id ? "Mark Completed" : "Create Task"
                    }</button>`
              }
          </div>
          
      </form>
    </div>
    `;

  if (typeof modalElement === "object") {
    parentElm.insertAdjacentElement("afterbegin", modalElement);
  } else {
    parentElm.insertAdjacentHTML("afterbegin", modalElement);
  }
}
