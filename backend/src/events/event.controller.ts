import { Request, Response } from "express";
import * as eventService from "./event.service";

// get all events
export const getAllEventsController = async (_req: Request, res: Response) => {
  try {
    const events = await eventService.getAllEvents()
    res.status(200).json({ data: events })
    return;
  } catch (error: any) {
    console.error("Error fetching events:", error)
    res.status(500).json({ error: error.message || "Internal Server Error" })
    return;
  }
};

//get event by ID controller
export const getEventByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
       res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const event = await eventService.getEventById(id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return; 
    }

    res.status(200).json({ data: event });

    return;
  } catch (error: any) {
     res.status(500).json({ error: error.message })
    return;
  }
};

//Create an event controller
export const createEventController = async (req: Request, res: Response) => {
  try {
    const event = await eventService.createEvent(req.body);

    if (!event) {
      res.status(400).json({ message: "Event not created" });
      return;
    }
    res.status(201).json({ message: "Event created successfully", event });
    return;
  } catch (error: any) {
    console.error("Error creating event:", error);
     res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Update event controller
export const updateEventController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const updated = await eventService.updateEvent(id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated successfully", event: updated });
    return;
  } catch (error: any) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

//Delete event controller
export const deleteEventController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    await eventService.deleteEvent(id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};

// get multiple events by ID controller
export const getEventsByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const events = await eventService.getEventsById(id);

    if (!events || events.length === 0) {
      res.status(404).json({ message: "No events found" });
      return;
    }
    res.status(200).json({ data: events });
    return;
  } catch (error: any) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
    return;
  }
};