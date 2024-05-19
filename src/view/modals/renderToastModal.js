export default function renderToastModal(
  missingFields,
  invalidFields,
  parentElm
) {
  const toastModalElement = document.createElement("div");
  if (parentElm.querySelector(".toast")) return;
  toastModalElement.classList.add("toast");
  toastModalElement.innerHTML = `
    <div>
        <div>
            <div class="toast-close-icon">
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
            ${
              missingFields?.length > 0
                ? `<div class="form-col-flex">
            <h3> Missing Fields </h3>
            <h4> Please fill the missing fields </h4>
            <div class="form-col-flex" style="padding: 2rem">
              ${missingFields?.map((f) => `<p>${f}</p>`).join("")}
            </div>
          </div>`
                : ``
            }
          ${
            invalidFields?.length > 0
              ? `<div class="form-col-flex">
          <h3> Invalid Fields </h3>
          <h4> Please correct the invalid fields </h4>
          <div class="form-col-flex" style="padding: 2rem">
            ${invalidFields?.map((f) => `<p>${f}</p>`).join("")}
          </div>
        </div>`
              : ``
          }
        </div>
    </div>
    
    `;

  if (typeof toastModalElement === "object") {
    parentElm.insertAdjacentElement("afterbegin", toastModalElement);
  } else {
    parentElm.insertAdjacentHTML("afterbegin", toastModalElement);
  }
}
