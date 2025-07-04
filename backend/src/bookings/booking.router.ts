import { Express } from "express";
import { createBookingController, deleteBookingController, getAllBookingsController, 
    getBookingByIdController, getBookingsByIdController, updateBookingController } from "./booking.controller";




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

    //update cars
    app.route("/api/booking/:id").put(
        async (req, res, next) => {
            try {
                await updateBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete car
    app.route("/api/booking/:id").delete(
        async (req, res, next) => {
            try {
                await deleteBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple cars by ID
    app.route("/api/bookings/:id").get(
        async (req, res, next) => {
            try {
                await getBookingsByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}


export default booking;


