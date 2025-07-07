import { Express } from "express";
import { createVenueController, deleteVenueController, getAllVenuesController, 
    getVenueByIdController, getVenuesByIdController, updateVenueController } from "./venue.controller";




const venue = (app: Express) => {
    // create venue
    app.route("/api/venue").post(
        async (req, res, next) => {
            try {
                await createVenueController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all venues
    app.route("/api/venues").get(
        async (req, res, next) => {
            try {
                await getAllVenuesController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get venue by ID
    app.route("/api/venue/:id").get(
        async (req, res, next) => {
            try {
                await getVenueByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update venue
    app.route("/api/venue/:id").put(
        async (req, res, next) => {
            try {
                await updateVenueController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete venue
    app.route("/api/venue/:id").delete(
        async (req, res, next) => {
            try {
                await deleteVenueController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple venues by ID
    app.route("/api/venues/:id").get(
        async (req, res, next) => {
            try {
                await getVenuesByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}


export default venue;


