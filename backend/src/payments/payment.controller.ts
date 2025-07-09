import { Request, Response } from "express";
import * as paymentService from "./payment.service";

// get all payments
export const getAllPaymentsController = async (_req: Request, res: Response) => {
  try {
    const payments = await paymentService.getAllPayments()
    res.status(200).json({ data: payments })
    return;
  } catch (error: any) {
    console.error("Error fetching payments:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get payment by ID controller
export const getPaymentByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const payment = await paymentService.getPaymentById(id);

    if (!payment) {
      res.status(404).json({ message: "Payment not found" });
      return; 
    }

    res.status(200).json({ data: payment });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create a payment controller
export const createPaymentController = async (req: Request, res: Response) => {
  try {

    const body = req.body;

    if (body.paymentDate) body.paymentDate = new Date(body.paymentDate);

    const payment = await paymentService.createPayment(body);

    if (!payment) {
      res.status(400).json({ message: "Payment not created" });
      return;
    }
    res.status(201).json({ message: "Payment created successfully", payment });
    return;
  } catch (error: any) {
    console.error("Error creating payment:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Update payment controller
export const updatePaymentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const body = req.body;

    if (body.paymentDate) body.paymentDate = new Date(body.paymentDate);
    if (body.createdAt) body.createdAt = new Date(body.createdAt);
    if (body.updatedAt) body.updatedAt = new Date(body.updatedAt);

    const updated = await paymentService.updatePayment(id, body);
    if (!updated) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment updated successfully", payment: updated });
    return;
  } catch (error: any) {
    console.error("Error updating payment:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete payment controller
export const deletePaymentController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await paymentService.deletePayment(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

// Get payments by userID
export const getPaymentsByUserIdController = async (req: Request, res: Response) => {
  try {
    const userID = Number(req.params.userID);

    if (isNaN(userID)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const payments = await paymentService.getPaymentByUserId(userID);

    if (!payments || payments.length === 0) {
      res.status(404).json({ message: "No payments found for this user." });
      return;
    }

    res.status(200).json({ data: payments });
    return;
  } catch (error: any) {
    console.error("Error fetching payments by user ID:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};