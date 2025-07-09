import { Express } from "express";
import { createSupportTicketController, deleteSupportTicketController, getAllSupportTicketsController, 
    getSupportTicketByIdController, getSupportTicketsByIdController, getsupportTicketsByUserIdController,
     updateSupportTicketController, } from "./support.controller";




const supportTicket = (app: Express) => {
    // create support ticket
    app.route("/api/ticket").post(
        async (req, res, next) => {
            try {
                await createSupportTicketController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all support tickets
    app.route("/api/tickets").get(
        async (req, res, next) => {
            try {
                await getAllSupportTicketsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get ticket by ID
    app.route("/api/ticket/:id").get(
        async (req, res, next) => {
            try {
                await getSupportTicketByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update ticket
    app.route("/api/ticket/:id").put(
        async (req, res, next) => {
            try {
                await updateSupportTicketController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete ticket
    app.route("/api/ticket/:id").delete(
        async (req, res, next) => {
            try {
                await deleteSupportTicketController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple tickets by ID
    app.route("/api/tickets/:id").get(
        async (req, res, next) => {
            try {
                await getSupportTicketsByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Get tickets by user ID
            app.route("/api/tickets/user/:userID").get(
            async (req, res, next) => {
                try {
                await getsupportTicketsByUserIdController(req, res);
                } catch (error) {
                next(error);
             }
        }
     );
}


export default supportTicket;


