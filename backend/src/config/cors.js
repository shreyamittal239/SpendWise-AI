const defaultOrigins = [
    "https://expense-tracker-mern-bhailog.vercel.app",
    "https://expense-tracker-mern-zeta-eight.vercel.app",
    "http://139.84.163.56",
    "http://localhost:5173"
];

const normalizeOrigin = (value) => {
    let url;

    try {
        url = new URL(value.trim());
    } catch {
        throw new Error(`Invalid origin in FRONTEND_URLS: "${value}"`);
    }

    if (
        !["http:", "https:"].includes(url.protocol) ||
        url.hostname.includes("*") ||
        url.username ||
        url.password ||
        url.pathname !== "/" ||
        url.search ||
        url.hash
    ) {
        throw new Error(
            `FRONTEND_URLS entries must be exact HTTP or HTTPS origins: "${value}"`
        );
    }

    return url.origin;
};

const getAllowedOrigins = (frontendUrls = process.env.FRONTEND_URLS || "") => {
    const additionalOrigins = frontendUrls
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
        .map(normalizeOrigin);

    return [...new Set([...defaultOrigins, ...additionalOrigins])];
};

const getFrontendUrl = (frontendUrl = process.env.FRONTEND_URL || defaultOrigins[0]) =>
    normalizeOrigin(frontendUrl);

const frontendUrl = getFrontendUrl();
const allowedOrigins = [...new Set([...getAllowedOrigins(), frontendUrl])];

const origin = (requestOrigin, callback) => {
    callback(null, Boolean(requestOrigin && allowedOrigins.includes(requestOrigin)));
};

const corsOptions = {
    origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    optionsSuccessStatus: 204
};

module.exports = { allowedOrigins, corsOptions, frontendUrl, getAllowedOrigins };
