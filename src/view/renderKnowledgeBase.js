import Views from "./views.js";

class RenderKnowledgeBase extends Views {
  _parentElement = document.querySelector("#main");

  addHandlerRender(handler) {
    ["hashchange", "load"].forEach((ev) => {
      window.addEventListener(ev, handler);
    });
  }

  _generateMarkup() {
    return `
    <div class="table-row-horizontal">
      <h1 class="heading">KnowledgeBase</h1>
    </div>
    <div class="kb-paragraph ">
      <h3>Welcome to CRM</h3>
      
      <p>Welcome to <strong>ClientFlow CRM!</strong> This CRM is designed to help you manage your clients and tasks efficiently. 
      </p>
      <span>Our key features include:</span>
      <p>
      <strong>Dashboard: </strong> Simplified to focus on its role as a central hub.
      </p>
      <p>
      <strong>Client Management: </strong> Streamlined to emphasize tracking clients and differentiating between all clients and assigned clients.
      </p>
      <p>
      <strong>Calendar: </strong> Made concise while still highlighting the main function of viewing appointments and tasks.
      </p>
      <p>
      <strong>Tasks and Cases: </strong>  Combined the key points into a clear description of managing work and scheduling appointments.
      </p>
    </div>

    <div class="kb-paragraph">
      <h3>Workflow</h3>
      
      <p>This CRM is highly flexible and can be customized to suit various types of businesses. Currently, it is configured specifically for an immigration consultancy agency.
      </p>
      <span>Lets take a quick look how it works:</span>
      <p>
      <strong>Creating Clients: </strong>Consultants add every potential customer as a lead by Adding Client via form available on <a href="#clients">Clients</a> Menu, client name will initially be displayed in green. Once a client agrees to start the visa process, a case is created, and the lead becomes a regular client.
      </p>
      <p>
      <strong>Creating Case: </strong> Each case is created for a client for a specific type of visa and progresses through various stages until the visa is either granted or denied. Case can be created from <a href="#cases">Cases</a> section.
      </p>
      <p>
      <strong>Tasks & Appointments: </strong> The <a href="#tasks">Tasks</a> section lets you create tasks that can be assigned to colleagues. By checking the Appointment box, a task can be converted into a client appointment. Both tasks and appointments will appear on the calendar on their scheduled dates.
      </p>
    </div>

    <div class="kb-paragraph">
      <h3>Legends</h3>
      <div class="legend">
        <div class='legend-span'>
        </div>
        <p>Lead: </p>Client's name will show in green font until case is created for the client
      </div>
    </div>

    <div class="kb-paragraph">
      <h3>To be continued...</h3>
      <p>This is the MVP (Minimum Viable Product) of our CRM, and development is ongoing.</p>
      <h4>Next Steps</h4>
      <p>- Implementing functionality to sort by various columns.</p>
      <p>- Implementing login and logout functionality</p>
      <p>- Adding managerial features for managers and assistant managers, including onboarding and offboarding employees</p>
      <p>- Allowing users to update their display image and name</p>
      <p>- Additional features will be implemented based on user feedback</p>
      <p>- The backend will be developed and connected to the database once a potential client is secured for this CRM service</p>
    </div>
    `;
  }
}

export default new RenderKnowledgeBase();
