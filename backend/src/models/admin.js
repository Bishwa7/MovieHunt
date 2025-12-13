import mongoose, { model, Schema } from "mongoose";

const adminSchema = new Schema({
    email: {type:String, required:true, unique:true},
    adminName: {type:String, required:true},
    password: {type:String, required:true}
})


export const adminModel = model("Admin", adminSchema)

