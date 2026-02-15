import express, { Router } from "express"
import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";
import { userAuthMiddleware } from "../middlewares/userAuthMiddleware.js";

const bookingRouter = Router()


bookingRouter.post("/create", userAuthMiddleware ,createBooking)

bookingRouter.get("/seats/:showId", getOccupiedSeats)



export default bookingRouter;