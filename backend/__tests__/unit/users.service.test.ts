import {
  getAllUsers,
  getUserById,
  createUser,
  getUserByEmailService,
  verifyUserService,
  updateUser,
  deleteUser,
  userLoginService,
} from "../../src/users/user.service";
import db from "../../src/Drizzle/db";
import { UsersTable } from "../../src/Drizzle/schema";
import { TIUser } from "../../src/Drizzle/schema";

// Mock db module
jest.mock("../../src/Drizzle/db", () => ({
  query: {
    UsersTable: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
  insert: jest.fn(() => ({ // mock the insert method
        values: jest.fn().mockReturnThis()//mockReturnThis() is used to return the same object
    })),
  update: jest.fn(() => ({ set: jest.fn().mockReturnThis(), where: jest.fn() })),
  delete: jest.fn(() => ({ where: jest.fn() })),
}));

describe("User Service", () => {
  const mockUser : TIUser = {
    userID: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "hashedpassword",
    contactPhone: "123456789",
    address: "Nairobi",
    role: "user",
    isVerified: false,
    verificationCode: "123456",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

   describe("getAllUsers", () => {
        it("should get all users", async () => {
        (db.query.UsersTable.findMany as jest.Mock).mockResolvedValue([mockUser]);

        const result = await getAllUsers();
        expect(result).toEqual([mockUser]);
        expect(db.query.UsersTable.findMany).toHaveBeenCalled();
    });

        it("should return empty array if no users", async () => {
                (db.query.UsersTable.findMany as jest.Mock).mockResolvedValueOnce([])
                const result = await getAllUsers()
                expect(result).toEqual([])
     });
  });

  

  describe("getUserById", () => {
    it("should get a user by ID", async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserById(1);
    expect(result).toEqual(mockUser);
    expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
  });

    it("should return undefined if user does not exist", async () => {
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValue(undefined);

      const result = await getUserById(999); 
      expect(result).toBeUndefined();
    });
  });
  
  describe("createUser", () => {
    it('should create a user and return success message', async () => {
            const user = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@email.com',
                password: 'hashedpassword1',
                contactPhone: "123456789",
                address: "Nairobi"
            };
            const result = await createUser(user)
            expect(db.insert).toHaveBeenCalled()
            expect(result).toBe("User created successfully")
        });

    it("should throw an error if db.insert fails", async () => {
      (db.insert as jest.Mock).mockImplementation(() => ({
        values: jest.fn().mockRejectedValue(new Error("DB insert failed")),
      }));

      await expect(createUser(mockUser as any)).rejects.toThrow("DB insert failed");
    });
  });

  describe("getUserByEmailService", () => {
    it("should get user by email", async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserByEmailService("john@example.com");
    expect(result).toEqual(mockUser);
    expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
  });

    it("should return undefined if email is not found", async () => {
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValue(undefined);

      const result = await getUserByEmailService("nonexistent@example.com");
      expect(result).toBeUndefined();
    });
  });

  describe("verifyUserService", () => {
    it("should verify user", async () => {
    const whereMock = jest.fn();
    const setMock = jest.fn().mockReturnValue({ where: whereMock });
    (db.update as jest.Mock).mockReturnValue({ set: setMock });

    await verifyUserService("john@example.com");
    expect(db.update).toHaveBeenCalled();
    expect(setMock).toHaveBeenCalledWith({
      isVerified: true,
      verificationCode: null,
    });
    expect(whereMock).toHaveBeenCalled();
  });

    it("should throw error if db.update fails", async () => {
      const setMock = jest.fn().mockReturnValue({
        where: jest.fn().mockRejectedValue(new Error("Update failed")),
      });
      (db.update as jest.Mock).mockReturnValue({ set: setMock });

      await expect(verifyUserService("error@example.com")).rejects.toThrow("Update failed");
    });
  });

  describe("updateUser", () => {
    it("should update user details", async () => {
    const whereMock = jest.fn();
    const setMock = jest.fn().mockReturnValue({ where: whereMock });
    (db.update as jest.Mock).mockReturnValue({ set: setMock });

    const result = await updateUser(1, mockUser);
    expect(result).toBe("User updated successfully");
    expect(db.update).toHaveBeenCalled();
    expect(setMock).toHaveBeenCalledWith(mockUser);
    expect(whereMock).toHaveBeenCalled();
  });

    it("should throw error if update fails", async () => {
      const setMock = jest.fn().mockReturnValue({
        where: jest.fn().mockRejectedValue(new Error("Update error")),
      });
      (db.update as jest.Mock).mockReturnValue({ set: setMock });

      await expect(updateUser(1, mockUser as any)).rejects.toThrow("Update error");
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
    const whereMock = jest.fn();
    (db.delete as jest.Mock).mockReturnValue({ where: whereMock });

    const result = await deleteUser(1);
    expect(result).toBe("User deleted successfully");
    expect(db.delete).toHaveBeenCalled();
    expect(whereMock).toHaveBeenCalled();
  });

    it("should throw error if deletion fails", async () => {
      const whereMock = jest.fn().mockRejectedValue(new Error("Delete error"));
      (db.delete as jest.Mock).mockReturnValue({ where: whereMock });

      await expect(deleteUser(1)).rejects.toThrow("Delete error");
    });
  });

  describe("userLoginService", () => {
     it("should login a user by email", async () => {
    (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValue(mockUser);

    const result = await userLoginService({ ...mockUser });
    expect(result).toEqual(mockUser);
    expect(db.query.UsersTable.findFirst).toHaveBeenCalled();
  });

    it("should return null if user not found", async () => {
      (db.query.UsersTable.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await userLoginService({ email: "unknown@example.com", password: "pass" } as any);
      expect(result).toBeNull();
    });
  });

});
