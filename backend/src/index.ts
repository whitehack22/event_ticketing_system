import express from "express";
import booking from "./bookings/booking.router";
import supportTicket from "./customer_support/support.router";
import event from "./events/event.router";
import payment from "./payments/payment.router";
import venue from "./venues/venue.router";
import user from "./users/user.router";
import { logger } from "./middleware/logger";
import { rateLimiterMiddleware } from "./middleware/rateLimiter";

const initilizeApp = () => {
const app = express()

//middleware
app.use(express.json());
// app.use(logger)
// app.use(rateLimiterMiddleware)

//route
booking(app);
supportTicket(app);
event(app);
payment(app);
venue(app)
user(app);

app.get('/', (req, res) => {
  res.send('Hello Express!')
})

return app;

}
const app = initilizeApp();
export default app;