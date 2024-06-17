import Views from "./views.js";

class RenderPageNotFound extends Views {
  _generateMarkup() {
    return `<div class="spinner"> <h1>Page Not Found</h1></div>`;
  }
}

export default new RenderPageNotFound();
