import { bookingModel } from "../models/Booking";
import { userModel } from "../models/User";



export const getUserBookings = async (req, res) => {
    
    try{
        const user = req.userId;

        const bookings = await bookingModel.find({user}).populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createdAt : -1})


        res.json({
            success: true,
            bookings
        })
    }
    catch(e)
    {
        console.error(e)


        res.json({
            success: false,
            message: e.message
        })
    }
}







export const addFavourite = async (req, res) => {

    try{
        const {movieId} = req.body;
        const userId = req.userId;


        // const user = await userModel.findById(userId)

        // if (!user) {
        //     return res.status(404).json({ message: "User not found" });
        // }


        // if(!user.favourites){
        //     user.favourites =  []
        // }

        // if(!user.favourites.includes(movieId)){
        //     user.favourites.push(movieId)
        // }



        // await user.save();

        const result = await userModel.updateOne(
            { _id: userId },
            { $addToSet: { favourites: movieId } }
        );


        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }


        res.json({
            success: true,
            message: "Favourite added successfully"
        })

    }
    catch(e)
    {
        console.error(e)

        res.json({
            success: false,
            message: e.message
        })
    }
}