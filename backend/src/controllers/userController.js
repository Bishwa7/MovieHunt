import { bookingModel } from "../models/Booking.js";
import { userModel } from "../models/User.js";



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







export const updateFavourite = async (req, res) => {

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


        const user = await userModel.findOne({ _id: userId, favourites: movieId });

        if (user) {
            await userModel.updateOne(
                { _id: userId },
                { $pull: { favourites: movieId } }
            );

            return res.json({
                success: true,
                message: "Favourite removed successfully"
            });
        }

        const result = await userModel.updateOne(
            { _id: userId },
            { $addToSet: { favourites: movieId } }
        );


        // if (result.matchedCount === 0) {
        //     return res.status(404).json({ message: "User not found" });
        // }


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







export const getFavourite = async (req, res) => {

    try{
        const userId = req.userId;

        const favourites = await userModel.findById(userId).populate("favourites");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            movies: favourites
        });

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