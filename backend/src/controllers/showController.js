import axios from "axios"
import { movieModel } from "../models/Movie.js"
import { showModel } from "../models/Show.js"



// Api to get now playing movies from TMDB
export const getNowPlayingMovies = async (req, res) => {
    
    try
    {
        const {data} = await axios.get("https://api.themoviedb.org/3/movie/now_playing",
            {
                headers: {
                    Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                }
            }
        )


        const movies = data.results

        res.json({
            success: true,
            movies: movies
        })

    }
    catch(err)
    {
        console.error(err);
        
        res.json({
            success: false,
            message: err.message,
            message2: "error in getNowPlayingMovies controller function"
        })
    }
}





// API to add a new show to the database
export const addShow = async (req, res) => {

    try{
        const {movieId, showsInput, showPrice} = req.body

        let movie = await movieModel.findById(movieId)

        if(!movie)
        {
            // fetch movie details & credits from tmdb
            const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                ),

                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
                        }
                    }
                )
            ])


            const movieApiData = movieDetailsResponse.data
            const movieCreditsData = movieCreditsResponse.data


            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language || "",
                tagline: movieApiData.tagline || "",
                genres: movieApiData.genres,
                casts: movieCreditsData.cast,
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime
            }



            // adding movie to mongodb
            movie = await movieModel.create(movieDetails)
        }

        
        const showsToCreate = []

        showsInput.forEach(show => {
            const showDate = show.date

            show.time.forEach((time)=>{
                const dateTimeString = `${showDate}T${time}`

                showsToCreate.push({
                    movie: movieId,
                    showDateTime: new Date(dateTimeString),
                    showPrice,
                    occupiedSeats: {}
                })
            })
        });


        if(showsToCreate.length > 0)
        {
            await showModel.insertMany(showsToCreate)
        }


        res.json({
            success: true,
            message: "Show added successfully"
        })

        
    }
    catch(err)
    {
        console.error(err);
        
        res.json({
            success: false,
            message: err.message,
            message2: "error in addShow to db controller function"
        })
    }
}








// Api to get all shows from DB

export const getShows = async (req, res) => {

    try{
        const shows = await showModel.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({showDateTime: 1})


        const uniqueShows = new Set(shows.map(show => show.movie))


        res.json({
            success: true,
            shows: Array.from(uniqueShows)
        })
    }
    catch(e){
        console.error(e)

        res.json({
            success: false,
            message: err.message,
            message2: "error in getShows (getting alll shows from db) db controller function"
        })
    }
}





// Api to get one single show from DB

export const getShowOne = async (req, res) => {

    try{
        const {movieId} = req.params

        const shows = await showModel.find({
            movie: movieId,
            showDateTime: {$gte: new Date()}
        })

        const movie = await movieModel.findById(movieId)

        const dateTime = {}

        shows.forEach((show) => {
            const data = show.showDateTime.toISOString().split("T")[0]

            if(!dateTime[date])
            {
                dateTime[date] = []
            }

            dateTime[date].push({
                time: show.showDateTime,
                showId: show._id
            })
        })



        res.json({
            success: true,
            movie,
            dateTime
        })




    }
    catch(e)
    {
        console.error(e)

        res.json({
            success: false,
            message: err.message,
            message2: "error in getShowOne (getting one show from db) db controller function"
        })
    }
}