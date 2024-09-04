// import axios from "axios";
import { showAlert } from "./alerts.js";

export const login = async (email, password) => {
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
    const response = await fetch("/api/v1/users/forgotPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (result.status === "success") {
      showAlert("success", "Password reset token sent to your email!");
    } else {
      showAlert("error", "There was an error. Please try again.");
    }
  } catch (err) {
    console.error("Error:", err);
    showAlert("error", "Something went wrong. Please try again.");
  }
};

export const setNewPassword = async (password, passwordConfirm, token) => {
  try {
    const response = await fetch(`/api/v1/users/resetPassword/${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, passwordConfirm }),
    });

    const result = await response.json();

    if (result.status === "success") {
      showAlert("success", "Password has been reset");
    } else {
      showAlert("error", "There was an error. Please try again.");
    }
  } catch (err) {
    console.error("Error:", err);
    showAlert("error", "Something went wrong. Please try again.");
  }
};
