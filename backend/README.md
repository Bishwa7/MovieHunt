**Note - For Self Reference**


# Backend Steps - 


## Step 1 - 
- bootstrapped an express backend application


In the backend dir,
initialize a project and create the package. json file

```
npm init -y
```

install dependencies

```
npm install express jsonwebtoken mongoose cors dotenv axios cloudinary
```

install dev dependencies

```
npm install nodemon --save-dev
```



<br/>

create a index.js file in backend dir

src/index.js

```javascript
import express from 'express'
import cors from 'cors'
import 'dotenv/config'


const app = express()
const port = 3000


// Middleware
app.use(express.json())
app.use(cors())


// API Routes
app.get("/", (req, res) => {
    res.send("Server is LIVE")
})


app.listen(port, () => {
    console.log(`Servr listening at http://localhost:${port}`)
})
```

<br/>

add scripts in package.json

```javascript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
```


now run the below in terminal to start the backend

```
npm run dev
```



<br/><br/>


## Step 2 -
- connected to MongoDB
- created userSchema & userModel

<br/>

- *connected to MongoDB*

.env.example

```
MONGODB_URL=MONGODB_ATLAS_Connection_String
```


configs/db.js

```javascript
import mongoose from "mongoose"

const connectDB = async () => {

    try{
        if(!process.env.MONGODB_URL)
        {
            throw new Error("MongoDB URL not found in .env file")
        }

        await mongoose.connect(`${process.env.MONGODB_URL}/movie-hunt`)
        
        console.log("Database Connected")
    }
    catch(err)
    {
        console.error(err)
    }
}

export default connectDB
```




index.js

```javascript
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'


const app = express()
const port = 3000

// Middleware
app.use(express.json())
app.use(cors())


// API Routes
app.get("/", (req, res) => {
    res.send("Server is LIVE")
})


async function main()
{
    await connectDB()

    app.listen(port, () => {
        console.log(`Servr listening at http://localhost:${port}`)
    })
}

main().catch(err => console.log(err))
```

<br/>

- *created userSchema & userModel*


models/User.js

```javascript
import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    email: {type:String, required:true, unique:true},
    userName: {type:String, required:true},
    password: {type:String, required:true}
})


const userModel = model("User", userSchema)


export default userModel
```


<br/><br/>



## Step 3 -
- creates routes/user.js
- created userAuthMiddleware.js
- created config/userJWT.js
- added vercel.json


<br/>

- *created config/userJWT.js*

.env.example

```
MONGODB_URL=MONGODB_ATLAS_Connection_String

JWT_SECRET_USER=user_JWT_String
```


userJWT.js

```javascript
import dotenv from "dotenv"
dotenv.config()


export const JWT_SECRET_USER = process.env.JWT_SECRET_USER;
```


<br/>


- *creates routes/user.js*


```
npm install zod bcrypt
```

routes/user.js

```javascript
import { Router } from "express";
const userRouter = Router();

import {z} from "zod"
import bcrypt from "bcrypt";

import { userModel } from "../models/User.js";

import jwt from "jsonwebtoken"
import { JWT_SECRET_USER } from "../configs/userJWT.js";



userRouter.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        email: z.email(),
        userName: z.string().min(5).max(30),
        password: z.string().min(8).max(20)
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." })
    })


    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){
        res.status(411).json({
            message: "incorrect input format",
            error: parsedData.error
        })
        return
    }


    const {email, userName, password} = parsedData.data;
    
    try{
        const hashedPassword = await bcrypt.hash(password, 5)

        await userModel.create({
            email: email,
            userName: userName,
            password: hashedPassword
        })

        res.status(200).json({
            message: "You are signed up"
        })
    }
    catch(e){
        console.log("error while signup (db entry)")

        res.status(403).json({
            message: "User already exists"
        })
    }

})



userRouter.post("/signin", async (req, res) => {
    
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email
    })


    if(user)
    {
        const passwordMatch = await bcrypt.compare(password, user.password)

        if(passwordMatch)
        {
            const token = jwt.sign({ id: user._id }, JWT_SECRET_USER)

            res.status(200).json({
                message: "Login Succesfull",
                token: token,
                "user": {
                    "name": user.userName,
                    "email": user.email
                }
            })

        }
        else{
            res.status(403).json({
                message: "Password incorrect"
            })
        }
        
    }
    else
    {
        res.status(403).json({
            message: "Email incorrect"
        })
    }


})


