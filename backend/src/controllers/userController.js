import { bookingModel } from "../models/Booking";



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
            success: true,
            message: e.message
        })
    }
}