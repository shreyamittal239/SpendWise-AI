const AUTH_COOKIE_NAME = "token";
const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const getAuthCookieOptions = (req) => {
    const secure = req.secure === true;

    return {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        path: "/"
    };
};

module.exports = {
    AUTH_COOKIE_NAME,
    AUTH_COOKIE_MAX_AGE,
    getAuthCookieOptions
};
