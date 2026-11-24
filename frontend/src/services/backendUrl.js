export const normalizeBackendUrl = (value) => {
    const configuredUrl = value?.trim();

    if (!configuredUrl) {
        throw new Error(
            "VITE_API_URL is required. Set it to the backend's absolute HTTP or HTTPS origin."
        );
    }

    let url;

    try {
        url = new URL(configuredUrl);
    } catch {
        throw new Error("VITE_API_URL must be an absolute HTTP or HTTPS URL.");
    }

    if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("VITE_API_URL must use HTTP or HTTPS.");
    }

    if (url.username || url.password || url.search || url.hash) {
        throw new Error(
            "VITE_API_URL must not contain credentials, a query string, or a fragment."
        );
    }

    let pathname = url.pathname.replace(/\/+$/, "");

    while (/\/api$/i.test(pathname)) {
        pathname = pathname.replace(/\/api$/i, "").replace(/\/+$/, "");
    }

    return `${url.origin}${pathname}`;
};