export default userRouter;
```



src/index.js

```javascript
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
```



<br/>


- *created userAuthMiddleware.js*


middlewares/userAuthMiddleware.js

```javascript
import jwt from "jsonwebtoken"
import { JWT_SECRET_USER } from "../config/config.js"



export const userAuthMiddleware = (req, res, next) =>
{
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
        .status(401)
        .json({ message: "Authorization header is missing or malformed" });
    }


    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token ,JWT_SECRET_USER) 

        
        if (!decoded.id) {
        return res.status(403).json({ message: "Invalid token payload" });
        }
        
        req.userId = decoded.id;
        next();
    } 
    catch (err) 
    {
        return res.status(403).json({ message: "Invalid or expired token" });
    }

}
```


<br/>

- *added vercel.json*

vercel.json

```javascript
  {
    "version": 2,
    "builds": [
        {
            "src": "index.js",
            "use": "@vercel/node",
            "config": {
                "includeFiles": [
                    "dist/**"
                ]
            }
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "index.js"
        }
    ]
}
```



<br/><br/>




## Step 4 - 
- created Movie.js & Show.js DB Schema & Models
- created showController.js to fetch now playing movies from TMDB
- added routes/showRoutes.js


<br/>


- *created Movie.js & Show.js DB Schema & Models*


models/Movie.js

```javascript
import mongoose, { model, Schema } from "mongoose"

const movieSchema = new Schema(
    {
        _id: {type: String, required: true},
        title: {type: String, required: true},
        title: {type: String, required: true},
        overview: {type: String, required: true},
        poster_path: {type: String, required: true},
        backdrop_path: {type: String, required: true},
        release_date: {type: String, required: true},
        original_language: {type: String},
        tagline: {type: String},
        genres: {type: Array, required: true},
        casts: {type: Array, required: true},
        vote_average: {type: Number, required: true},
        runtime: {type: Number, required: true},
    },
    {
        timestamps: true
    }
)


export const movieModel = model("Movie", movieSchema)
```



models/Show.js

```javascript
import mongoose, { model, Schema } from "mongoose";


const showSchema = new Schema(
    {
        movie: {type: String, required: true, ref: "Movie"},
        showDateTime: {type: Date, required: true},
        showPrice: {type: Number, required: true},
        occupiedSeats: {type: Object, default:{}}
    },
    {
        minimize: false
    }
)


export const showModel = model("Show", showSchema)
```

<br/>


- *created showController.js to fetch now playing movies from TMDB*


.env.example

```
MONGODB_URL=MONGODB_ATLAS_Connection_String

JWT_SECRET_USER=user_JWT_String

TMDB_API_KEY=API_KEY_from_themoviedb.org
```





controllers/showController.js

```javascript
import axios from "axios"
import { movieModel } from "../models/Movie.js"
import { showModel } from "../models/Show.js"



// Api to get now playing movies from TMDB
export const getNowPlayingMovies = async (req, res) => {
    
    try
    {
        const {data} = await axios.get("https://api.themoviedb.org/3/movie/now_playing",
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            }
        )


        const movies = data.results

        res.json({
            success: true,
            movies: movies
        })

    }
    catch(err)
    {
        console.error(err);
        
        res.json({
            success: false,
            message: err.message
        })
    }
}





// API to add a new show to the database
export const addShow = async (req, res) => {

    try{
        const {movieId, showsInput, showPrice} = req.body

        let movie = await movieModel.findById(movieId)

        if(!movie)
        {
            // fetch movie details & credits from tmdb
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                ),

                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                )
            ])


            const movieApiData = movieDetailsResponse.data
            const movieCreditsData = movieCreditsResponse.data


            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language || "",
                tagline: movieApiData.tagline || "",
                genres: movieApiData.genres,
                casts: movieCreditsData.casts,
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime
            }



            // adding movie to mongodb
            movie = await movieModel.create(movieDetails)
        }

        
        const showsToCreate = []

        showsInput.forEach(show => {
            const showDate = show.date

            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`

                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });


        if(showsToCreate.length > 0)
        {
            await showModel.insertMany(showsToCreate)
        }


        res.json({
            success: true,
            message: "Show added successfully"
        })

        
    }
    catch(err)
    {
        console.error(err);
        
        res.json({
            success: false,
            message: err.message
        })
    }
}
```


<br/>

- *added routes/showRoutes.js*


showRoutes.js

```javascript
import express, { Router } from "express"
import { addShow, getNowPlayingMovies } from "../controllers/showController.js"


const showRouter = Router()


showRouter.get("/now-playing", getNowPlayingMovies)
showRouter.post("/add", addShow)


export default showRouter
```



index.js

```javascript
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import userRouter from './routes/user.js'
import showRouter from './routes/showRoutes.js'


const app = express()
const port = 3000


// Middleware
app.use(express.json())
app.use(cors())


// API Routes
app.get("/", (req, res) => {
    res.send("Server is LIVE")
})


app.use("/api/v1/user", userRouter)     // user route
app.use("/api/show", showRouter)        // show route




async function main()
{
    await connectDB()

    app.listen(port, () => {
        console.log(`Servr listening at http://localhost:${port}`)
    })
}



