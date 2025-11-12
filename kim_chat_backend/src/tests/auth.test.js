import request from "supertest";
import { app } from "../server.js";
import User from "../models/User.js";

describe("Auth Endpoints", () => {
  const testUser = {
    name: "Test User",
    username: "testuser",
    email: "test@example.com",
    password: "Password@123",
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should signup a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login with correct credentials", async () => {
    await request(app).post("/api/auth/signup").send(testUser);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: testUser.username, password: testUser.password });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});
