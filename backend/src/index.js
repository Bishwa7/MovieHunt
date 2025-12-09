import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import userRouter from './routes/user.js'


const app = express()
const port = 3000


// Middleware
app.use(express.json())
app.use(cors())



// API Routes
app.get("/", (req, res) => {
    res.send("Server is LIVE")
})


app.use("/api/v1/user", userRouter)









async function main()
{
    await connectDB()

    app.listen(port, () => {
        console.log(`Servr listening at http://localhost:${port}`)
    })
}



main().catch(err => console.log(err))