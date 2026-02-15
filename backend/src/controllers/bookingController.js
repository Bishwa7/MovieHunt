import { bookingModel } from "../models/Booking.js";
import { showModel } from "../models/Show.js"



const checkSeatsAvailabe = async (showId, selectedSeats) => {

    try{
        const showData = await showModel.findById(showId)

        if(!showData)
        {
            return false;
        }


        const occupiedSeats = showData.occupiedSeats;


        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat])


        return !isAnySeatTaken;


    }
    catch(e)
    {
        console.error(e)

        return false;

    }

}






export const createBooking = async (req, res) => {


    try{
        const userId = req.userId
        const {showId, selectedSeats} = req.body

        const {origin} = req.headers


        const isAvailable = await checkSeatsAvailabe(showId, selectedSeats)

        if(!isAvailable)
        {
            return res.json({
                success: false,
                message: "Selected seats are not available"
            })
        }


        const showData = await showModel.findById(showId).populate('movie')


        // booking new
        const booking = await bookingModel.create({
            user: userId,
            show: showId,
            amaount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })


        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');



        await showData.save()



        //payment logic


        //payment logic
        




        res.json({
            success: true,
            message: "Booking successful"
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






export const getOccupiedSeats = async (req, res) => {

    try{
        const {showId} = req.params;
        const showData = await showModel.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)


        res.json({
            success: true,
            occupiedSeats
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