import express, { Router } from "express"
import { addShow, getNowPlayingMovies, getShowOne, getShows } from "../controllers/showController.js"
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js"


const showRouter = Router()


showRouter.get("/now-playing", adminAuthMiddleware, getNowPlayingMovies)
showRouter.post("/add", adminAuthMiddleware, addShow)
showRouter.get("/all", getShows)
showRouter.get("/:movieId", getShowOne)


export default showRouter