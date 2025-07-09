import { Express } from "express";
import { createUserController, deleteUserController, getAllUsersController, 
    getUserByIdController, getUsersByIdController, loginUserController, updateUserController, 
    verifyUserController} from "./user.controller";


const user = (app: Express) => {
    // create user
    app.route("/api/user").post(
        async (req, res, next) => {
            try {
                await createUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all users
    app.route("/api/users").get(
        async (req, res, next) => {
            try {
                await getAllUsersController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get user by ID
    app.route("/api/user/:id").get(
        async (req, res, next) => {
            try {
                await getUserByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update users
    app.route("/api/user/:id").put(
        async (req, res, next) => {
            try {
                await updateUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete users
    app.route("/api/user/:id").delete(
        async (req, res, next) => {
            try {
                await deleteUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple users by ID
    app.route("/api/users/:id").get(
        async (req, res, next) => {
            try {
                await getUsersByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // login route
    app.route("/api/user/login").post(
        async (req, res, next) => {
            try {
                await loginUserController(req, res)
            } catch (error) {
                next()
            }
        }

    )
   
     // verify user route
    app.route("/api/user/verify").post(
        async (req, res, next) => {
            try {
                await verifyUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}


export default user;


