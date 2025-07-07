import { Express } from "express";
import { createEventController, deleteEventController, getAllEventsController, 
    getEventByIdController, getEventsByIdController, updateEventController } from "./event.controller";




const event = (app: Express) => {
    // create event
    app.route("/api/event").post(
        async (req, res, next) => {
            try {
                await createEventController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all events
    app.route("/api/events").get(
        async (req, res, next) => {
            try {
                await getAllEventsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get event by ID
    app.route("/api/event/:id").get(
        async (req, res, next) => {
            try {
                await getEventByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update event
    app.route("/api/event/:id").put(
        async (req, res, next) => {
            try {
                await updateEventController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete event
    app.route("/api/event/:id").delete(
        async (req, res, next) => {
            try {
                await deleteEventController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple events by ID
    app.route("/api/events/:id").get(
        async (req, res, next) => {
            try {
                await getEventByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}


export default event;