main().catch(err => console.log(err))
```



<br/><br/>


## Step 5 - 
- added admin.js Model (DB)
- added admin.js routes
- added adminAuthMiddleware.js in showRoutes.js (for only admin to maintain them)

<br/>

- *added admin.js Model (DB)*

models/admin.js

```javascript
import mongoose, { model, Schema } from "mongoose";

const adminSchema = new Schema({
    email: {type:String, required:true, unique:true},
    adminName: {type:String, required:true},
    password: {type:String, required:true}
})


export const adminModel = model("Admin", adminSchema)
```

<br/>

- *added admin.js routes*

.env.example
```
MONGODB_URL=MONGODB_ATLAS_Connection_String

JWT_SECRET_USER=user_JWT_String
JWT_SECRET_ADMIN=admin_JWT_String

TMDB_API_KEY=API_KEY_from_themoviedb.org
```



configs/adminJWT.js

```javascript
import dotenv from "dotenv"
dotenv.config()


export const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;
```


routes/admin.js

```javascript
import { Router } from "express";
const adminRouter = Router();

import {z} from "zod"
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken"
import { JWT_SECRET_ADMIN } from "../configs/adminJWT.js";
import { adminModel } from "../models/admin.js";




adminRouter.post("/signup", async (req, res) => {
    const requiredBody = z.object({
        email: z.email(),
        adminName: z.string().min(5).max(30),
        password: z.string().min(8).max(20)
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." })
    })


    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){
        res.status(411).json({
            message: "incorrect input format",
            error: parsedData.error
        })
        return
    }


    const {email, adminName, password} = parsedData.data;
    
    try{
        const hashedPassword = await bcrypt.hash(password, 5)

        await adminModel.create({
            email: email,
            adminName: adminName,
            password: hashedPassword
        })

        res.status(200).json({
            message: "You are signed up (Admin)"
        })
    }
    catch(err){
        console.log("error while signup (db entry)")
        console.error(err)

        res.status(403).json({
            message: "Admin already exists"
        })
    }
})



adminRouter.post("/signin", async (req, res) => {
    
    const { email, password } = req.body;

    const admin = await adminModel.findOne({
        email: email
    })


    if(admin)
    {
        const passwordMatch = await bcrypt.compare(password, admin.password)

        if(passwordMatch)
        {
            const token = jwt.sign({ id: admin._id }, JWT_SECRET_ADMIN)

            res.status(200).json({
                message: "Login Succesfull",
                token: token,
                "admin": {
                    "name": admin.adminName,
                    "email": admin.email
                }
            })

        }
        else{
            res.status(403).json({
                message: "Password incorrect"
            })
        }
        
    }
    else
    {
        res.status(403).json({
            message: "Email incorrect"
        })
    }
})


export default adminRouter;
```


src/index.js

```javascript
import dotenv from "dotenv";
dotenv.config();

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import userRouter from './routes/user.js'
import showRouter from './routes/showRoutes.js'
import adminRouter from "./routes/admin.js";


const app = express()
const port = 3000


// Middleware
app.use(express.json())
app.use(cors())



// API Routes
app.get("/", (req, res) => {
    res.send("Server is LIVE")
})

app.use("/api/v1/admin", adminRouter)   // admin route
app.use("/api/v1/user", userRouter)     // user route
app.use("/api/v1/show", showRouter)        // show route




async function main()
{
    await connectDB()

    app.listen(port, () => {
        console.log(`Servr listening at http://localhost:${port}`)
    })
}



main().catch(err => console.log(err))
```

<br/>


- *added adminAuthMiddleware.js in showRoutes.js (for only admin to maintain them)*


adminAuthMiddleware.js

```javascript
import jwt from "jsonwebtoken";
import adminModel from "../models/admin.js";
import { JWT_SECRET_ADMIN } from "../config/config.js";



