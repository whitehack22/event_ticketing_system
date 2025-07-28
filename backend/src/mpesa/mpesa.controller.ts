import { Request, Response } from "express";
import axios from "axios";
import { getAccessToken } from "./mpesa.service";
import db from "../Drizzle/db";
import { eq, sql } from "drizzle-orm";
import {
  PaymentsTable,
  BookingsTable,
  EventsTable,
} from "../Drizzle/schema";

export const initiateSTKPush = async (req: Request, res: Response) => {
  const { phone, amount, bookingID } = req.body;

  try {
    const accessToken = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      `${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`
    ).toString("base64");

    const payload = {
      BusinessShortCode: process.env.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.CALLBACK_URL,
      AccountReference: "EventTicketing",
      TransactionDesc: "Ticket Purchase",
    };

    const { data } = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { CheckoutRequestID } = data;

    //  Save CheckoutRequestID to booking
    await db
      .update(BookingsTable)
      .set({ checkoutRequestID: CheckoutRequestID })
      .where(eq(BookingsTable.bookingID, bookingID));

    res.status(200).json(data);
    return;
  } catch (error: any) {
    console.error("STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate STK Push" });
    return;
  }
};


export const mpesaCallback = async (req: Request, res: Response) => {
  const callback = req.body?.Body?.stkCallback;

  if (!callback) {
    res.status(400).json({ error: "Invalid M-Pesa callback format" });
    return;
  }

  const { ResultCode, CallbackMetadata, CheckoutRequestID } = callback;

  if (ResultCode !== 0) {
    console.warn(" M-PESA Payment not completed. Code:", ResultCode);
    res.status(200).json({ message: "M-PESA payment not successful" });
    return;
  }

  // Extract metadata into key/value format
  const metadata = Object.fromEntries(
    CallbackMetadata.Item.map((item: any) => [item.Name, item.Value])
  );

  const amount = metadata["Amount"];
  const receipt = metadata["MpesaReceiptNumber"];
  const phone = metadata["PhoneNumber"];

  try {
    // 1. Find the booking using CheckoutRequestID
    const [booking] = await db
      .select()
      .from(BookingsTable)
      .where(eq(BookingsTable.checkoutRequestID, CheckoutRequestID));

    if (!booking) {
      res.status(404).json({ error: "Booking not found for this payment" });
      return;
    }

    // 2.  Insert payment record
    await db.insert(PaymentsTable).values({
      bookingID: booking.bookingID,
      userID: booking.userID,
      amount,
      paymentStatus: "Completed",
      paymentMethod: "M-Pesa",
    });

    // 3. Update available tickets

    await db
      .update(EventsTable)
      .set({
        availableTickets: booking.numberOfTickets
          ? sql`available_tickets - ${booking.numberOfTickets}`
          : sql`available_tickets - 1`,
      })
      .where(eq(EventsTable.eventID, booking.eventID));

    // 4. Update booking status
    await db
      .update(BookingsTable)
      .set({ bookingStatus: "Completed" })
      .where(eq(BookingsTable.bookingID, booking.bookingID));

    console.log("M-PESA payment processed for Booking ID:", booking.bookingID);
    res.status(200).json({ message: "Payment recorded successfully" });
    return;
  } catch (error: any) {
    console.error("Error processing M-PESA callback:", error.message);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
