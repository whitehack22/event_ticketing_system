import { Request, Response } from "express";
import * as supportTicketService from "./support.service";
import { sendEmail } from "../mailer/mailer";

// get all tickets
export const getAllSupportTicketsController = async (_req: Request, res: Response) => {
  try {
    const supportTickets = await supportTicketService.getAllSupportTickets()
    res.status(200).json({ data: supportTickets })
    return;
  } catch (error: any) {
    console.log("Error fetching support tickets:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get ticket by ID controller
export const getSupportTicketByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const supportTicket = await supportTicketService.getSupportTicketById(id);

    if (!supportTicket) {
      res.status(404).json({ message: "Support ticket not found" });
      return; 
    }

    res.status(200).json({ data: supportTicket });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create a support ticket controller
export const createSupportTicketController = async (req: Request, res: Response) => {
  try {
    const ticket = req.body;
    const supportTicket = await supportTicketService.createSupportTicket(req.body);

    if (!supportTicket) {
      res.status(400).json({ message: "Support Ticket not created" });
      return;
    }

    try {
     // Send confirmation email
    await sendEmail(
      ticket.email,
      "Support Ticket Received",
      `Issue: ${ticket.subject}`,
      `<p>Hi,</p><p>We have received your ticket:</p>
       <p><strong>${ticket.subject}</strong></p>
       <p>${ticket.description}</p>
       <p>Our team will review it and get back to you.</p>`
    );
    } catch (emailError) {
      console.log("Failed to send confirmation email:", emailError);
    }
    res.status(201).json({ message: "Support Ticket created and email sent", supportTicket });
    return;
  } catch (error: any) {
    console.log("Error creating support ticket:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Update support ticket controller
export const updateSupportTicketController = async (req: Request, res: Response) => {
  try {
    const ticket = req.body;
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const updated = await supportTicketService.updateSupportTicket(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Support Ticket not found" });
    }

    try {
     // Send resolution email
    if (ticket.status === "Resolved") {
      await sendEmail(
        ticket.email,
        "Your Support Ticket is Resolved",
        `Issue Resolved: ${ticket.subject}`,
        `<p>Hi,</p><p>Your support ticket has been resolved:</p>
         <p><strong>${ticket.subject}</strong></p>
         <p>If you have further concerns, feel free to contact us again.</p>`
      );
    }
    } catch (emailError) {
      console.log("Failed to send resolution email:", emailError);
    }

    res.status(200).json({ message: "Support Ticket updated successfully", supportTicket: updated });
    return;
  } catch (error: any) {
    console.log("Error updating support ticket:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete support ticket controller
export const deleteSupportTicketController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await supportTicketService.deleteSupportTicket(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.log("Error deleting support ticket:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

// Get support tickets by userID
export const getsupportTicketsByUserIdController = async (req: Request, res: Response) => {
  try {
    const userID = Number(req.params.userID);

    if (isNaN(userID)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const supportTickets = await supportTicketService.getSupportTicketByUserId(userID);

    if (!supportTickets || supportTickets.length === 0) {
      res.status(404).json({ message: "No support tickets found for this user." });
      return;
    }

    res.status(200).json({ data: supportTickets });
    return;
  } catch (error: any) {
    console.log("Error fetching support tickets by user ID:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};