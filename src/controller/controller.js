import * as model from "../model/model.js";
import renderCalendar from "../view/renderCalendar.js";
import renderCases from "../view/renderCases.js";
import renderClients from "../view/renderClients.js";
import renderDashboard from "../view/renderDashboard.js";
import renderHeader from "../view/renderHeader.js";
import renderKnowledgeBase from "../view/renderKnowledgeBase.js";
import renderMenu from "../view/renderMenu.js";
import renderModal from "../view/renderModal.js";
import renderMyClients from "../view/renderMyClients.js";
import renderTasks from "../view/renderTasks.js";

const renderData = async function () {
  try {
    const hash = window.location.hash.slice(1);
    const id = !hash ? (window.location.hash = "dashboard") : hash;
    renderCalendar.renderSpinner();

    const data = await model.loadData();
    const newsData = {};
    // const newsData = await model.getNews();
    const currentUser = data.employees.filter((e) => e.isLoggedIn)[0];

    renderHeader.render(data);

    switch (id) {
      case "calendar":
        renderCalendar.render(data);
        renderModal.addHandlerModal(data);
        break;
      case "dashboard":
        renderDashboard.render(data, null, newsData);
        break;
      case "clients":
        renderClients.render(data);
        renderModal.addHandlerModal(data, id, controlHandleClient);
        break;
      case "my-clients":
        renderMyClients.render(data);
        renderModal.addHandlerModal(data, id, controlHandleClient);
        break;
      case "tasks":
        renderTasks.render(data);
        renderModal.addHandlerModal(data, id, controlHandleTask, currentUser);
        break;
      case "cases":
        renderCases.render(data);
        renderModal.addHandlerModal(data, id, controlHandleCase);
        break;
      case "knowledge-base":
        renderKnowledgeBase.render(data);
        break;
      case id.match(/^client.*$/)?.input:
        renderModal.addHandlerModal(data, id, controlHandleClient);
        break;
      case "new-client":
        renderModal.addHandlerModal(data, id, controlHandleClient);
        break;
      case id.match(/^my-client.*$/)?.input:
        renderModal.addHandlerModal(data, id, controlHandleClient);
        break;
      case "new-case":
        renderModal.addHandlerModal(data, id, controlHandleCase);
        break;
      case id.match(/^case.*$/)?.input:
        renderModal.addHandlerModal(data, id, controlHandleCase);
        break;
      case id.match(/^task.*$/)?.input:
        renderModal.addHandlerModal(data, id, controlHandleTask, currentUser);
        break;
      case "new-task":
        renderModal.addHandlerModal(data, id, controlHandleTask, currentUser);
        break;
    }
  } catch (err) {
    console.error(err.message);
  }
};

const controlHandleClient = function (clientObj) {
  model.handleClientObject(clientObj);
};

const controlHandleTask = function (taskObj) {
  model.handleTaskObject(taskObj);
};

const controlHandleCase = function (caseObj) {
  model.handleCaseObject(caseObj);
};

const init = function () {
  renderCalendar.addHandlerRender(renderData); // This handles main Hash and Load Event Listeners
  renderMenu.addHandlerMenu();
};

init();
