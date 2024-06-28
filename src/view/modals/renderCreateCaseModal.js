// import { getDateString } from "../../utils/helpers.js";

export default function renderCreateCaseModal(modalData, parentElm) {
  const curCase = modalData;
  let curClient = {};
  // if (id) {
  //   curCase = modalData.cases.filter((c) => c.caseId === id)[0];
  //   curClient = modalData.clients.filter(
  //     (cl) => cl.id === curCase?.clientId
  //   )[0];
  // }

  // function empIdtoName(assignedToId) {
  //   return modalData.employees
  //     .filter((i) => i.employeeId === assignedToId)
  //     .map((i) => i.name)
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
      <form id="case-form" class="form-class">
          <div class="form-row">
              <label for="client" class="form-label"><strong>Client</strong> </label>
              ${
                curClient?.name
                  ? `<label for="email-address" class="form-label"> ${
                      curClient?.name || ""
                    } </label> `
                  : `<input type="text" class="form-input" id="client" name="client"  placeholder="Search Name"         autocomplete="off" list="clients" name="client">
                      <datalist id="clients">
                      list of client
                      </datalist>`
              }

          </div>
          <div class="form-row-flex">
          <div class="form-col-flex-col" >
            <label  class="form-label"  ><strong>Email: &nbsp;</strong></label>
            <label for="email-address" name="email-address-label" style="width:215px" class="form-label"> ${
              curClient?.phone || ""
            }  </label>
          </div>
            <div class="form-col-flex-col" >
              <label  class="form-label"  ><strong>Phone: &nbsp;</strong></label>
              <label for="phone-number" name="phone-number-label" style="width:215px" class="form-label"> ${
                curClient?.phone || ""
              }  </label>
            </div>
            <div class="form-col-flex-col">
              <label  class="form-label"><strong>Visa Type: &nbsp;</strong></label>
              <label for="visa-type" name="visa-type-label" style="width:215px" class="form-label"> ${
                curClient?.visaType || ""
              }  </label>
            </div>
          </div>
          
          <div class="form-row">                  
              <label for="case-description" class="form-label"><strong>Case Description</strong></label>
              <textarea id="case-description" name="case-description" class="form-input" rows="2" >${
                curCase?.caseDescription || ""
              }</textarea>
          </div>


          <div class="form-row-flex">
            <div class="form-col-flex">
              <label for="case-type" class="form-label"><strong>Case Type</strong></label>
              <select
              class=" form-input"
              id="case-type"
              name="case-type"
              >
              ${[
                "General Inquiry",
                "Ongoing Visa Process",
                "Callback Request",
                "Update Request",
                "Payment Related",
                "Others",
              ].map(
                (i) =>
                  `<option ${
                    curCase.caseType === i ? "selected" : ""
                  }>${i}</option>`
              )}
              </select>
            </div>
            <div class="form-col-flex">
              <label for="case-status" class="form-label"><strong>Case Status</strong></label>
              <select
              class=" form-input"
              id="case-status"
              name="case-status"
            >
            ${[
              "In Progress",
              "Pending",
              "Under Review",
              "Completed",
              "Referred",
              "Cancelled",
              "Closed",
            ].map(
              (i) =>
                `<option ${
                  curCase.caseStatus === i ? "selected" : ""
                }>${i}</option>`
            )}
              </select>
            </div>
            <div class="form-col-flex">
              <label for="case-consultant" class="form-label"><strong>Consultant</strong></label>
              <select
              class=" form-input"
              id="case-consultant"
              name="case-consultant"
            >
             List of employees
              </select>
            </div>
          </div>

          <div class="form-row">                  
              <label for="case-note" class="form-label"><strong>Notes</strong></label>
              <textarea id="case-note" name="case-note" class="form-input" rows="4" >${
                curCase?.notes?.[curCase.notes.length - 1].note || ""
              }</textarea>
          </div> 
          
          ${
            curCase?.notes?.length > 1
              ? `
              <label for="notes-history" class="form-label"><strong>Notes History</strong></label>
              
              <div class="notes-history">                  
            ${curCase?.notes
              ?.sort((a, b) => b.writtenAt - a.writtenAt)
              .map(
                (n) =>
                  `<div class="form-row-flex" style="gap:1rem;">
                    <strong><p>${n.writtenAt}&nbsp;</p></strong>
                    <div style="display: flex; flex-grow: 1; "><p style="text-decoration: underline;">${n.writtenBy}:&nbsp </p><p>${n.note}</p> </div>
                </div>`
              )
              .join(`\n`)}
            </div>`
              : ``
          }
          <div class="form-row-flex">        
              <button id="case-reset-button" type="reset" class="btn-medium btn-secondary">Reset</button>
              <button id="case-submit-button" name="case-submit-button" type="submit" value="submit" class="btn-medium btn-primary"
              >${curCase?.caseId ? "Update Case" : "Create Case"}</button>
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
