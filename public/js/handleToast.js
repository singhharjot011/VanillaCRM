export const showToast = function (toast, missingFields, invalidFields) {
  const missingFieldsDiv = toast.querySelector(".missing-fields-div");
  const invalidFieldsDiv = toast.querySelector(".invalid-fields-div");

  const missingFieldsContainer = toast.querySelector(".missing-fields");
  const invalidFieldsContainer = toast.querySelector(".invalid-fields");

  // Clear previous content
  missingFieldsContainer.innerHTML = "";
  invalidFieldsContainer.innerHTML = "";

  // Populate missing fields
  if (missingFields && missingFields.length > 0) {
    missingFields.forEach((field) => {
      const p = document.createElement("p");
      p.textContent = field;
      missingFieldsContainer.appendChild(p);
    });
    missingFieldsDiv.style.display = "block"; // Show missing fields section
  } else {
    missingFieldsDiv.style.display = "none"; // Hide missing fields section
  }

  // Populate invalid fields
  if (invalidFields && invalidFields.length > 0) {
    invalidFields.forEach((field) => {
      const p = document.createElement("p");
      p.textContent = field;
      invalidFieldsContainer.appendChild(p);
    });
    invalidFieldsDiv.style.display = "block"; // Show invalid fields section
  } else {
    invalidFieldsDiv.style.display = "none"; // Hide invalid fields section
  }

  const toastCloseIcon = toast.querySelector(".toast-close-icon");
  if (toastCloseIcon) {
    toastCloseIcon.addEventListener("click", () => {
      if (toast) {
        toast.classList.add("sr-only");
      }
    });
  }
};
