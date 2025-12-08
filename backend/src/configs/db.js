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