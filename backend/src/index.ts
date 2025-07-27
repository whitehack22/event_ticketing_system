import express from "express";
import booking from "./bookings/booking.router";
import supportTicket from "./customer_support/support.router";
import event from "./events/event.router";
import payment from "./payments/payment.router";
import venue from "./venues/venue.router";
import user from "./users/user.router";
import { logger } from "./middleware/logger";
import { rateLimiterMiddleware } from "./middleware/rateLimiter";
import cors from "cors";
import analytics from "./analytics/analytics.router";
import mpesaRouter from "./mpesa/mpesa.router";

const initilizeApp = () => {
const app = express()

//middleware
app.use(express.json());
 app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }))
app.use(logger)
// app.use(rateLimiterMiddleware)

//route
booking(app);
supportTicket(app);
event(app);
payment(app);
venue(app)
user(app);
analytics(app);
mpesaRouter(app);

app.get('/', (req, res) => {
  res.send('Hello Express!')
})

return app;

}
const app = initilizeApp();
export default app;