export const adminAuthMiddleware = async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization header is missing or malformed",
    });
  }


  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET_ADMIN);

    if (!decoded.id) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

  
    const admin = await adminModel.findById(decoded.id);



    if (!admin) {
      return res.status(403).json({ message: "Admin not found" });
    }


    req.adminId = admin._id;
    next();
  }
  catch(err)
  {
    console.error(err)
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
```



routes/showRoutes.js

```javascript
import express, { Router } from "express"
import { addShow, getNowPlayingMovies } from "../controllers/showController.js"
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js"


const showRouter = Router()


showRouter.get("/now-playing", adminAuthMiddleware, getNowPlayingMovies)
showRouter.post("/add", adminAuthMiddleware, addShow)


export default showRouter
```



<br/><br/>





## Step 6 -
- added get all shows route in showController.js
- added route for getting a single show with movieId in showController.js


controllers/showController.js

```javascript
import axios from "axios"
import { movieModel } from "../models/Movie.js"
import { showModel } from "../models/Show.js"



// Api to get now playing movies from TMDB
export const getNowPlayingMovies = async (req, res) => {
    
    try
    {
        const {data} = await axios.get("https://api.themoviedb.org/3/movie/now_playing",
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            }
        )


        const movies = data.results

        res.json({
            success: true,
            movies: movies
        })

    }
    catch(err)
    {
        console.error(err);
        
        res.json({
            success: false,
            message: err.message,
            message2: "error in getNowPlayingMovies controller function"
        })
    }
}





// API to add a new show to the database
export const addShow = async (req, res) => {

    try{
        const {movieId, showsInput, showPrice} = req.body

        let movie = await movieModel.findById(movieId)

        if(!movie)
        {
            // fetch movie details & credits from tmdb
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                ),

                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                )
            ])


            const movieApiData = movieDetailsResponse.data
            const movieCreditsData = movieCreditsResponse.data


            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language || "",
                tagline: movieApiData.tagline || "",
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime
            }



            // adding movie to mongodb
            movie = await movieModel.create(movieDetails)
        }

        
        const showsToCreate = []

        showsInput.forEach(show => {
            const showDate = show.date

            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`

                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });


        if(showsToCreate.length > 0)
        {
            await showModel.insertMany(showsToCreate)
        }


        res.json({
            success: true,
            message: "Show added successfully"
        })

        
    }
    catch(err)
    {
        console.error(err);
        
        res.json({
            success: false,
            message: err.message,
            message2: "error in addShow to db controller function"
        })
    }
}








// Api to get all shows from DB

export const getShows = async (req, res) => {

    try{
        const shows = await showModel.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1})


        const uniqueShows = new Set(shows.map(show => show.movie))


        res.json({
            success: true,
            shows: Array.from(uniqueShows)
        })
    }
    catch(e){
        console.error(e)

        res.json({
            success: false,
            message: err.message,
            message2: "error in getShows (getting alll shows from db) db controller function"
        })
    }
}





// Api to get one single show from DB

export const getShowOne = async (req, res) => {

    try{
        const {movieId} = req.params

        const shows = await showModel.find({
            movie: movieId,
            showDateTime: {$gte: new Date()}
        })

        const movie = await movieModel.findById(movieId)

        const dateTime = {}

        shows.forEach((show) => {
            const data = show.showDateTime.toISOString().split("T")[0]

            if(!dateTime[date])
            {
                dateTime[date] = []
            }

            dateTime[date].push({
                time: show.showDateTime,
                showId: show._id
            })
        })



        res.json({
            success: true,
            movie,
            dateTime
        })




    }
    catch(e)
    {
        console.error(e)

        res.json({
            success: false,
            message: err.message,
            message2: "error in getShowOne (getting one show from db) db controller function"
        })
    }
}
```

<br/>


routes/showRoutes.js

```javascript
import express, { Router } from "express"
import { addShow, getNowPlayingMovies, getShowOne, getShows } from "../controllers/showController.js"
import { adminAuthMiddleware } from "../middlewares/adminAuthMiddleware.js"


const showRouter = Router()


showRouter.get("/now-playing", adminAuthMiddleware, getNowPlayingMovies)
showRouter.post("/add", adminAuthMiddleware, addShow)
showRouter.get("/all", getShows)
showRouter.get("/:movieId", getShowOne)


export default showRouter
```




<br/><br/><br/>




## Step 7 - 
- added booking DB Model
- created booking controller functions (bookingController.js)
- added bookingRoutes.js

<br/>


- added booking DB Model

Booking.js

```javascript
import mongoose, { Schema } from "mongoose"


const bookingSchema = new Schema({
    user: {type: String, required: true, ref: 'User'},
    show: {type: String, required: true, ref: 'Show'},
    amount: {type: Number, required: true},
    bookedSeats: {type: Array, required: true},
    isPaid: {type: Boolean, default: false},
    paymentLink: {type: String}
},{timestamps: true})


export const bookingModel = model("Booking", bookingSchema)
```


<br/>


- created booking controller functions (bookingController.js)

bookingController.js

```javascript
import { bookingModel } from "../models/Booking.js";
import { showModel } from "../models/Show.js"



const checkSeatsAvailabe = async (showId, selectedSeats) => {

    try{
        const showData = await showModel.findById(showId)

        if(!showData)
        {
            return false;
        }

        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat])

        return !isAnySeatTaken;
    }
    catch(e)
    {
        console.error(e)

        return false;

    }
}



export const createBooking = async (req, res) => {
    try{
        const userId = req.userId
        const {showId, selectedSeats} = req.body
        const {origin} = req.headers


        const isAvailable = await checkSeatsAvailabe(showId, selectedSeats)

        if(!isAvailable)
        {
            return res.json({
                success: false,
                message: "Selected seats are not available"
            })
        }


        const showData = await showModel.findById(showId).populate('movie')


        // booking new
        const booking = await bookingModel.create({
            user: userId,
            show: showId,
            amaount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })


        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');



        await showData.save()



        //payment logic
        
        //payment logic 



        res.json({
            success: true,
            message: "Booking successful"
        })

    }
    catch(e)
    {
        console.error(e)

        res.json({
            success: false,
            message: e.message
        })


    }
}






export const getOccupiedSeats = async (req, res) => {

    try{
        const {showId} = req.params;
        const showData = await showModel.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)


        res.json({
            success: true,
            occupiedSeats
        })

    }
    catch(e)
    {
        console.error(e)

        res.json({
            success: false,
            message: e.message
        })
    }
}
```


<br/>


- added bookingRoutes.js

routes/bookingRoutes.js

```javascript
import express, { Router } from "express"
import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";
import { userAuthMiddleware } from "../middlewares/userAuthMiddleware.js";

const bookingRouter = Router()


bookingRouter.post("/create", userAuthMiddleware ,createBooking)

bookingRouter.get("/seats/:showId", getOccupiedSeats)



export default bookingRouter;
```


index.js

```javascript
import dotenv from "dotenv";
dotenv.config();

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import userRouter from './routes/user.js'
import showRouter from './routes/showRoutes.js'
import adminRouter from "./routes/admin.js";
import bookingRouter from "./routes/bookingRoutes.js";


const app = express()
const port = 3000


// Middleware
app.use(express.json())
app.use(cors())



// API Routes
app.get("/", (req, res) => {
    res.send("Server is LIVE")
})

app.use("/api/v1/admin", adminRouter)   // admin route
app.use("/api/v1/user", userRouter)     // user route
app.use("/api/v1/show", showRouter)        // show route
app.use("/api/v1/booking", bookingRouter)



async function main()
{
    await connectDB()

    app.listen(port, () => {
        console.log(`Servr listening at http://localhost:${port}`)
    })
}


