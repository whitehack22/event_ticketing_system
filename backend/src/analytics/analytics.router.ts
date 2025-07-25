import { Express } from "express";
import {
  getSalesReport,
  getBookingsReport,
  getTopEventsReport,
} from "./analytics.controller";

const analytics = (app: Express) => {

    //get sales reports
        app.route("/analytics/sales").get(
            async (req, res, next) => {
                try {
                    await getSalesReport(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )
    //get bookings reports
        app.route("/analytics/bookings").get(
            async (req, res, next) => {
                try {
                    await getBookingsReport(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )
    //get top events report
        app.route("/analytics/events/top").get(
            async (req, res, next) => {
                try {
                    await getTopEventsReport(req, res)
                } catch (error) {
                    next(error)
                }
            }
        )
}
export default analytics;
