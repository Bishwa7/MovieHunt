import { Router } from "express";
const userRouter = Router();

import {z} from "zod"
import bcrypt from "bcrypt";

import {userModel} from "../models/User.js"

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