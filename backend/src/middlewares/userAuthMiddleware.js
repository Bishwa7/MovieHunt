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