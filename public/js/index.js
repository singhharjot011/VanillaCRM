import "@babel/polyfill";
import { login, logout } from "./login.js";

// DOM Elements
const loginForm = document.querySelector(".signin-form");
const logOutBtn = document.querySelector("#signout-btn");

if (loginForm)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener("click", logout);
