import { Request, Response } from "express";
import * as salesService from "./sales.service";
import * as bookingsService from "./bookings.service";

export const getSalesReport = async (_req: Request, res: Response) => {
    try {
       const total = await salesService.getSalesSummary();
       const monthly = await salesService.getMonthlySales();
       res.status(200).json({ total, monthly });
       return;
    } catch (error: any) {
       console.log("Error fetching sales report:", error)
       res.status(500).json({ error: error.message || "Internal Server Error" })
       return;
  } 
};
  

export const getBookingsReport = async (_req: Request, res: Response) => {
    try {
       const total = await bookingsService.getBookingsSummary();
       const monthly = await bookingsService.getBookingsByMonth();
       res.status(200).json({ total, monthly });
       return; 
    } catch (error: any) {
        console.log("Error fetching bookings report:", error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
        return;
    }
  
};

export const getTopEventsReport = async (_req: Request, res: Response) => {
    try {
      const topEvents = await bookingsService.getTopBookedEvents();
      res.status(200).json(topEvents); 
      return; 
    } catch (error: any) {
        console.log("Error fetching top events report:", error)
        res.status(500).json({ error: error.message || "Internal Server Error" })
        return;
    }
  
};
