const request = require("supertest");
const app = require("../src/app");
const { getAllowedOrigins } = require("../src/config/cors");

describe("SpendWise API", () => {
    test("GET / should return API running message", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Expense Tracker API is running...");
    });

    test.each([
        "https://expense-tracker-mern-bhailog.vercel.app",
        "https://expense-tracker-mern-zeta-eight.vercel.app",
        "http://139.84.163.56",
        "http://localhost:5173"
    ])("allows configured frontend origin %s", async (origin) => {
        const response = await request(app)
            .get("/")
            .set("Origin", origin);

        expect(response.headers["access-control-allow-origin"]).toBe(origin);
        expect(response.headers["access-control-allow-credentials"]).toBe("true");
    });

    test("handles preflight requests for allowed origins", async () => {
        const response = await request(app)
            .options("/api/auth/login")
            .set("Origin", "https://expense-tracker-mern-bhailog.vercel.app")
            .set("Access-Control-Request-Method", "POST")
            .set("Access-Control-Request-Headers", "content-type");

        expect(response.statusCode).toBe(204);
        expect(response.headers["access-control-allow-origin"]).toBe(
            "https://expense-tracker-mern-bhailog.vercel.app"
        );
        expect(response.headers["access-control-allow-credentials"]).toBe("true");
    });

    test("does not add CORS headers to requests without an Origin header", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    });

    test("does not allow unspecified origins", async () => {
        const response = await request(app)
            .get("/")
            .set("Origin", "https://untrusted.example");

        expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    });

    test("adds exact origins from FRONTEND_URLS", () => {
        expect(getAllowedOrigins("https://preview.example, http://localhost:3000")).toEqual(
            expect.arrayContaining([
                "https://preview.example",
                "http://localhost:3000"
            ])
        );
    });

    test("rejects wildcard FRONTEND_URLS entries", () => {
        expect(() => getAllowedOrigins("https://*.vercel.app")).toThrow(
            "FRONTEND_URLS entries must be exact HTTP or HTTPS origins"
        );
    });
});