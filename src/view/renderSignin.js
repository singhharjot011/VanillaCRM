import Views from "./views.js";

class RenderSignin extends Views {
  _parentElement = document.querySelector("#app-layout");

  _generateMarkup() {
    return `    <div class="signin-page">
    <div class="signin-prompt">
      <img
        class="signin-logo"
        src="./public/assets/img/logo/logo.png"
        alt="Logo"
      />
      <h2>Sign In</h2>

      <div class="signin-form">
        <form class="" action="#">

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

         

          <div class="" style="display:flex; gap:5px; font-size:smaller; justify-content:center;"> <p>Forgot Password?</p> <a href="#passwordReset"> Reset</a> </div>

          <div class="signin-form-button">
            <button
              id="signin-submit-button"
              name="signin-submit-button"
              type="submit"
              value="submit"
              class="btn-medium btn-primary"
            >
              Sign In
            </button>
          </div>

    <div style="display:flex; gap:5px; font-size:smaller; justify-content:center;"> <p>Don't have an account?</p> <a href="#signup"> Sign Up</a> </div>


        </form>
      </div>
    </div>
  </div>`;
  }
}

export default new RenderSignin();
