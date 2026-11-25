jest.mock("../src/models/User", () => ({
    findOne: jest.fn()
}));
jest.mock("bcrypt", () => ({
    compare: jest.fn()
}));
jest.mock("../src/utils/generateToken", () => jest.fn());

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../src/models/User");
const generateToken = require("../src/utils/generateToken");
const { login, logout } = require("../src/controller/authcontroller");
const authMiddleware = require("../src/middleware/authMiddleware");
const {
    AUTH_COOKIE_NAME,
    AUTH_COOKIE_MAX_AGE,
    getAuthCookieOptions
} = require("../src/config/authCookie");

const createResponse = () => {
    const res = {
        cookie: jest.fn(),
        clearCookie: jest.fn(),
        json: jest.fn(),
        status: jest.fn()
    };
    res.status.mockReturnValue(res);
    res.json.mockReturnValue(res);
    return res;
};

describe("authentication cookies", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("uses secure cross-site cookie options for HTTPS requests", () => {
        expect(getAuthCookieOptions({ secure: true })).toEqual({
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/"
        });
    });

    test("uses lax cookie options for HTTP requests", () => {
        expect(getAuthCookieOptions({ secure: false })).toEqual({
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        });
    });

    test.each([true, false])(
        "login sets matching cookie attributes for secure=%s",
        async (secure) => {
            const user = {
                _id: "user-id",
                name: "Test User",
                email: "test@example.com",
                password: "hashed-password"
            };
            const req = {
                body: { email: user.email, password: "password" },
                secure
            };
            const res = createResponse();
            User.findOne.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            generateToken.mockReturnValue("signed-jwt");

            await login(req, res);

            expect(res.cookie).toHaveBeenCalledWith(
                AUTH_COOKIE_NAME,
                "signed-jwt",
                {
                    ...getAuthCookieOptions(req),
                    maxAge: AUTH_COOKIE_MAX_AGE
                }
            );
            expect(res.status).toHaveBeenCalledWith(200);
        }
    );

    test.each([true, false])(
        "logout clears matching cookie attributes for secure=%s",
        async (secure) => {
            const req = { secure };
            const res = createResponse();

            await logout(req, res);

            expect(res.clearCookie).toHaveBeenCalledWith(
                AUTH_COOKIE_NAME,
                getAuthCookieOptions(req)
            );
            expect(res.clearCookie.mock.calls[0][1]).not.toHaveProperty("maxAge");
            expect(res.clearCookie.mock.calls[0][1]).not.toHaveProperty("expires");
            expect(res.status).toHaveBeenCalledWith(200);
        }
    );
});

describe("authentication middleware", () => {
    const originalSecret = process.env.JWT_SECRET;

    beforeAll(() => {
        process.env.JWT_SECRET = "test-jwt-secret";
    });

    afterAll(() => {
        if (originalSecret === undefined) {
            delete process.env.JWT_SECRET;
        } else {
            process.env.JWT_SECRET = originalSecret;
        }
    });

    test("verifies the cookie token and sets req.user.id", async () => {
        const token = jwt.sign({ id: "user-id" }, process.env.JWT_SECRET);
        const req = { cookies: { token } };
        const res = createResponse();
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(req.user.id).toBe("user-id");
        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    test("rejects requests without a token", async () => {
        const req = { cookies: {} };
        const res = createResponse();
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    test("rejects invalid tokens", async () => {
        const req = { cookies: { token: "invalid-token" } };
        const res = createResponse();
        const next = jest.fn();

        await authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});
