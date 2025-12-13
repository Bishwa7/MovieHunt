import express, { Router } from "express"
import { addShow, getNowPlayingMovies } from "../controllers/showController.js"
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js"


const showRouter = Router()


showRouter.get("/now-playing", adminAuthMiddleware, getNowPlayingMovies)
showRouter.post("/add", adminAuthMiddleware, addShow)


export default showRouter