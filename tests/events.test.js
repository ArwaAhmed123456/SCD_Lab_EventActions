// event.test.js
const request = require("supertest");
const { app } = require("../Auth");
const setupEvents = require("../Event"); // Import setupEvents

setupEvents(app); // Call setupEvents to register routes

let token;

beforeAll(async () => {
    const res = await request(app)
        .post("/login")
        .send({ username: "ayesha", password: "Xyz123" });

    token = res.body.token;
    console.log("Generated Token in Test:", token);
});

describe("Event API Tests", () => {
    test("should create an event", async () => {
        const res = await request(app)
            .post("/events")
            .set("Authorization", `Bearer ${token}`)
            .send({ name: "meeting", date: "2025-04-01", time: "14:00:00", category: "Work" });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
    });

    test("should fetch all user events", async () => {
        const res = await request(app)
            .get("/events")
            .set("Authorization", `Bearer ${token}`);

        console.log("Events Response:", res.body);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});