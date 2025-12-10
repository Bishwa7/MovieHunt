import express, { Router } from "express"
import { addShow, getNowPlayingMovies } from "../controllers/showController.js"


const showRouter = Router()


showRouter.get("/now-playing", getNowPlayingMovies)
showRouter.post("/add", addShow)


export default showRouter