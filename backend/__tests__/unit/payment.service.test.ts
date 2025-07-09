import {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentByUserId,
} from "../../src/payments/payment.service";
import db from "../../src/Drizzle/db";
import { PaymentsTable } from "../../src/Drizzle/schema";

jest.mock("../../src/Drizzle/db", () => ({
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  query: {
    PaymentsTable: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Payments Service", () => {
  describe("createPayment", () => {
    it("should insert a payment and return the inserted payment", async () => {
      const payment = {
        bookingID: 1,
        userID: 1,
        amount: "200.00", 
        paymentStatus: "Completed", 
        paymentMethod: "Mpesa", 
        transactionID: "TX123456789", 
         
      };

      const inserted = {
        paymentID: 1,
        ...payment,
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([inserted]),
        }),
      });

      const result = await createPayment(payment as any);
      expect(db.insert).toHaveBeenCalledWith(PaymentsTable);
      expect(result).toEqual(inserted);
    });

    it("should return null if insertion fails", async () => {
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValueOnce([null]),
        }),
      });

      const result = await createPayment({
        bookingID: 1,
        userID: 1,
        amount: "1000.00", 
        paymentStatus: "Completed", 
        paymentMethod: "Mpesa", 
        transactionID: "TX123456789",
      } as any);

      expect(result).toBeNull();
    });
  });

  describe("getAllPayments", () => {
    it("should return all payments", async () => {
      const payments = [
        {
          paymentID: 1,
          userID: 1,
          amount: "1000.00", 
          paymentStatus: "Completed", 
          paymentMethod: "Mpesa", 
          transactionID: "TX123456789",
          paymentDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValueOnce(payments);

      const result = await getAllPayments();
      expect(result).toEqual(payments);
    });

    it("should return empty array if no payments exist", async () => {
      (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValueOnce([]);
      const result = await getAllPayments();
      expect(result).toEqual([]);
    });
  });

  describe("getPaymentById", () => {
    it("should return a payment if found", async () => {
      const payment = {
        paymentID: 1,
        userID: 1,
        amount: "1000.00", 
        paymentStatus: "Completed", 
        paymentMethod: "Mpesa", 
        transactionID: "TX123456789",
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.query.PaymentsTable.findFirst as jest.Mock).mockResolvedValueOnce(payment);

      const result = await getPaymentById(1);
      expect(result).toEqual(payment);
    });

    it("should return undefined if payment is not found", async () => {
      (db.query.PaymentsTable.findFirst as jest.Mock).mockResolvedValueOnce(undefined);
      const result = await getPaymentById(999);
      expect(result).toBeUndefined();
    });
  });

  describe("updatePayment", () => {
    it("should update a payment and return the updated object", async () => {
      const updatedpayment = {
        paymentID: 1,
        userID: 1,
        amount: "600.00", 
        paymentStatus: "Completed", 
        paymentMethod: "M-pesa", 
        transactionID: "TX123456701",
        paymentDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([updatedpayment]),
          }),
        }),
      });

      const result = await updatePayment(1, updatedpayment as any);
      expect(db.update).toHaveBeenCalledWith(PaymentsTable);
      expect(result).toEqual(updatedpayment);
    });

    it("should return null if no payment was updated", async () => {
      (db.update as jest.Mock).mockReturnValue({
        set: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            returning: jest.fn().mockResolvedValueOnce([]),
          }),
        }),
      });

      const result = await updatePayment(1, {} as any);
      expect(result).toBeNull();
    });
  });

  describe("deletePayment", () => {
    it("should delete a payment and return success message", async () => {
      (db.delete as jest.Mock).mockReturnValue({
        where: jest.fn().mockResolvedValueOnce(undefined),
      });

      const result = await deletePayment(1);
      expect(db.delete).toHaveBeenCalledWith(PaymentsTable);
      expect(result).toBe("Payment deleted successfully");
    });
  });

  describe("getPaymentsByUserId", () => {
    it("should return payments for a specific user", async () => {
      const userPayments = [
        {
          paymentID: 1,
          userID: 1,
          amount: "600.00", 
          paymentStatus: "Completed", 
          paymentMethod: "M-pesa", 
          transactionID: "TX123456701",
          paymentDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValueOnce(userPayments);

      const result = await getPaymentByUserId(3);
      expect(result).toEqual(userPayments);
    });

    it("should return empty array if user has no payments", async () => {
      (db.query.PaymentsTable.findMany as jest.Mock).mockResolvedValueOnce([]);

      const result = await getPaymentByUserId(10);
      expect(result).toEqual([]);
    });
  });
});
