import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
    email: {type:String, required:true, unique:true},
    userName: {type:String, required:true},
    password: {type:String, required:true},

    favourites: [
        { type: Schema.Types.ObjectId, ref: "Movie" }
    ]
})


export const userModel = model("User", userSchema)

