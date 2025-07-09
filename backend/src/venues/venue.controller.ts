import { Request, Response } from "express";
import * as venueService from "./venue.service";

// get all venues
export const getAllVenuesController = async (_req: Request, res: Response) => {
  try {
    const venues = await venueService.getAllVenues()
    res.status(200).json({ data: venues })
    return;
  } catch (error: any) {
    console.error("Error fetching venues:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get venue by ID controller
export const getVenueByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const venue = await venueService.getVenueById(id);

    if (!venue) {
      res.status(404).json({ message: "Venue not found" });
      return; 
    }

    res.status(200).json({ data: venue });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create a venue controller
export const createVenueController = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (body.createdAt) body.createdAt = new Date(body.createdAt);

    const venue = await venueService.createVenue(body);

    if (!venue) {
      res.status(400).json({ message: "Venue not created" });
      return;
    }
    res.status(201).json({ message: "Venue created successfully", venue });
    return;
  } catch (error: any) {
    console.error("Error creating venue:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Update venue controller
export const updateVenueController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const body = req.body;

    if (body.createdAt) body.createdAt = new Date(body.createdAt);

    const updated = await venueService.updateVenue(id, body);
    if (!updated) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json({ message: "Venue updated successfully", event: updated });
    return;
  } catch (error: any) {
    console.error("Error updating venue:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete venue controller
export const deleteVenueController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await venueService.deleteVenue(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting venue:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};
