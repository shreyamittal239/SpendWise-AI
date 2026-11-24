import { normalizeBackendUrl } from "./backendUrl";

const backendUrl = normalizeBackendUrl(import.meta.env.VITE_API_URL);

export default backendUrl;
