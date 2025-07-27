import { Express } from "express";
import { initiateSTKPush, mpesaCallback } from "./mpesa.controller";
import { userRoleAuth } from "../middleware/bearAuth";

export default function mpesaRouter(app: Express) {
  app.post("/api/mpesa/stk",userRoleAuth, initiateSTKPush);
  app.post("/api/mpesa/callback", (req, res) => {
  mpesaCallback(req, res);
});
}