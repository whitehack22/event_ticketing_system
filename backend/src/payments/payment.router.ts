import { Express } from "express";
import { createPaymentController, deletePaymentController, getAllPaymentsController, 
    getPaymentByIdController, getPaymentsByIdController, updatePaymentController } from "./payment.controller";




const payment = (app: Express) => {
    // create payment
    app.route("/api/payment").post(
        async (req, res, next) => {
            try {
                await createPaymentController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all payments
    app.route("/api/payments").get(
        async (req, res, next) => {
            try {
                await getAllPaymentsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get payment by ID
    app.route("/api/payment/:id").get(
        async (req, res, next) => {
            try {
                await getPaymentByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update payment
    app.route("/api/payment/:id").put(
        async (req, res, next) => {
            try {
                await updatePaymentController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete payment
    app.route("/api/payment/:id").delete(
        async (req, res, next) => {
            try {
                await deletePaymentController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple payments by ID
    app.route("/api/payments/:id").get(
        async (req, res, next) => {
            try {
                await getPaymentsByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}


export default payment;


