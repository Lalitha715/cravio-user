import { v4 as uuidv4 } from "uuid";

export const getUserId = () => {
  let userId = localStorage.getItem("user_id");

  if (!userId) {
    // TEMP OTP USER
    userId = uuidv4();
    localStorage.setItem("user_id", userId);   // 🔥 IMPORTANT
    localStorage.setItem("user_type", "TEMP");
  }

  return userId;
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("user_id");
};
