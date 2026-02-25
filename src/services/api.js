import axios from "axios";

const API = axios.create({
  baseURL: "https://sipentar-backend-production.up.railway.app"
});

export default API;