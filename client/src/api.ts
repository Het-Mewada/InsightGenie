import axios from "axios";

const api = axios.create({
  baseURL: "https://insightgenie-isx8.onrender.com/api",
});

export default api;