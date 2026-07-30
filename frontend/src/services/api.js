/* import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export default api; */

import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";


const api = axios.create({
 baseURL:  `${API_URL}/api`,
 withCredentials:true,
});
// 
export default api;