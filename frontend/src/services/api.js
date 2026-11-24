
import axios from "axios";
import backendUrl from "./backendConfig";

const api = axios.create({
    baseURL: `${backendUrl}/api`,
    withCredentials: true,
});

export default api;
