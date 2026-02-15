import { bookingModel } from "../models/Booking.js"
import { showModel } from "../models/Show.js"
import { userModel } from "../models/User.js"



export const getDashboardData = async (req, res) => {

    try{
        const bookings = await bookingModel.find({isPaid: true})

        const activeShows = await showModel.find({showDateTime: {$gte: new Date()}}).populate('movie')

        const totalUser = await userModel.countDocuments()

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUser
        }


        res.json({
            success: true,
            dashboardData
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




export const getAllShows = async (req, res) => {

    try{
        const shows = await showModel.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1, showPrice: 1})

        res.json({
            success: true,
            shows
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






export const getAllBookings = async (req, res) => {

    try{
        const bookings = await bookingModel.find({}).populate('user').populate({
            path: "show",
            populate: {path: "movie"}
        }).sort({createdAt: -1})


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