import { Request, Response } from "express";
import * as bookingService from "./booking.service";

// get all bookings
export const getAllBookingsController = async (_req: Request, res: Response) => {
  try {
    const bookings = await bookingService.getAllBookings()
    res.status(200).json({ data: bookings })
    return;
  } catch (error: any) {
    console.error("Error fetching bookings:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get booking by ID controller
export const getBookingByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const booking = await bookingService.getBookingById(id);

    if (!booking) {
      res.status(404).json({ message: "Booking not found" });
      return; 
    }

    res.status(200).json({ data: booking });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create a booking controller
export const createBookingController = async (req: Request, res: Response) => {
  try {
    const booking = await bookingService.createBooking(req.body);

    if (!booking) {
      res.status(400).json({ message: "Booking not created" });
      return;
    }
    res.status(201).json({ message: "Booking created successfully", booking });
    return;
  } catch (error: any) {
    console.error("Error creating booking:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Update booking controller
export const updateBookingController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const updated = await bookingService.updateBooking(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking updated successfully", booking: updated });
    return;
  } catch (error: any) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete booking controller
export const deleteBookingController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await bookingService.deleteBooking(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};


// Get bookings by userID
export const getBookingsByUserIdController = async (req: Request, res: Response) => {
  try {
    const userID = Number(req.params.userID);

    if (isNaN(userID)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const bookings = await bookingService.getBookingsByUserId(userID);

    if (!bookings || bookings.length === 0) {
      res.status(404).json({ message: "No bookings found for this user." });
      return;
    }

    res.status(200).json({ data: bookings });
    return;
  } catch (error: any) {
    console.error("Error fetching bookings by user ID:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};