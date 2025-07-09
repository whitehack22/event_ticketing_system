import db from "../Drizzle/db";
import { PaymentsTable } from "../Drizzle/schema";
import { eq } from "drizzle-orm";
import { TIPayment } from "../Drizzle/schema";

//Getting all payments
export const getAllPayments = async () => {
  const payments = await db.query.PaymentsTable.findMany()
    return payments;
};

//Getting payment by ID
export const getPaymentById = async (id: number) => {
   const payment = await db.query.PaymentsTable.findFirst({
        where: eq(PaymentsTable.paymentID, id)
  })
  return payment
};

//Create a new payment
export const createPayment = async (payment: TIPayment) => {
    const [inserted] = await db.insert(PaymentsTable).values(payment).returning()
    if (inserted) {
        return inserted
    }
    return null
}

//Update payment details
export const updatePayment =  async (id: number, payment: TIPayment) => {
    const updated = await db
    .update(PaymentsTable)
    .set(payment)
    .where(eq(PaymentsTable.paymentID, id))
    .returning(); 

    if (!updated || updated.length === 0) {
        return null;
    }

    return updated[0]; 
};

//deleting payment by ID
export const deletePayment = async (id: number) => {
  await db.delete(PaymentsTable).where(eq(PaymentsTable.paymentID, id))
  return "Payment deleted successfully";
};

// Get payments by user ID
export const getPaymentByUserId = async (userID: number) => {
  const payments = await db.query.PaymentsTable.findMany({
    where: eq(PaymentsTable.userID, userID),
  });
  return payments;
};


