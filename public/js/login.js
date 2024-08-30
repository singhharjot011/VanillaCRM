// import axios from "axios";
import { showAlert } from "./alerts.js";

export const login = async (email, password) => {
  console.log(email);
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:5000/api/v1/users/login",
      data: { email, password },
    });

    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:5000/api/v1/users/logout",
    });
    // if (res.data.status === "success") location.reload(true);
    if (res.data.status === "success") location.assign("/login");
  } catch (err) {
    showAlert("error", "Error Logging out! Try again.");
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:5000/api/v1/users/forgotPassword",
      data: { email },
    });

    if (res.data.status === "success") {
      showAlert("success", "Email sent with reset token");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
