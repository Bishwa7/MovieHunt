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

index.js

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


