import Views from "./views.js";

class RenderSignup extends Views {
  _parentElement = document.querySelector("#app-layout");

  _generateMarkup() {
    console.log("reached here");
    return `    <div class="signup-page">
    <div class="signup-prompt">
      <img
        class="signup-logo"
        src="./public/assets/img/logo/logo.png"
        alt="Logo"
      />
      <h2>Sign Up</h2>

      <div class="signup-form">
        <form class="" action="#">
          <div class="form-row-flex">
            <label for="name" class="form-label">Name</label>
            <div class="mt-2">
              <input
                id="name"
                name="name"
                type="name"
                autocomplete="name"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-row-flex">
            <label for="email" class="form-label">Email Address</label>
            <div class="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-row-flex">
            <label for="token" class="form-label">Token</label>
            <div class="mt-2">
              <input
                id="token"
                name="token"
                type="token"
                autocomplete="token"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-row-flex">
            <label for="password" class="form-label">Password</label>
            <div class="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="password"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-row-flex">
            <label for="password-confirm" class="form-label"
              >Confirm Password</label
            >
            <div class="mt-2">
              <input
                id="password-confirm"
                password-confirm="password-confirm"
                type="password"
                autocomplete="password-confirm"
                required
                class="form-input"
              />
            </div>
          </div>


          
          <div class="signup-form-button">
            <button
              id="signup-submit-button"
              name="signup-submit-button"
              type="submit"
              value="submit"
              class="btn-medium btn-primary"
            >
              Request Token
            </button>
          </div>


          <div style="display:flex; gap:5px; font-size:smaller; justify-content:center;"> <p>Already have an account?</p> <a href="#signin"> Sign In</a> </div>


        </form>
      </div>
    </div>
  </div>`;
  }
}

export default new RenderSignup();
