import express from "express";
import booking from "./bookings/booking.router";

const initilizeApp = () => {
const app = express()

//middleware
app.use(express.json());

//route
booking(app);

app.get('/', (req, res) => {
  res.send('Hello Express!')
})

return app;

}
const app = initilizeApp();
export default app;