import axios from "axios";
import { showAlert } from "./alerts.js";

// Type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "http://127.0.0.1:5000/api/v1/users/updateMyPassword"
        : "http://127.0.0.1:5000/api/v1/users/updateMe";

    const res = await axios({
      method: "PATCH",
      url,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", `${type.toUpperCase()} Updated Successfully`);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
