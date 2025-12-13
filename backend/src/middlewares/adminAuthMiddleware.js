import jwt from "jsonwebtoken";
import adminModel from "../models/admin.js";
import { JWT_SECRET_ADMIN } from "../configs/adminJWT.js";




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
