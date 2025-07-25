import { Express } from "express";
import { createBookingController, deleteBookingController, getAllBookingsController, 
    getBookingByIdController, getBookingsByUserIdController, updateBookingController } from "./booking.controller";
 import { adminRoleAuth, userRoleAuth } from "../middleware/bearAuth";




const booking = (app: Express) => {
    // create booking
    app.route("/api/booking").post(
        async (req, res, next) => {
            try {
                await createBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all bookings
    app.route("/api/bookings").get(
        adminRoleAuth,
        async (req, res, next) => {
            try {
                await getAllBookingsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get booking by ID
    app.route("/api/booking/:id").get(
        async (req, res, next) => {
            try {
                await getBookingByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update bookings
    app.route("/api/booking/:id").put(
        async (req, res, next) => {
            try {
                await updateBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete booking
    app.route("/api/booking/:id").delete(
        async (req, res, next) => {
            try {
                await deleteBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Get bookings by user ID
        app.route("/api/bookings/user/:userID").get(
        userRoleAuth,
        async (req, res, next) => {
            try {
            await getBookingsByUserIdController(req, res);
            } catch (error) {
            next(error);
            }
        }
        );
}


export default booking;