main().catch(err => console.log(err))
```



<br/><br/><br/>



## Step 8 - 
- created adminController.js functions (getDashboardData, getAllShows, getAllBookings)


<br/>

- created adminController.js functions (getDashboardData, getAllShows, getAllBookings)


controllers/adminController.js

```javascript
import { bookingModel } from "../models/Booking.js"
import { showModel } from "../models/Show.js"
import { userModel } from "../models/User.js"



export const getDashboardData = async (req, res) => {

    try{
        const bookings = await bookingModel.find({isPaid: true})

        const activeShows = await showModel.find({showDateTime: {$gte: new Date()}}).populate('movie')

        const totalUser = await userModel.countDocuments()

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        }


        res.json({
            success: true,
            dashboardData
        })
    }
    catch(e)
    {
        console.error(e)

        res.json({
            success: false,
            message: e.message
        })
    }
}




export const getAllShows = async (req, res) => {

    try{
        const shows = await showModel.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1, showPrice: 1})

        res.json({
            success: true,
            shows
        })
    }
    catch(e)
    {
        console.error(e)

        res.json({
            success: false,
            message: e.message
        })
    }
}






export const getAllBookings = async (req, res) => {

    try{
        const bookings = await bookingModel.find({}).populate('user').populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createdAt: -1})


        res.json({
            success: true,
            bookings
        })
    }
    catch(e)
    {
        console.error(e)


        res.json({
            success: false,
            message: e.message
        })
    }
}
```




<br/><br/><br/>