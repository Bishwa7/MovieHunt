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
    image: {type:String},
    password: {type:String, required:true}
})


const userModel = model("User", userSchema)


export default userModel
```


<br/><br/>



