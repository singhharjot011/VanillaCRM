// import { getDateString } from "../../utils/helpers.js";

export default function renderCreateClientModal(
  modalData,
  parentElm,
  completeData
) {
  const curClient = modalData || {};

  const consultantsData = modalData.employees
    ? modalData.employees
    : completeData.employees;
  const consultants = consultantsData.map((c) => c.name);

  function getEmployeeIdToName(empId) {
    const empName = consultantsData.find((c) => c.employeeId === empId).name;
    return empName;
  }

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
      <form class="form-class" id="client-form" action="javascript:void(0)"  method="post">
          <div class="form-row-flex">
              <div class="form-col-flex">
                <label for="first-name" class="form-label">First Name </label>
                <input id="first-name" name="first-name" class="form-input"  value= "${
                  curClient.name ? curClient.name.split(" ")[0] : ""
                }" type="text" />
              </div>
              <div class="form-col-flex">
                <label for="last-name" class="form-label">Last Name </label>
                <input id="last-name" name="last-name" class="form-input" type="text" value="${
                  curClient.name ? curClient.name.split(" ").slice(1) : ""
                }" />
              </div>
          </div>
          
          <div class="form-row-flex">
              <div class="form-col-flex">
                <label for="email" class="form-label">Email Address </label>
                <input id="email" name="email" class="form-input" type="text"  value="${
                  curClient.email ? curClient.email : ""
                }"/>
              </div>
              <div class="form-col-flex">
                <label for="province" class="form-label">Province</label>
                <select
                class=" form-input"
                id="province"
                name="province"
                >
                ${[
                  "ON",
                  "QC",
                  "NS",
                  "NB",
                  "MB",
                  "BC",
                  "PE",
                  "SK",
                  "AB",
                  "NL",
                  "NT (Territory)",
                  "YT (Territory)",
                  "NU (Territory)",
                ].map(
                  (p) =>
                    `<option ${
                      curClient.province &&
                      curClient.province.toLowerCase().trim() ===
                        p.toLowerCase().trim()
                        ? "selected"
                        : ""
                    }>${p}</option>`
                )}
                 
                </select>
            </div>
              <div class="form-col-flex">
                <label for="phone" class="form-label">Phone </label>
                <input id="phone" name="phone" class="form-input" type="text" maxlength="10"  value="${
                  curClient.phone ? curClient.phone : ""
                }"/>
              </div>
          </div>
          <div class="form-row-flex">
              <div class="form-col-flex">
                <label for="city" class="form-label">City </label>
                <input id="city" name="city" class="form-input" type="text"  value="${
                  curClient.city ? curClient.city : ""
                }"/>
              </div>
              <div class="form-col-flex">
                <label for="postal-code" class="form-label">Postal Code </label>
                <input id="postal-code" name="postal-code" class="form-input" type="text" maxlength=6 value="${
                  curClient.postalCode ? curClient.postalCode : ""
                }"/>
              </div>
          </div>


          <div class="form-row-flex">
            <div class="form-col-flex">
              <label for="visa-type" class="form-label">Visa Type</label>
              <select
              class=" form-input"
              id="visa-type"
              name="visa-type"
              >
              ${[
                "Work Permit",
                "Student Visa",
                "Super Visa",
                "Visitor Visa",
                "Express Entry / PR",
                "Family-Sponsorship",
                "TRV",
                "Others",
              ].map(
                (p) =>
                  `<option ${
                    curClient.visaType &&
                    curClient.visaType.toLowerCase().trim() ===
                      p.toLowerCase().trim()
                      ? "selected"
                      : ""
                  }>${p}</option>`
              )}
              </select>
            </div>
            
            <div class="form-col-flex">
              <label for="client-consultant" class="form-label">Consultant</label>
              <select
              class=" form-input"
              id="client-consultant"
              name="client-consultant"
            >
             ${consultants.map(
               (c) =>
                 `<option ${
                   curClient.consultant &&
                   getEmployeeIdToName(curClient.consultant)
                     .toLowerCase()
                     .trim() === c.toLowerCase().trim()
                     ? "selected"
                     : ""
                 }>${c}</option>`
             )}
              </select>
            </div>
          </div>

          <div class="form-row">                  
              <label for="client-note" class="form-label">Notes</label>
              <textarea id="client-note" name="client-note" class="form-input" rows="4" placeholder="(Enter Important Details only, that did not have its own field above)"  >${
                curClient.clientNote ? curClient.clientNote : ""
              }</textarea>
          </div>

          <div class="form-row-flex">        
              <button id="client-reset-button" name="client-reset-button" type="reset" class="btn-medium btn-secondary">Reset</button>
              <button id="client-submit-button" name="client-submit-button" type="submit" value="submit" class="btn-medium btn-primary" >${
                curClient.name ? "Update Client" : "Create Client"
              }</button>
          </div>

          ${
            curClient.lastUpdatedAt
              ? `<div class="form-row-flex">
              <p>Last Updated:&nbsp;${curClient.lastUpdatedAt}</p>
          </div>
          `
              : ""
          }
      </form>
    </div>
    `;

  if (typeof modalElement === "object") {
    parentElm.insertAdjacentElement("afterbegin", modalElement);
  } else {
    parentElm.insertAdjacentHTML("afterbegin", modalElement);
  }
}
