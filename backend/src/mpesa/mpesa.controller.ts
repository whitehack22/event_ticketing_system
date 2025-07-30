import { Request, Response } from "express";
import axios from "axios";
import { getAccessToken } from "./mpesa.service";

export const initiateSTKPush = async (req: Request, res: Response) => {
  const { phone, amount} = req.body;

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

    res.status(200).json({ message: "STK Push sent successfully", data });
    return;
  } catch (error: any) {
    console.error("STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to initiate STK Push" });
    return;
  }
};


export const mpesaCallback = async (req: Request, res: Response) => {
  console.log("📩 M-PESA CALLBACK RECEIVED");
  console.dir(req.body, { depth: null });

  res.status(200).json({ message: "Callback received successfully" });
};
