jest.mock("../../src/mailer/mailer", () => ({
  sendEmail: jest.fn(),
}));

import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { UsersTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import * as userService from "../../src/users/user.service";

const testUser = {
  firstName: "Reg",
  lastName: "Tester",
  email: "registeruser@mail.com",
  password: "regpass123",
  contactPhone: "0723456789",
  address: "10100 Nyeri",
};

let createdUserId: number;

afterAll(async () => {
  if (testUser.email) {
    await db.delete(UsersTable).where(eq(UsersTable.email, testUser.email));
  }
});

describe("Registering a new user", () => {
  // ----------------------------
  // CREATE USER
  // ----------------------------
  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/user").send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty(
      "message",
      "User created. Verification code sent to email."
    );

    const user = await userService.getUserByEmailService(testUser.email);
    expect(user).toBeDefined();
    expect(user?.isVerified).toBe(false);
    createdUserId = user?.userID!;
  }, 80000);

  it("should not register a user with an existing email", async () => {
    // Attempt to register the same user again
    const res = await request(app).post("/api/user").send(testUser);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error");
  });

  it("should not register a user with missing fields", async () => {
    const res = await request(app).post("/api/user").send({
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
      // password missing
    });

    expect([400, 500]).toContain(res.statusCode);
    expect(res.body).toHaveProperty("error");
  });

  // ----------------------------
  // VERIFY USER
  // ----------------------------
  it("should verify the created user", async () => {
    const userInDb = await userService.getUserByEmailService(testUser.email);
    const realCode = userInDb?.verificationCode;

    const res = await request(app).post("/api/user/verify").send({
      email: testUser.email,
      code: realCode,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User verified successfully");

    const verifiedUser = await userService.getUserByEmailService(
      testUser.email
    );
    expect(verifiedUser?.isVerified).toBe(true);
  });

  it("should reject invalid verification code", async () => {
    const res = await request(app).post("/api/user/verify").send({
      email: testUser.email,
      code: "999999",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid verification code");
  });

  // ----------------------------
  // FETCH USER BY ID
  // ----------------------------
  it("should return 404 for non-existent user", async () => {
    const res = await request(app).get("/api/user/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "User not found");
  });
});
