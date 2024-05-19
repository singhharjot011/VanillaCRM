import Views from "./views.js";

class RenderMenu extends Views {
  _parentElement = document.querySelector("#main-nav");


  addHandlerMenu() {
    // Handler function to update active class
    const updateActiveClass = (hash) => {
      const links = this._parentElement.querySelectorAll("ul > li > a");
      links.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + hash) {
          link.classList.add("active");
        }
      });
    };

    // Initial setup
    updateActiveClass(window.location.hash.slice(1));

    // Click event listener
    this._parentElement.addEventListener("click", (e) => {
      const target = e.target.closest("a");
      if (target && target.getAttribute("href").startsWith("#")) {
        const hash = target.getAttribute("href").slice(1);
        updateActiveClass(hash);
      }
    });

    // Hashchange event listener
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.slice(1);
      updateActiveClass(hash);
    });
  }
}

export default new RenderMenu();
