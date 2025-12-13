import { Router } from "express";
const adminRouter = Router();

import {z} from "zod"
import bcrypt from "bcrypt";



import jwt from "jsonwebtoken"
import { JWT_SECRET_ADMIN } from "../configs/adminJWT.js";
import adminModel from "../models/admin.js";








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


    const {email, adminName, password} = req.body;
    
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