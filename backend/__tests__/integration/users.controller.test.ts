jest.mock("../../src/mailer/mailer", () => ({
  sendEmail: jest.fn(),
}));

import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { UsersTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import * as userService from "../../src/users/user.service";

let createdUserId: number;

const testUser = {
   firstName: "Reg",
   lastName: "Tester",
   email: "registeruser@mail.com",
   password: "regpass123",
   contactPhone: "0723456789",
   address: "10100 Nyeri"
};

afterAll(async () => {
  if (createdUserId) {
    await db.delete(UsersTable).where(eq(UsersTable.userID, createdUserId));
  }
});

describe("User API Integration Tests", () => {

  beforeAll(async () => {
  await request(app).post("/api/user").send(testUser);
  const user = await userService.getUserByEmailService(testUser.email);
  createdUserId = user?.userID!;
});
 
  // ----------------------------
  // READ - Get All Users
  // ----------------------------
  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const res = await request(app).get("/api/users");

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 500 if service fails", async () => {
      jest.spyOn(userService, "getAllUsers").mockImplementation(() => {
        throw new Error("Simulated getAllUsers error");
      });

      const res = await request(app).get("/api/users");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getAllUsers error");

      (userService.getAllUsers as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // READ - Get User by ID
  // ----------------------------
  describe("GET /api/user/:id", () => {
    it("should return a user by ID", async () => {
      const res = await request(app).get(`/api/user/${createdUserId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.userID).toBe(createdUserId);
    });

    it("should return 400 for invalid user ID", async () => {
      const res = await request(app).get("/api/user/not-a-number");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app).get("/api/user/999999");

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(userService, "getUserById").mockImplementation(() => {
        throw new Error("Simulated getUserById error");
      });

      const res = await request(app).get("/api/user/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated getUserById error");

      (userService.getUserById as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // UPDATE
  // ----------------------------
  describe("PUT /api/user/:id", () => {
    it("should update an existing user", async () => {
      const updated = {
         firstName: "UpdatedName",
         address: "202 Nanyuki"
      };

      const res = await request(app).put(`/api/user/${createdUserId}`).send(updated);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "User updated successfully");
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).put("/api/user/invalid-id").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should return 404 for non-existent user", async () => {
      const res = await request(app).put("/api/user/999999").send({ firstName: "UpdatedFirstName" });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });

    it("should return 500 if service throws an error", async () => {
      jest.spyOn(userService, "updateUser").mockImplementation(() => {
        throw new Error("Simulated updateUser error");
      });

      const res = await request(app).put(`/api/user/${createdUserId}`).send({});

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated updateUser error");

      (userService.updateUser as jest.Mock).mockRestore();
    });
  });

  // ----------------------------
  // DELETE
  // ----------------------------
  describe("DELETE /api/user/:id", () => {
    it("should delete a user", async () => {
      const res = await request(app).delete(`/api/user/${createdUserId}`);

      expect(res.statusCode).toBe(204);
      expect(res.body).toEqual({});
    });

    it("should return 400 for invalid ID", async () => {
      const res = await request(app).delete("/api/user/invalid-id");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid ID");
    });

    it("should handle service failure with 500", async () => {
      jest.spyOn(userService, "deleteUser").mockImplementation(() => {
        throw new Error("Simulated deleteUser error");
      });

      const res = await request(app).delete("/api/user/1");

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "Simulated deleteUser error");

      (userService.deleteUser as jest.Mock).mockRestore();
    });
  });
});
