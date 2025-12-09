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


    const {email, userName, password} = req.body;
    
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