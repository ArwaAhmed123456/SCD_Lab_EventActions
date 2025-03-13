// auth.test.js
const request = require("supertest");
const { app } = require("../Auth");

describe("Authentication Tests", () => {
    it("should return a token for valid login", async () => {
        const res = await request(app)
            .post("/login")
            .send({ username: "ayesha", password: "Xyz123" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    it("should reject invalid login", async () => {
        const res = await request(app)
            .post("/login")
            .send({ username: "invalid", password: "wrongpass" });

        expect(res.status).toBe(401);
    });
});