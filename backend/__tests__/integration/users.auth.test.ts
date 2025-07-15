import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/index';
import db from '../../src/Drizzle/db';
import { UsersTable } from '../../src/Drizzle/schema'
import { eq } from 'drizzle-orm';



let testUser = {
    firstName: "User",
    lastName: "Tester",
    email: "user@mail.com",
    password: "testpass123",
    contactPhone: "0723456789",
    address: "10100 Nyeri"
};

beforeAll(async () => {
     // hash pass
    const hashedPassword = bcrypt.hashSync(testUser.password, 10)
    await db.insert(UsersTable).values({
        ...testUser,
        password: hashedPassword
    })
})

afterAll(async () => {
    // Clean up the test user and todo
    await db.delete(UsersTable).where(eq(UsersTable.email, testUser.email));
});

describe("Logging in a User", () => {
    it("should authenticate a user and return a token", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({
                email: testUser.email,
                password: testUser.password
            })

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty("token")
        expect(res.body.user).toEqual(
        expect.objectContaining({
            user_id: expect.any(Number),
            first_name: testUser.firstName,
            last_name: testUser.lastName,
            email: testUser.email,
        })
    );
        expect(res.body.message).toBe("Login successfull");
    })

    it("should fail with wrong password", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({
                email: testUser.email,
                password: "wrongpassword"
            })

        expect(res.statusCode).toBe(401)
        expect(res.body).toEqual({ message: "Invalid credentials" })
    })

    it("should fail with non-existent user", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({
                email: "nouser@mail.com",
                password: "irrelevant"
            })

        expect(res.statusCode).toBe(404)
        expect(res.body).toEqual({ message: "User not found" })
    })
})
