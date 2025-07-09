import db from "../Drizzle/db";
import { UsersTable } from "../Drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { TIUser } from "../Drizzle/schema";

//Getting all users
export const getAllUsers = async () => {
  const users = await db.query.UsersTable.findMany()
    return users;
};

//Getting user by ID
export const getUserById = async (id: number) => {
   const user = await db.query.UsersTable.findFirst({
        where: eq(UsersTable.userID, id)
  })
  return user
};

//Create a new user
export const createUser = async (user: TIUser) => {
    await db.insert(UsersTable).values(user)
    return "User created successfully";
}

//Get user by email service
export const getUserByEmailService = async (email: string) => {
   return await db.query.UsersTable.findFirst({
        where: sql`${UsersTable.email} = ${email}`
    });
};

// Verify user service
export const verifyUserService = async(email: string) => {
  await db.update(UsersTable)
        .set({ isVerified: true, verificationCode: null })
        .where(sql`${UsersTable.email} = ${email}`);
}

//Update user details
export const updateUser =  async (id: number, user: TIUser) => {
    await db.update(UsersTable).set(user).where(eq(UsersTable.userID, id))
    return "User updated successfully";
};

//deleting user by ID
export const deleteUser = async (id: number) => {
  await db.delete(UsersTable).where(eq(UsersTable.userID, id))
  return "User deleted successfully";
};

// login a user
export const userLoginService = async (user:TIUser) => {
    //email and password
    const {email} = user;
    return await db.query.UsersTable.findFirst({
        columns: {
            userID: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            contactPhone: true,
            address: true,
            role: true,
            createdAt: true,
            updatedAt: true
        }, where: sql`${UsersTable.email} = ${email}`
    })

};

