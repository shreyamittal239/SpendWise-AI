const request = require("supertest");
const app = require("../src/app");

describe("SpendWise API", () => {
    test("GET / should return API running message", async () => {
        const response = await request(app).get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Expense Tracker API is running...");
    });
});