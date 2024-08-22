// const handleMenu = () => {
//   const parentElement = document.querySelector("#main-nav");

//   // Handler function to update active class
//   const updateActiveClass = (path) => {
//     const links = parentElement.querySelectorAll("ul > li > a");
//     links.forEach((link) => {
//       link.classList.remove("active");
//       const linkPath = link.getAttribute("href");
//       if (path.slice(1) === linkPath) {
//         link.classList.add("active");
//       }
//     });
//   };

//   // Initial setup
//   updateActiveClass(window.location.pathname);

//   // Click event listener
//   parentElement.addEventListener("click", (e) => {
//     const target = e.target.closest("a");
//     if (target && target.getAttribute("href").startsWith("/")) {
//       const path = target.getAttribute("href");
//       updateActiveClass(path);
//     }
//   });

//   // Popstate event listener to handle back/forward navigation
//   window.addEventListener("popstate", () => {
//     updateActiveClass(window.location.pathname);
//   });
// };

// // Call the function to initialize the menu
// handleMenu();
